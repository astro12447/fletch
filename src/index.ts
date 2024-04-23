
// Функция получения данных с сервера с ответом JSON
async function fetchAndDisplay(url: string): Promise<void> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ошибка! положение : ${response.status}`);
        }
        console.log("Response OK!");
        const files = await response.json();
        // Вызов функции для отображения элементов в таблице
        DisplayItems(files);
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
    }
}
//Функция для проверки «params» параметров «root» и «sort».
function VerificateURl(): void {
    const parameters: { root: string, sort: string } = GetDynamicUrlParams();
    console.log(parameters.root, parameters.sort)
    if (parameters.sort === "&sort=null" && parameters.root !== null) {
        fetchAndDisplay(parameters.root);

    } else if (parameters.sort === "&sort=Desc" && parameters.root !== null) {
        let concatenateRoot: string = parameters.root + "/" + parameters.sort;
        fetchAndDisplay(concatenateRoot);
    } else {
        console.log("");
    }
}
VerificateURl;
//Функция для создания табличных элементов «tr» и «td». 
function DisplayItems(items: Array<{ name: string, typefile: string, sizeInKB: number }>): void {
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
        sizelCell.textContent = file.sizeInKB.toString();
        // Добавление ячейки в строку
        row.appendChild(typefileCell);
        row.appendChild(nameCell);
        row.appendChild(sizelCell);
        // Добавление строки в тело таблицы

        filesTableBody?.appendChild(row);
    });
}
// Получение текущий URL
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

function GobackButton():void{
    //получаем элемент HTML с идентификатором «backButtom» и приведите его к HTMLElement или нулю.
    const backbuttom = document.getElementById('backButtom') as HTMLElement|null
    if (backbuttom){ // Проверяем, существует ли backButton
        //Добовляем прослушиватель событий клика в backButton
        backbuttom.addEventListener('click',function(){
            //При нажатии кнопки вернитесь в историю браузера.
            window.history.back();
        })
    }
}
GobackButton()//
// Функция для обработки щелчка по ячейке
function HandleCellClick(event:MouseEvent):void{
    if((event.target as HTMLElement).tagName==='TD'){
        const Celldt = (event.target as HTMLElement).textContent;
        let url = new URL(window.location.href);
        let sort = url.searchParams.get('sort');
        let root = url.searchParams.get('root');
        if (sort==null && root!=null){
            window.location.href = "?root=" + root;
        }
        if (sort=="Desc" && root!=null){
            window.location.href = "?root=" + Celldt + "&sort=Desc";
        }

    }
}
const tableName = document.getElementById('fileTable');
if (tableName !=null){
    tableName.addEventListener('click' , HandleCellClick)
}
