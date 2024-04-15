package functions

import (
	"flag"
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"sort"
)

// определение структуры файла
type file struct {
	Typefile    string `json:"typefile"` //поле Тип файла
	Name        string `json:"name"`     //поле Имя файла
	sizeInBytes int64  `json:"size"`     //поле размер файла в байтах
	SizeInKB    string `json:"sizeInKB"` //поле размер файла в КБ
}

// Функция создает структуру file с полями Typefile, Name и SizeInKB.
func newfile(typefile string, name string, size string) file {
	return file{
		Typefile: typefile,
		Name:     name,
		SizeInKB: size,
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
	var datafiles []file
	var size int64 = 0
	if !RootExist(root.Name) {
		log.Fatal("Данный файл или каталог отсутствует!")
	}
	filepath.Walk(root.Name, func(path string, info fs.FileInfo, err error) error {
		if err != nil {
			return nil
		}
		hasElements, err := DirectoryContainsElements(root.Name)
		if err != nil {
			panic(err)
		}
		switch mode := info.Mode(); {
		case mode.IsDir() && hasElements:
			size += info.Size()
			datafiles = append(datafiles, newfile("Каталог", path, BytesToKB(size)))
		case mode.IsDir() && !hasElements:
			datafiles = append(datafiles, newfile("Каталог", path, BytesToKB(info.Size())))
		case mode.IsRegular():
			datafiles = append(datafiles, newfile("Файл", path, BytesToKB(info.Size())))
		}
		return nil
	})

	return datafiles[1:len(datafiles)], nil
}

// функция для преобразования байта в КБ.
func BytesToKB(size int64) string {
	sizeInBytes := size
	sizeInKB := float64(sizeInBytes) / 1024
	sizeInKBStr := fmt.Sprintf("%.9f", sizeInKB)

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
	fmt.Println("Type:", ob.Typefile, "Name:", ob.Name, "FileSize/byte", ob.sizeInBytes)
}

// определение функции для получения строк через консоль
// revisar esa funcion no se puede llamar mas de una vez, devuelve error!!
func GetFilePathFromCommand(root string, sort string) (string, string, error) {
	if root == "None" || sort == "None" {
		log.Fatal("->Введите правильную командную строку:(--root=/pathfile  --sort=Desc) or --root=/pathfile")
	} else if root == "None" && sort != "" {
		log.Fatal("->Введите правильную командную строку:(--root=/pathfile  --sort=Desc) or --root=/pathfile")
	}

	var sourcepath *string
	var sortflag *string
	sourcepath = flag.String(root, "None", "")
	sortflag = flag.String(sort, "None", "")
	flag.Parse()

	return *sourcepath, *sortflag, nil

}

// Функция используется для чтения файлов в текущем каталоге.
// Функция len используется для получения количества файлов в каталоге.
// Если количество файлов равно 0, каталог пуст. В противном случае каталог содержит элементы.
func DirectoryContainsElements(path string) (bool, error) {
	// Abre el directorio
	dir, err := os.Open(path)
	if err != nil {
		return false, err
	}
	defer dir.Close()

	// читание все записи каталога
	entries, err := dir.Readdir(-1)
	if err != nil {
		return false, err
	}

	return len(entries) > 0, nil
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
	return ob.sizeInBytes
}

// метод для получения значения name класса
func (ob *file) getName() string {
	return ob.Name
}

// метод для получения значения Extension класса
func (ob *file) getExtension() string {
	return ob.Typefile
}

// функция для получения значения  size
func Getsize(filename string) (int64, error) {
	stat, err := os.Stat(filename)
	if err != nil {
		fmt.Println(err)
	}
	return stat.Size(), nil
}

// функция для Обработки сортировки по Убывающий
func SortAsc(arr []file) {
	sort.Slice(arr, func(i, j int) bool {
		return arr[i].sizeInBytes < arr[j].sizeInBytes
	})
}

// функция для Обработки сортировки по возврастающий
func SortDesc(arr []file) {
	sort.Slice(arr, func(i, j int) bool {
		return arr[i].sizeInBytes > arr[j].sizeInBytes
	})
}

// Чтение файлы из католога(Root)
func GetInfo(dirname string) ([]fs.FileInfo, error) {
	dir, err := os.Open(dirname)
	if err != nil {
		log.Fatal(err)
	}
	defer dir.Close()
	arrayInfo, err := dir.Readdir(-1)
	if err != nil {
		log.Fatal(err)
	}
	return arrayInfo, nil
}

// выборка сортировки
func SelectSort(files []file, root string, sortMode string) {
	switch {
	case root != "None" && sortMode == "None":
		SortAsc(files)
		for i := range files {
			files[i].print()
		}
		fmt.Println("")
	case sortMode == "Desc" && root != "None":
		SortDesc(files)
		for i := range files {
			files[i].print()
		}
	default:
		log.Fatal("->Введите правильную командную строку:(--root=/pathfile  --sort=Desc) or --root=/pathfile")
	}

}
