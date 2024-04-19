
VerificateURl;
// Функция получения данных с сервера с ответом JSON
async function fetchAndDisplay(url: string): Promise<void> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ошибка! положение : ${response.status}`);
        }
        console.log("Response OK!");
        const files: any[] = await response.json();

        // Вызов функции для отображения элементов в таблице
        DisplayItems(files);
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
    }
}
//Функция для проверки «params» параметров «root» и «sort».
function VerificateURl(params: { sort: string, root: string | null }): void {
    const parameters: { root: string, sort: string } = GetDynamicUrlParams();
    console.log(parameters.root, parameters.sort)
    if (parameters.sort === "&sort=null" && parameters.root !== null) {
        fetchAndDisplay(parameters.root);

    } else if (parameters.sort === "&sort=Desc" && parameters.root !== null) {
        var concatenateRoot: string = parameters.root + "/" + parameters.sort;
        fetchAndDisplay(concatenateRoot);
    } else {
        console.log("");
    }
}
//Функция для создания табличных элементов «tr» и «td». 
function DisplayItems(items: Array<{ name: string, typefile: string, sizeInKB: number }>): void {
    const filesTableBody = document.getElementById('filesTableBody') as HTMLTableElement
    // Получение элементов, в которых мы хотим отобразить данные.
    items.forEach(file => {
        const row: HTMLTableRowElement = document.createElement('tr');
        // Создание ячейки для каждого свойства пользователя.
        const nameCell: HTMLTableCellElement = document.createElement('td');
        nameCell.textContent = file.name;

        const typefileCell: HTMLTableCellElement = document.createElement('td');
        typefileCell.textContent = file.typefile;

        const sizelCell: HTMLTableCellElement = document.createElement('td');
        sizelCell.textContent = file.sizeInKB.toString();
        // Добавление ячейки в строку
        row.appendChild(typefileCell);
        row.appendChild(nameCell);
        row.appendChild(sizelCell);
        // Добавление строки в тело таблицы
        if (filesTableBody) {
            filesTableBody.appendChild(row);
        }
    });
}

//// Получение текущий URL
function GetDynamicUrlParams(): { root: string, sort: string } {
    const url = new URL(window.location.href);
    // Получение параметры «root» и «sort».
    const root = url.searchParams.get('root');
    const sort = url.searchParams.get('sort');
    const newRoot = "./files?root=" + root;
    const newSort = "&sort=" + sort;
    // Возвращаем объект с параметрами
    return {
        root: newRoot,
        sort: newSort
    };
}
//функция, которая будет вызываться при клике на элементы таблицы. Функция принимает один параметр event, который представляет событие клика.
function cellEventClick(event:MouseEvent):void{
    const target = event.target as HTMLTableCellElement
    if (target.tagName==='TD'){
        const dtValue = target.textContent;
        console.log("Нажатые данные ячейки", dtValue);
    }
}
//добавляем обработчик событий клика на таблицу. Обработчик событий - это функция cellEventClick, которая будет вызываться при каждом клике на таблицу
const Table = document.getElementById('filesTable') as HTMLTableElement;
Table?.addEventListener('click', cellEventClick);

