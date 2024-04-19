package main

import (
	"context"
	"encoding/json"
	"fmt"
	"functions/functions"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

// Config представляет конфигурацию приложения.
type config struct {
	Port int64 //Сетевой порт, который будет использоваться.
}

// функция, которая получает параметр URL из HTTP-запроса
func getUrlParameter(req *http.Request, paramName string) string {
	return req.URL.Query().Get(paramName)
}

// Функция получает из запроса два параметра URL:rootValue: значение корневого параметра.
// sortValue: значение параметра sort.
func handler(w http.ResponseWriter, r *http.Request) {
	// Получить значение параметра root
	rootValue := getUrlParameter(r, "root")

	// Получить значение параметра sort
	sortValue := getUrlParameter(r, "sort")
	// Выведите значения на консоль
	fmt.Println("Root value:", rootValue)
	fmt.Println("Sort value:", sortValue)
	sendJSONResponse(w, r, rootValue, sortValue)
	fmt.Println("json Отправлен")
}

// функция, которая отправляет клиенту ответ JSON.
func sendJSONResponse(w http.ResponseWriter, r *http.Request, root string, sort string) {

	Root := functions.Root{Name: root}
	data, err := Root.GetSubDirRoutine(Root.Name) //Вызов функции goroutines
	if err != nil {
		panic(err)
	}
	// Вызов Сортировки
	sortSlice := functions.SortSlice(data, root, sort)

	// Маршалируем данные в JSON
	jsonData, err := json.Marshal(sortSlice)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// Установите тип контента: application/json.
	w.Header().Set("Content-Type", "application/json")

	// Запишите данные JSON в ответ
	w.Write(jsonData)
}

func main() {
	// Создание новый ServeMux
	mux := http.NewServeMux()
	//Назначение функцию обработчика каждому URL-пути.
	mux.HandleFunc("/files", handler)
	fileServer := http.FileServer(http.Dir("./templates"))
	// Загрузка файлы в сервер с помощью ServeMux
	mux.Handle("/", fileServer)

	jsFileServer := http.FileServer(http.Dir("./js"))
	tsFileServer := http.FileServer(http.Dir("./ts"))

	//Загрузка файлы в сервер  с помощью ServeMux по пути /js/.
	mux.Handle("/js/", http.StripPrefix("/js/", jsFileServer))
	mux.Handle("/ts/", http.StripPrefix("/ts/", tsFileServer))
	// Создание HTTP-сервер
	// Read the config file
	configData, err := os.ReadFile("ui/config.json")
	if err != nil {
		log.Fatalf("Не удалось прочитать файл конфигурации: %v", err)
	}
	var config config
	err = json.Unmarshal(configData, &config)
	if err != nil {
		log.Fatalf("Не удалось проанализировать файл конфигурации.: %v", err)
	}
	//создает сервера новую конфигурацию с указанным портом.
	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", config.Port),
		Handler: mux,
	}
	// Создайте 2 каналa для прослушивания ошибок, исходящих от прослушивателя. Использовать
	// буферизованный канал, чтобы горутина могла завершить работу, если мы не обнаружим эту ошибку.
	serverErrors := make(chan error)
	shutdown := make(chan os.Signal, 1)
	otherErrors := make(chan error)
	// Запуска сервера в горутине
	go func() {
		serverErrors <- server.ListenAndServe()
	}()
	fmt.Println("Сервер работает на порту 8080")
	// Создание канал для прослушивания сигнала прерывания или завершения от ОС.
	// Использование буферизованный канал, поскольку этого требует пакет сигналов.
	signal.Notify(shutdown, os.Interrupt, syscall.SIGTERM)

	// Блокировка основного и ожидание выключения.
	select {
	case err := <-serverErrors:
		fmt.Printf("Ошибка запуска сервера: %v\n", err)
	case <-shutdown:
		fmt.Println("Начало выключения...")
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
		if err == http.ErrServerClosed {
			fmt.Println("Сервер успешно завершил работу")
		}
	case err := <-otherErrors:
		fmt.Printf("Возникла ошибка: %v\n", err)
	}

}
