package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"functions/functions"
	"log"
	"math/big"
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
type Info struct {
	Files       []functions.File `json:"Files"`
	Elapsedtime string           `json:"elapsedtime"`
	PathName    string           `json:"pathName"`
}
type Stat struct {
	PathName    string `json:"PathName"`
	ElapsedTime string `json:"ElapsedTime"`
	Size        string `json:"Size"`
}

func bytesToMB(bytes int64) *big.Float {
	const (
		byte  = 1
		kByte = 1024 * byte
		mByte = 1024 * kByte
	)

	mbits := new(big.Float)
	mbits.SetFloat64(float64(bytes) / float64(mByte))
	return mbits
}
func sum(files []functions.File) string {
	var totalSum int64 = 0
	for _, file := range files {
		totalSum += file.SizeInBytes
	}
	sizeInMB := bytesToMB(totalSum)
	return sizeInMB.String() + "MB"
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

// Функция получает из запроса два параметра URL «rootValue» значение корневого параметра.
// sortValue: значение параметра «sort»
func handlerData(w http.ResponseWriter, r *http.Request) {

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
		fmt.Printf("IS REGULAR")
	case mode.IsDir():
		//Если файл является каталогом, получаем данные подкаталога, обработаем любые ошибки,
		//отсортируйте данные, а затем отправьте ответ JSON с отсортированными данными.
		start := time.Now() //
		filesData, err := Root.GetSubDirRoutine(Root.Name)
		elapsed := time.Since(start).String() //
		if err != nil {
			panic(err)
		}
		//Отсортируем фрагмент данных файлов, используя предоставленный корень и параметры сортировки.
		data := functions.SortSlice(filesData, rootParam, sortParam)
		info := Info{Files: data, Elapsedtime: elapsed, PathName: Root.Name}   //
		sum := sum(info.Files)                                                 //
		InfoPath := Stat{PathName: Root.Name, ElapsedTime: elapsed, Size: sum} //
		fmt.Println(InfoPath.PathName, InfoPath.Size, InfoPath.ElapsedTime)    //
		var wg sync.WaitGroup                                                  //
		wg.Add(1)                                                              //
		go sendJSONResponse(w, r, info, &wg)                                   //Отправляем ответ JSON с отсортированными данными.
		wg.Wait()                                                              //
		var wg1 sync.WaitGroup                                                 //
		wg1.Add(1)                                                             //
		go sendRequestToApache(InfoPath, &wg1)                                 //
		wg1.Wait()                                                             //

	}
}
func sendRequestToApache(Infopath Stat, wg *sync.WaitGroup) error {
	defer wg.Done()
	JsonData, err := json.Marshal(Infopath)
	if err != nil {
		return err
	}
	req, err := http.NewRequest("POST", "http://localhost:443/insert.php", bytes.NewBuffer(JsonData))
	if err != nil {
		return err
	}
	req.Header.Set("Content-type", "application/json")
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode == http.StatusOK {
		fmt.Println("Request sucessful")
	} else {
		fmt.Println("Request failed with status:", resp.Status)
	}
	return nil
}

// функция, которая отправляет клиенту ответ JSON.
func sendJSONResponse(w http.ResponseWriter, r *http.Request, files Info, wg *sync.WaitGroup) {
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
