//Определяем класс файла.
class File {
    //Свойства класса File
    name: string;  //Имя файла
    typefile: string; // тип файла (например, txt, pdf, docx)
    sizeInKB: string; // Размер файла в килобайтах
    folder: string; // Папка, в которой находится файл
    //Конструктор класса File
    constructor(typefile: string, name: string, sizeInKB: string, folder: string) {
        //Инициализируйте свойства значениями, переданными конструктору.
        this.typefile = typefile;
        this.name = name;
        this.sizeInKB = sizeInKB;
        this.folder = folder;
    }
}
//определяем класс URLParameter, который отвечает за обработку параметров URL.
class URLParameter {
    private root: string = "./files"; //Корневое свойство "root" инициализируется значением по умолчанию «./files». 
    private sort: string = ""; // Свойство "sort" инициализируется пустой строкой, что указывает на то, что сортировка не применяется.

    //Геттер для root.
    public get Root(): string {
        return this.root;
    }
    // Сеттер для root.
    public set Root(value: string) {
        if (value !== null && value !== undefined) {
            this.root = "./files?root="+encodeURIComponent(value);
        } else {
            // Обработка случай, когда значение равно нулю или неопределенно
            this.root = "./files"; // Или какое-то другое значение по умолчанию
        }
    }
    // Геттер для sort.
    public get Sort(): string {
        return this.sort;
    }
    //Сеттер для sort.
    public set Sort(value: string) {
        if (value !== null && value !== undefined) {
            this.sort = "&sort=" + encodeURIComponent(value);
        } else {
            // Обработка случай, когда значение равно нулю или неопределенно
            this.sort = ""; // Или какое-то другое значение по умолчанию
        }
    }
}
//
function createCellColumns(items: File[]): void {
    const filesTableBody = document.getElementById('filesTableBody') as HTMLTableElement;
    // Получение элементов, в которых мы хотим отобразить данные.
    items.forEach(file => {
        const row = document.createElement('tr') as HTMLTableRowElement;
        // Создание ячейки для каждого свойства пользователя.
        const nameCell = document.createElement('td') as HTMLTableCellElement;
        nameCell.textContent = file.name;

        const typefileCell = document.createElement('td') as HTMLTableCellElement;
        typefileCell.textContent = file.typefile;

        const sizelCell = document.createElement('td') as HTMLTableCellElement;
        sizelCell.textContent = file.sizeInKB;
        const foldeCell = document.createElement('td') as HTMLTableCellElement;
        foldeCell.textContent = file.folder;
        // Добавление ячейки в строку
        row.appendChild(typefileCell);
        row.appendChild(nameCell);
        row.appendChild(sizelCell);
        row.appendChild(foldeCell);
        // Добавление строки в тело таблицы
        if (filesTableBody) {
            filesTableBody.appendChild(row);
        }
    });
}
// Определяем асинхронную функцию fetchData, которая принимает URL-адрес как строку и возвращает Promise<void>.
async function fetchData(url: string): Promise<void> {
    try {
        const response = await fetch(url); // Используем API-интерфейс выборки, чтобы сделать запрос GET по предоставленному URL-адресу.
        if (!response.ok) {  // Если ответ не ок (статус не в диапазоне 200-299), выдать ошибку
            throw new Error(`HTTP ошибка! положение : ${response.status}`);
        }
        console.log("Response OK!"); // Зарегистрируем сообщение об успехе, если ответ в порядке.
        const files: File[] = await response.json(); // Разбераем тело ответа в массиве тип File как JSON и дождитесь его завершения.
        if (files && files.length > 0) { //Если файлы существуют и есть хотя бы один файл, вызовите createCellColumns с файлами.
            createCellColumns(files);
        } else {
            console.error('Элемент не найден');
        }
        // Вызов функции для отображения элементов в таблице
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
    }
}
//Функция для проверки «params» параметров «root» и «sort».
function drawFilesTable() {
    const url = new URL(window.location.href); // Создаем новый объект URL-адреса на основе текущего URL-адреса.
    var root = url.searchParams.get('root'); // Получаем значение параметра запроса «root» из URL-адреса.
    var sort = url.searchParams.get('sort'); // Получаем значение параметра запроса «sort» из URL-адреса.
    switch(true){
        case sort === 'Desc' && root !== null: //Случай, когда сортировка имеет значение «Desc», а корень не равен нулю.
            const urlparams = new  URLParameter(); //Создаем новый экземпляр URLParameter.
            urlparams.Root = root; //Установлем для свойства Root urlparams значение корневой переменной.
            urlparams.Sort = sort; //Установлем для свойства Sort urlparams значение корневой переменной.
            let concat = urlparams.Root.concat(urlparams.Sort) // Объединяем свойств Root и Sort для urlparams
            fetchData(concat);  // Вызовите функцию fetchData с объединенным URL-адресом в качестве аргумента.
            break; // Выйдим из оператора switch после выполнения этого случая.
        case root !==null && sort==null:  // Случай, когда root не равен нулю, а sort имеет значение NULL.
            const urlparam = new  URLParameter(); // Создаем новый экземпляр URLParameter.
            urlparam.Root = root; // Установлем для свойства Root urlparams значение корневой переменной.
            fetchData(urlparam.Root); //Вызов функцию fetchData с корневым URL-адресом в качестве аргумента.
            break;// Выйдим из оператора switch после выполнения этого случая
        default:
            console.log("");
    }
}
drawFilesTable();//вызов Функции для проверки «params»
//Функция обработки собития на кнопки.
export function Back(): void {
    //получаем элемент HTML с идентификатором «backButtom» и приведите его к HTMLElement или нулю.
    const backbuttom = document.getElementById('backButton');
    if (backbuttom) { // Проверяем, существует ли backButton
        //Добовляем прослушиватель событий клика в backButton
        backbuttom.addEventListener('click', function () {
            let currentUrl = new URL(window.location.href); // Создаем новый объект URL-адреса на основе текущего URL-адреса.
            let path = currentUrl.searchParams.get('root'); // Получаем значение параметра запроса «root» из URL-адреса.
            let parts = path?.split('/'); // Если путь существует, разделите его на части с помощью '/'
            parts?.pop(); // Если части существуют, удалите последнюю часть (фактически поднявшись на один уровень вверх).
            path = parts?.join('/') || null; // Соединяем части вместе, чтобы сформировать новый путь.
            if (path) {  // Если путь не равен нулю (т. е. мы не находимся в корневом каталоге)
                updateRootParameter(path);  //Обновлем корневой параметр в URL-адресе.
                window.location.reload();  // Перезагрузаем страницу, чтобы отразить изменения.
            }
        })
    }
}
Back();//вызов Функции обработки собития на кнопки.
// Функция для обновления параметра запроса «root» в URL-адресе.
function updateRootParameter(newRootValue: string): void {
    let url = new URL(window.location.href);// Создаем новый объект URL-адреса на основе текущего URL-адреса.
    // Create a new URLSearchParams object from the current URL's search parameters
    let searchParams = new URLSearchParams(url.search); // Создаём новый объект URLSearchParams на основе параметров поиска текущего URL
    searchParams.set('root', newRootValue);
    url.search = searchParams.toString();//Обновяем свойство поиска объекта URL новыми параметрами поиска.
    history.pushState(null, '', url.toString());//Обновяем историю браузера и URL-адрес без перезагрузки страницы.
}

