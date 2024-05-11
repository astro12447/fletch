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
	"sync"
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

// C_path , C_Size , C_time_slap , C_time_modification;
// @ServeHTTP регистрирует детали запроса и делегирует их обернутому @ServeMux.
// Он реализует интерфейс @http.Handler.
func (h *CustomHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	//Зарегистрируем детали запроса.
	log.Printf("Получен запрос от %s: %s %s", r.RemoteAddr, r.Method, r.URL.Path)
	//Делегируем завернутый @ServeMux.
	h.mux.ServeHTTP(w, r)
}

type params struct {
	root string
	sort string
}

func newparams(root, sort string) params {
	return params{
		root: root,
		sort: sort,
	}
}

// Функция получает из запроса два параметра URL «rootValue» значение корневого параметра.
// sortValue: значение параметра «sort»
func handlerData(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		rawParams := r.URL.RawQuery                   // Получаем необработанную строку запроса.
		queryParams, err := url.ParseQuery(rawParams) //Разобираем необработанную строку запроса в карту параметров запроса.
		if err != nil {
			panic(err)
		}
		myparams := newparams(queryParams.Get("root"), queryParams.Get("sort"))
		stat, err := os.Stat(myparams.root)
		if err != nil {
			panic(err)
		}
		Root := functions.Root{Name: myparams.root}
		switch mode := stat.Mode(); {
		case mode.IsDir():
			//Если файл является каталогом, получаем данные подкаталога, обработаем любые ошибки,
			start := time.Now()                                 // Запишиваем время начала
			innerfiles, err := Root.GetSubDirRoutine(Root.Name) //вызываем метод GetSubDirRoutine для объекта Root и передаем Root.Name в качестве аргумента.
			elapsed := time.Since(start).String()               // Подсчитаем прошедшее время
			if err != nil {
				panic(err)
			}
			//Отсортируем фрагмент данных файлов, используя предоставленный корень и параметры сортировки.
			if myparams.sort == "Desc" {
				sortData := functions.SortFilesBySizeDesc(innerfiles)
				jsonData := functions.Info{Files: sortData, Elapsedtime: elapsed, PathName: Root.Name}
				var wg sync.WaitGroup // WaitGroup для ожидания завершения всех горутин
				wg.Add(1)             //Добавяем 2 в WaitGroup, чтобы учесть две горутины.
				go sendJSON(w, r, jsonData, &wg)
				wg.Wait()
			} else {
				sortData := functions.SortFilesBySizeAsc(innerfiles)
				jsonData := functions.Info{Files: sortData, Elapsedtime: elapsed, PathName: Root.Name}
				var wg sync.WaitGroup // WaitGroup для ожидания завершения всех горутин
				wg.Add(1)             //Добавяем 2 в WaitGroup, чтобы учесть две горутины.
				go sendJSON(w, r, jsonData, &wg)
				wg.Wait()
			}
			//one go rutine to send jsonData to the serverApache.
		default:
			fmt.Println("")
		}
	}

}

// функция, которая отправляет клиенту ответ JSON.
func sendJSON(w http.ResponseWriter, _ *http.Request, files functions.Info, wg *sync.WaitGroup) {
	defer wg.Done()
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
	mux.HandleFunc("/files", handlerData)
	//Загрузкаs файлы в сервер  с помощью ServeMux по пути /js/.
	mux.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("./js"))))
	mux.Handle("/ts/", http.StripPrefix("/ts/", http.FileServer(http.Dir("./ts"))))
	mux.Handle("/", http.FileServer(http.Dir("./templates")))
	mux.Handle("/templates/", http.StripPrefix("/templates/", http.FileServer(http.Dir("./templates"))))
	mux.Handle("/dist/", http.StripPrefix("/dist/", http.FileServer(http.Dir("./dist"))))
	// Обернем ServeMux пользовательским обработчиком.
	//path := "/Users/ismaelnvo/Desktop/"
	//Root := functions.Root{Name: path}

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
		// Просим слушателя выключиться и отключить загрузку.
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
