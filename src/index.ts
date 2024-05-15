//Определяем класс файла.
class file {
    //Свойства класса File
    filename: string;  //Имя файла
    typefile: string; // тип файла (например, txt, pdf, docx)
    sizeInMB: string;
    sizeInBytes: string;
    folder: string; // Папка, в которой находится файл
    //Конструктор класса File
    constructor(typefile: string, filename: string, sizeInMB: string, siseInbytes: string, folder: string) {
        //Инициализируйте свойства значениями, переданными конструктору.
        this.typefile = typefile;
        this.filename = filename;
        this.sizeInMB = sizeInMB;
        this.sizeInBytes = siseInbytes;
        this.folder = folder;
    }
}
class params {
    root: string | null;
    sort: string | null;
    constructor(root: string | null, sort: string | null) {
        this.root = root;
        this.sort = sort;
    }
}
function drawTable(items: file[]): void {
    const filesTableBody = document.getElementById('filesTableBody') as HTMLTableElement;
    // Получение элементов, в которых мы хотим отобразить данные.
    items.forEach(file=> {
        const row = document.createElement('tr') as HTMLTableRowElement;
        // Создание ячейки для каждого свойства пользователя.
        const nameCell = document.createElement('td') as HTMLTableCellElement;
        nameCell.textContent = file.filename;

        const typefileCell = document.createElement('td') as HTMLTableCellElement;
        typefileCell.textContent = file.typefile;
        const sizeInBMCell = document.createElement('td') as HTMLTableCellElement;
        sizeInBMCell.textContent = file.sizeInMB + " MiB";
        const foldeCell = document.createElement('td') as HTMLTableCellElement;
        foldeCell.textContent = file.folder;
        // Добавление ячейки в строку
        row.appendChild(typefileCell);
        row.appendChild(nameCell);
        row.appendChild(sizeInBMCell);
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
            throw new Error("");
        }
        console.log("Response OK!"); // Зарегистрируем сообщение об успехе, если ответ в порядке.
        const files = await response.json(); // Разбераем тело ответа в массиве тип File как JSON и дождитесь его завершения.
        console.log('Files:', files.Files);
        console.log('Elapsedtime:', files.elapsedtime);
        drawTable(files.Files);
        Drawelapsedtime(files.elapsedtime);
        DrawpathName(files.pathName);
        // Вызов функции для отображения элементов в таблице
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
    }
}

function navigateBack() {
    const currentUrl = new URL(window.location.href);
    const rootParam = currentUrl.searchParams.get('root');
    if (rootParam) {
        const rootParts = rootParam.split('/');
        rootParts.pop();
        const newRoot = rootParts.join('/');
        currentUrl.searchParams.set('root', newRoot);
        window.location.href = currentUrl.toString();
    }
}

// insertar texto en el botton con id:elapsedtime.
function Drawelapsedtime(param: any) {
    const elapsedtimeId = document.getElementById('btn-elapsedtime')
    if (elapsedtimeId) {
        elapsedtimeId.textContent = 'Elased:' + ' ' + param;
    }
}
function DrawpathName(param: any) {
    const elapsedtimeId = document.getElementById('pathName')
    if (elapsedtimeId) {
        elapsedtimeId.textContent = 'PathName:' + ' ' + param;
    }
}
function getJsonDatalink():string{
    const url = new URL(window.location.href); // files;
    url.pathname += "./files";
    let newULR = url.toString();
    return newULR;
}
//Функция для проверки «params» параметров «root» и «sort».
document.addEventListener("DOMContentLoaded", () => {
    //const url = new URL(window.location.href); // files;
    //url.pathname += "./files";
    let newULR = getJsonDatalink();
    fetchData(newULR);
    const backbuttom = document.getElementById('backButton');
    if(backbuttom){
        backbuttom.addEventListener("click", navigateBack);
    }
})

document.addEventListener('readystatechange', () => {
    var state = '';
    if (document.readyState === "loading") {
        state = "Loading";
    } else if (document.readyState === "interactive") {
        state = "Loading...";
    } else if (document.readyState === "complete") {
        state = "Loading......";
    }
    updateProgressBar(state);
});

function updateProgressBar(state: string): void {
    const progressBar = document.getElementById('progressBar') as HTMLDivElement;
    const progressText = document.createElement('span');
    progressText.textContent = state;
    progressBar.innerHTML = ''; // Clear any previous content
    progressBar.appendChild(progressText);

    // Update the width of the progress bar based on the state
    if (state === "Loading") {
        progressBar.style.width = "33%";
    } else if (state === "Loading...") {
        progressBar.style.width = "66%";
    } else if (state === "Loading......") {
        progressBar.style.width = "100%";
    }
}

function HandleCellClick(event: MouseEvent): void {
    // Check if the clicked element is a TD element
    if ((event.target as HTMLElement).tagName === 'TD') {
        // Get the text content of the clicked cell
        const cellText = (event.target as HTMLElement).textContent;
        UpadateRoot(cellText);
    }
}
//проверяет, не является ли имя_таблицы нулевым. Если tableName не равно нулю, к 
//элементу tableName добавляется прослушиватель событий, который прослушивает события щелчка.
 const tableName = document.getElementById('filesTable');
if (tableName) {
    tableName.addEventListener('click', HandleCellClick)
}
//Функция SetwindowsParams принимает строковый параметр Celldt, который может 
// быть строковым или нулевым. Затем он создает новый объект URL из текущего местоположения окна.
function UpadateRoot(Celldt: string | null): void {
    const url = new URL(window.location.href);
    try {
        if (Celldt) {
            url.searchParams.set('root', Celldt);
            window.location.href = url.toString();
        }
    } catch (error) {
        console.error("Данные ячейки не существуют!", error);
    }
}