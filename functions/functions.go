package functions

import (
	"errors"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
)

// определение структуры файла
type file struct {
	Typefile    string `json:"typefile"` //поле Тип файла
	Name        string `json:"name"`     //поле Имя файла
	SizeInKB    string `json:"sizeInKB"` //поле размер файла в КБ
	SizeInBytes int64  `json:"sizeInBytes"`
}

// Функция создает структуру file с полями тип файл, имя файла и размер файля в KB.
func newfile(typefile string, name string, sizeInKB string, sizeInBytes int64) file {
	return file{
		Typefile:    typefile,
		Name:        name,
		SizeInKB:    sizeInKB,
		SizeInBytes: sizeInBytes,
	}
}

// Интерфейс(ReadPath) с методом для считания root
type readPath interface {
	GetsubDir(root string) ([]file, error)
}

// Папка структуры
type Root struct {
	Name string //поле имя файлы
}

// функция используется для чтения файлов в текущем каталоге.
func (root *Root) GetSubDir(dirname string) ([]file, error) {
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
func getFileLocation(root string, filename string) (string, error) {
	if !RootExist(root) {
		return "", errors.New("Данный файл или каталог отсутствует!!")
	}
	return root + "/" + filename, nil
}

// функция для преобразования байта в КБ.
func BytesToKB(size int64) string {
	sizeInKBStr := fmt.Sprintf("%.9f", (float64(size) / 1024))
	return sizeInKBStr + "KB"
}

// функция возвращает массив файлов из текущего каталоге.
func GetData(root string) []file {
	pathDir := Root{Name: root}
	dataTable, err := pathDir.GetSubDir(pathDir.Name)
	if err != nil {
		panic(err)
	}
	return dataTable
}

// определение функции для ввода информации классы Files в консоль
func (ob *file) print() {
	fmt.Println("Type:", ob.Typefile, "Name:", ob.Name, "FileSize/byte", ob.SizeInBytes)
}

func dirSize(path string) (int64, error) {
	var size int64

	// Walk the directory tree
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
