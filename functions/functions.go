package functions

import (
	"fmt"
	"log"
	"math/big"
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

type Info struct { // Определяем тип структуры с именем Info
	Files       []File `json:"Files"`       //
	Elapsedtime string `json:"elapsedtime"` //Elapsedtime — это строка, представляющая прошедшее время.
	PathName    string `json:"pathName"`    // PathName — это строка, представляющая имя пути.
}

// Определяем тип структуры с именем Statistics(Stat)
type Stat struct {
	PathName    string `json:"PathName"`    //PathName — это строка, представляющая имя пути.
	ElapsedTime string `json:"ElapsedTime"` // ElapsedTime — это строка, представляющая прошедшее время.
	Size        string `json:"Size"`        // Размер — это строка, представляющая размер.
}

// Эта функция Go bytesToMB предназначена для преобразования целого числа байтов в
// большое значение. Плавающее значение, представляющее эквивалент в мегабайтах.
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

// Эта функция sum предназначена для расчета общего размера списка файлов в мегабайтах и ​
// ​возврата результата в виде форматированной строки.
func Sum(files []File) string {
	var totalSum int64 = 0
	for _, file := range files {
		totalSum += file.SizeInBytes
	}
	sizeInMB := bytesToMB(totalSum)
	return sizeInMB.String() + "MB"
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
		case mode.IsDir(): //Если это каталог, увеличиваем 1 счетчик WaitGroup и запустите горутину.
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
