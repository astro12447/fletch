package main

import (
	"encoding/json"
	"fmt"
	"functions/functions"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
)

// Функция для отправки массива данных JSON.
func getItemsHandler(root string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Создание массив элементов на основе параметра (root)
		data := functions.GetData(root)
		// Установите тип контента JSON.
		w.Header().Set("Content-Type", "application/json")
		// Закодирование массив элементов в JSON.
		if err := json.NewEncoder(w).Encode(data); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		fmt.Println("Json отправлен успешно отпрален...")
	}
}
func main() {
	rootflag := "root"
	sortflag := "sort"
	root, _, err := functions.GetFilePathFromCommand(rootflag, sortflag)
	if err != nil {
		fmt.Println(err)
	}
	go func() {
		ch := make(chan os.Signal, 1)
		signal.Notify(ch, syscall.SIGINT, syscall.SIGTERM)
		<-ch
		fmt.Println("Закрытие сервера...")
		os.Exit(0)
	}()
	http.HandleFunc("/files", getItemsHandler(root))
	http.Handle("/templates/", http.StripPrefix("/templates/", http.FileServer(http.Dir("templates"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("js"))))
	fmt.Println("Начало обслуживания в http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalln(err)
	}
}
