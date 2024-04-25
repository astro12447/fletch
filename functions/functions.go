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
type File struct {
	Typefile    string `json:"typefile"`    //поле Тип файла
	Name        string `json:"name"`        //поле Имя файла
	SizeInKB    string `json:"sizeInKB"`    //поле размер файла в КБ
	SizeInBytes int64  `json:"sizeInBytes"` //поле размер файла в байтах
	Folder      string `json:"folder"`
}

// «newfile» является функцией-конструктором файловой структуры
func newfile(typefile string, name string, sizeInKB string, sizeInBytes int64, folder string) File {
	//Инициализируйте свойства значениями, переданными конструктору.
	return File{
		Typefile:    typefile,
		Name:        name,
		SizeInKB:    sizeInKB,
		SizeInBytes: sizeInBytes,
		Folder:      folder,
	}
}

// «readPath» — это интерфейс, определяющий метод получения подкаталогов.
type readPath interface {
	GetsubDir(root string) ([]File, error)
}

// определение структуры для «Root» с одним полем «Name», которое предназначено для представления имени файла или каталога.
type Root struct {
	Name string //поле имя файлы
}

// GetSubDirRoutine — это метод корневой структуры, который принимает имя каталога в виде строки и возвращает
// a slice of File structs and an error.
func (root *Root) GetSubDirRoutine(dirname string) ([]File, error) {
	if !RootExist(dirname) { //Проверяем, существует ли каталог. Если этого не произойдет, зарегистрируйте тревожное сообщение и остановите выполнение.
		log.Panic("Данный файл или каталог отсутствует!")
	}
	//Прочтитаем записи справочника. Если произойдет ошибка, верните ее.
	files, err := os.ReadDir(dirname)
	if err != nil {
		return nil, err
	}
	var Items []File // Инициализируем пустой фрагмент для хранения структур File.
	//Mutex и WaitGroup для синхронизации.
	var mu sync.Mutex
	var wg sync.WaitGroup
	//Перебераем каждую запись каталога.
	for _, entry := range files {
		info, err := entry.Info() // Получаем FileInfo для записи. Если произойдет ошибка, зарегистрируйте ее и перейдите к следующей записи.
		if err != nil {
			log.Printf("Ошибка получения информации для %s: %v", entry.Name(), err)
			continue
		}
		//Включаем файловый режим, чтобы определить, каталог это или обычный файл.
		switch mode := info.Mode(); {
		case mode.IsDir(): //Если это каталог, увеличиваем счетчик WaitGroup и запустите горутину.
			wg.Add(1)
			go func(entry os.DirEntry) {
				defer wg.Done()                                    //Уменьшаем счетчик WaitGroup после завершения горутины.
				path, err := GetFileLocation(dirname, info.Name()) //Получаем полный путь к каталогу. Если произойдет ошибка, зарегистрируйте ее и вернитесь.
				if err != nil {
					log.Printf("Ошибка получения местоположения для %s: %v", entry.Name(), err)
					return
				}
				// Получаем размер каталога. Если произойдет ошибка, зарегистрируйте ее и вернитесь.
				size, err := dirSize(path)
				if err != nil {
					log.Printf("Ошибка получения размера для %s: %v", path, err)
					return
				}
				// Заблокируем мьютекс, чтобы безопасно добавить новый файл в срез «Элементы».
				mu.Lock()
				Items = append(Items, newfile("Каталог", path, BytesToKB(size), size, entry.Name()))
				mu.Unlock()
			}(entry)
		case mode.IsRegular():
			//Если это обычный файл, получите его полный путь и добавьте его в срез «Элементы».
			path, err := GetFileLocation(dirname, info.Name())
			if err != nil {
				log.Printf("Ошибка получения местоположения: %s: %v", info.Name(), err)
				continue
			}
			Items = append(Items, newfile("Файл", path, BytesToKB(info.Size()), info.Size(), info.Name()))
		}
	}

	wg.Wait()         // Подождем, пока все горутины завершатся.
	return Items, nil //Вернем срез Items и нулевую ошибку.
}

// getFileLocation создает путь к файлу для данного имени файла в корневом каталоге.
func GetFileLocation(root string, filename string) (string, error) {
	if !RootExist(root) {
		log.Fatalln("Данный файл или каталог отсутствует!!")
	}
	return root + "/" + filename, nil
}

// функция BytesToKB преобразует размер в байтах в килобайты (КБ) и возвращает его в виде строки.
func BytesToKB(size int64) string {
	sizeInKBStr := fmt.Sprintf("%.9f", (float64(size) / 1024.0))
	return sizeInKBStr + "KB"
}

// определение функции для ввода информации классы Files в консоль
func (ob *File) print() {
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
		log.Fatal("Данный файл или каталог отсутствует!")
	}
	return true
}

// метод для получения значения size класса
func (ob *File) getSize() int64 {
	return ob.SizeInBytes
}

// метод для получения значения name класса
func (ob *File) getName() string {
	return ob.Name
}

// метод для получения значения Extension класса
func (ob *File) getExtension() string {
	return ob.Typefile
}

// выборка сортировки
func SortSlice(slice []File, root string, order string) []File {
	// Создание копию фрагмента, чтобы избежать изменения исходного фрагмента.
	sortedSlice := make([]File, len(slice))
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
