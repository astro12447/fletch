package main

import (
	"context"
	"encoding/json"
	"fmt"
	"functions/functions"
	"log"
	"net/http"
	"net/url"
	"os"
	"os/signal"
	"syscall"
	"time"
)

// Структура для хранения конфигурации сервера.
type config struct {
	Port int64 //Сетевой порт, который будет использоваться.
}

// CustomHandler — это оболочка http.ServeMux, которая регистрирует каждый запрос..
type CustomHandler struct {
	mux *http.ServeMux //Экземпляр ServeMux, который будет обрабатывать запросы.
}

// @ServeHTTP регистрирует детали запроса и делегирует их обернутому @ServeMux.
// Он реализует интерфейс @http.Handler.
func (h *CustomHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	//Зарегистрируем детали запроса.
	log.Printf("Получен запрос от %s: %s %s", r.RemoteAddr, r.Method, r.URL.Path)
	//Делегируем завернутый @ServeMux.
	h.mux.ServeHTTP(w, r)
}

// Функция получает из запроса два параметра URL «rootValue» значение корневого параметра.
// sortValue: значение параметра «sort»
func handler(w http.ResponseWriter, r *http.Request) {

	rawParams := r.URL.RawQuery                   // Получаем необработанную строку запроса.
	queryParams, err := url.ParseQuery(rawParams) //Разобираем необработанную строку запроса в карту параметров запроса.
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	rootParam := queryParams.Get("root") // Получаем значение «root» параметра
	sortParam := queryParams.Get("sort") // Получаем значение «sort» параметра
	fmt.Println("root value:", rootParam)
	fmt.Println("sort value:", sortParam)
	// Теперь в Root хранится экземпляр структуры Root с именем «root»
	Root := functions.Root{Name: rootParam}
	//@GetSubDirRoutine - пример метода, который возвращает данные и ошибку
	stat, err := os.Stat(Root.Name) //Получаем информацию о файле для корневого каталога.
	//Если при получении информации о файле произошла ошибка, немедленно вернем.
	if err != nil {
		return
	}
	//Включаем файловый режим, чтобы определить, обычный ли это файл или каталог.
	switch mode := stat.Mode(); {
	case mode.IsRegular():
		//Если файл является обычным файлом, отправьте ответ JSON без данных.
		sendJSONResponse(w, r, nil)
	case mode.IsDir():
		//Если файл является каталогом, получаем данные подкаталога, обработаем любые ошибки,
		//отсортируйте данные, а затем отправьте ответ JSON с отсортированными данными.
		filesData, err := Root.GetSubDirRoutine(Root.Name)
		if err != nil {
			panic(err)
		}
		//Отсортируем фрагмент данных файлов, используя предоставленный корень и параметры сортировки.
		data := functions.SortSlice(filesData, rootParam, sortParam)
		sendJSONResponse(w, r, data) //Отправляем ответ JSON с отсортированными данными.
	}
}

// функция, которая отправляет клиенту ответ JSON.
func sendJSONResponse(w http.ResponseWriter, r *http.Request, files []functions.File) {
	// Маршалируем данные в @JSON
	jsonData, err := json.Marshal(files)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// Установите тип контента @application/json.
	w.Header().Set("Content-Type", "application/json")
	// Запишите данные @JSON в ответ
	w.Write(jsonData)
}

// @getServerPort считывает порт сервера из файла конфигурации и возвращает его в виде строки.
// Если при чтении файла или синтаксическом анализе JSON возникает ошибка, он регистрирует ошибку и возвращает ее.
func getServerPort() (string, error) {
	configData, err := os.ReadFile("ui/config.json") //Попытаем прочитать файл конфигурации.
	if err != nil {
		log.Fatalf("Не удалось прочитать файл конфигурации: %v", err)
	}
	var conf config // Объявлем переменную для хранения данных конфигурации.
	err = json.Unmarshal(configData, &conf)
	if err != nil {
		log.Fatalf("Не удалось проанализировать файл конфигурации.: %v", err)
	}
	return fmt.Sprintf(":%d", conf.Port), nil
}
func main() {
	// // Создаем новый ServeMux для маршрутизации запросов
	mux := http.NewServeMux()
	// Обработчик для всех запросов
	mux.HandleFunc("/files", handler)
	//Загрузкаs файлы в сервер  с помощью ServeMux по пути /js/.
	mux.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("./js"))))
	mux.Handle("/ts/", http.StripPrefix("/ts/", http.FileServer(http.Dir("./ts"))))
	mux.Handle("/", http.FileServer(http.Dir("./templates")))
	mux.Handle("/templates/", http.StripPrefix("/templates/", http.FileServer(http.Dir("./templates"))))

	// Обернем ServeMux пользовательским обработчиком.
	handler := &CustomHandler{mux: mux}
	// Получаем номер порта севера
	portNumber, err := getServerPort()
	if err != nil {
		panic(err)
	}
	//Настраиваем сервер
	server := &http.Server{
		Addr:    portNumber, //Порт, на котором будет слушать сервер
		Handler: handler,    // Обработчик, который будет обрабатывать каждый входящий запрос.
	}
	// Создайте 2 каналa для прослушивания ошибок, исходящих от прослушивателя. Использовать
	// буферизованный канал, чтобы горутина могла завершить работу, если мы не обнаружим эту ошибку.
	serverErrors := make(chan error)
	shutdown := make(chan os.Signal, 1)
	otherErrors := make(chan error)
	// Запуска сервера в горутине
	go func() {
		fmt.Println("Сервер работает на порту 8080:") //// Создание канал для прослушивания сигнала прерывания или завершения от ОС.
		serverErrors <- server.ListenAndServe()
	}()
	// Использование буферизованный канал, поскольку этого требует пакет сигналов.
	signal.Notify(shutdown, os.Interrupt, syscall.SIGTERM)

	// Блокировка основного и ожидание выключения.
	select {
	//Если возникла ошибка из канала serverErrors, выведите ее и проверяем, не является ли это ошибкой закрытия сервера.
	case err := <-serverErrors:
		fmt.Printf("Ошибка запуска сервера: %v\n", err)
		if err == http.ErrServerClosed {
			fmt.Println("Сервер успешно завершил работу:")
		}
		//Если сигнал получен на канале завершения работы, распечатайте сообщение и попытаемся корректно завершить работу сервера.
	case <-shutdown:
		fmt.Println("Начало выключения...:")
		const timeout = 5 * time.Second
		ctx, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()
		// Просит слушателя выключиться и отключить загрузку.
		err := server.Shutdown(ctx)
		if err != nil {
			fmt.Printf("Грациозное завершение работы не завершилось %v: %v\n", timeout, err)
			err = server.Close()
		}
		if err != nil {
			fmt.Printf("Не удалось корректно остановить сервер: %v\n", err)
		}
		// Если есть ошибка из каналаotherErrors, выведим ошибку.
	case err := <-otherErrors:
		fmt.Printf("Возникла ошибка: %v\n", err)
	}

}