// Функция для обработки щелчка по ячейке
export function HandleCellClick(event: MouseEvent): void {
    // Check if the clicked element is a TD element
    if ((event.target as HTMLElement).tagName === 'TD') {
        // Get the text content of the clicked cell
        const cellText = (event.target as HTMLElement).textContent;
        windowsLocation(cellText);
    }
}
//Функция SetwindowsParams принимает строковый параметр Celldt, который может 
// быть строковым или нулевым. Затем он создает новый объект URL из текущего местоположения окна.
function windowsLocation(Celldt: string | null): void {
    const url = new URL(window.location.href);
    // Получаем текущие значения параметров запроса «sort» и «root».
    let sort = url.searchParams.get('sort');
    let root = url.searchParams.get('root');
    if (sort === null && root !== null) {
        window.location.href = "?root=" + Celldt;
    }
    // Если для сортировки установлено значение «Desc», а значение root не 
    // равно нулю, создайте новый URL-адрес с установленными параметрами root и sort.
    else if (sort === "Desc" && root !== null) {
        window.location.href = "?root=" + Celldt + "&sort=Desc";
    }
}
//проверяет, не является ли имя_таблицы нулевым. Если tableName не равно нулю, к 
//элементу tableName добавляется прослушиватель событий, который прослушивает события щелчка.
const tableName = document.getElementById('filesTable');
console.log(tableName);
if (tableName) {
    tableName.addEventListener('click', HandleCellClick)
}
