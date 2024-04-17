package functions

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"sync"
)

// Предполагая, что «file» — это структура, представляющая файл.
type file struct {
	Typefile    string `json:"typefile"`    //поле Тип файла
	Name        string `json:"name"`        //поле Имя файла
	SizeInKB    string `json:"sizeInKB"`    //поле размер файла в КБ
	SizeInBytes int64  `json:"sizeInBytes"` //поле размер файла в байтах
}

// «newfile» является функцией-конструктором файловой структуры
func newfile(typefile string, name string, sizeInKB string, sizeInBytes int64) file {
	return file{
		Typefile:    typefile,
		Name:        name,
		SizeInKB:    sizeInKB,
		SizeInBytes: sizeInBytes,
	}
}

// «readPath» — это интерфейс, определяющий метод получения подкаталогов.
type readPath interface {
	GetsubDir(root string) ([]file, error)
}

// определение структуры для «Root» с одним полем «Name», которое предназначено для представления имени файла или каталога.
type Root struct {
	Name string //поле имя файлы
}

// функция используется для чтения файлов в текущем каталоге.
var mutex sync.Mutex

func (root *Root) GetSubDirRoutine(dirname string) ([]file, error) {
	if !RootExist(dirname) {
		log.Fatalln("Данный файл или каталог отсутствует!")
	}
	files, err := os.ReadDir(dirname)
	var Items []file
	if err != nil {
		panic(err)
	}
	for _, file := range files {
		if file.IsDir() {
			info, err := file.Info()
			path, err := getFileLocation(dirname, info.Name())
			if err != nil {
				panic(err)
			}
			size, err := dirSize(path)
			if err != nil {
				panic(err)
			}
			//Заблокируем мьютекс перед доступом к общему ресурсу.
			mutex.Lock()
			//Убедимся, что мьютекс разблокирован после завершения этой горутины.
			defer mutex.Unlock()
			//Критический раздел: общий ресурс защищен мьютексом.
			Items = append(Items, newfile("Каталог", path, BytesToKB(size), size))
		} else if file.Type().IsRegular() {
			info, err := file.Info()
			if err != nil {
				panic(err)
			}
			path, err := getFileLocation(dirname, info.Name())
			if err != nil {
				panic(err)
			}
			Items = append(Items, newfile("Файл", path, BytesToKB(info.Size()), info.Size()))
		}
	}
	return Items, nil
}

func GetDirPath(dirname string) ([]file, error) {
	if !RootExist(dirname) {
		log.Fatalln("Данный файл или каталог отсутствует!")
	}

	files, err := os.ReadDir(dirname)
	if err != nil {
		return nil, err
	}
	var Items []file
	var wg sync.WaitGroup
	var mu sync.Mutex

	for _, entry := range files {
		wg.Add(1)
		go func(entry os.DirEntry) {
			defer wg.Done()
			path := filepath.Join(dirname, entry.Name())
			info, err := entry.Info()
			if err != nil {
				log.Printf("Ошибка получения информации для %s: %v\n", path, err)
				return
			}
			if entry.IsDir() {
				size, err := dirSize(path)
				if err != nil {
					log.Printf("Ошибка расчета размера каталога для %s: %v\n", path, err)
					return
				}
				mu.Lock()
				Items = append(Items, newfile("Каталог", path, BytesToKB(size), size))
				mu.Unlock()
			} else {
				Items = append(Items, newfile("Файл", path, BytesToKB(info.Size()), info.Size()))
			}
		}(entry)
	}

	wg.Wait()
	return Items, nil
}

// getFileLocation создает путь к файлу для данного имени файла в корневом каталоге.
func getFileLocation(root string, filename string) (string, error) {
	if !RootExist(root) {
		log.Fatalln("Данный файл или каталог отсутствует!!")
	}
	return root + string(os.PathSeparator) + filename, nil
}

// функция BytesToKB преобразует размер в байтах в килобайты (КБ) и возвращает его в виде строки.
func BytesToKB(size int64) string {
	sizeInKBStr := fmt.Sprintf("%.9f", (float64(size) / 1024.0))
	return sizeInKBStr + "KB"
}

// функция GetData извлекает данные из корневого каталога.
func GetDataRoutine(root string) []file {
	pathDir := Root{Name: root}
	dataTable, err := pathDir.GetSubDirRoutine(pathDir.Name)
	if err != nil {
		panic(err)
	}
	return dataTable
}

// определение функции для ввода информации классы Files в консоль
func (ob *file) print() {
	fmt.Println("Type:", ob.Typefile, "Name:", ob.Name, "FileSize/byte", ob.SizeInBytes)
}

// dirSize вычисляет общий размер всех файлов в каталоге и его подкаталогах.
func dirSize(path string) (int64, error) {
	var size int64
	err := filepath.Walk(path, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		size += info.Size()
		return nil
	})

	return size, err
}

// функция для проверкаи попки
func RootExist(root string) bool {
	if _, err := os.Stat(root); err != nil {
		log.Fatal("Root не существует...!")
	}
	return true
}

// метод для получения значения size класса
func (ob *file) getSize() int64 {
	return ob.SizeInBytes
}

// метод для получения значения name класса
func (ob *file) getName() string {
	return ob.Name
}

// метод для получения значения Extension класса
func (ob *file) getExtension() string {
	return ob.Typefile
}

// выборка сортировки
func SortSlice(slice []file, root string, order string) []file {
	// Создание копию фрагмента, чтобы избежать изменения исходного фрагмента.
	sortedSlice := make([]file, len(slice))
	copy(sortedSlice, slice)

	// Определение порядок сортировки на основе корневого параметра.
	if root != "" && order == "Desc" {
		// Сортировка по убыванию, если корень пуст.
		sort.Slice(sortedSlice, func(i, j int) bool {
			return sortedSlice[i].SizeInBytes > sortedSlice[j].SizeInBytes
		})
	} else if root != "" && order == "" {
		// Сортировка по возрастанию, если корень не пуст.
		sort.Slice(sortedSlice, func(i, j int) bool {
			return sortedSlice[i].SizeInBytes < sortedSlice[j].SizeInBytes
		})
	}

	return sortedSlice
}
