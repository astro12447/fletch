/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HandleCellClick = exports.Back = void 0;
//Определяем класс файла.
class File {
    //Конструктор класса File
    constructor(typefile, name, sizeInKB, folder) {
        //Инициализируйте свойства значениями, переданными конструктору.
        this.typefile = typefile;
        this.name = name;
        this.sizeInKB = sizeInKB;
        this.folder = folder;
    }
}
//определяем класс URLParameter, который отвечает за обработку параметров URL.
class URLParameter {
    constructor() {
        this.root = "./files"; //Корневое свойство "root" инициализируется значением по умолчанию «./files». 
        this.sort = ""; // Свойство "sort" инициализируется пустой строкой, что указывает на то, что сортировка не применяется.
    }
    //Геттер для root.
    get Root() {
        return this.root;
    }
    // Сеттер для root.
    set Root(value) {
        if (value !== null && value !== undefined) {
            this.root = "./files?root=" + encodeURIComponent(value);
        }
        else {
            // Обработка случай, когда значение равно нулю или неопределенно
            this.root = "./files"; // Или какое-то другое значение по умолчанию
        }
    }
    // Геттер для sort.
    get Sort() {
        return this.sort;
    }
    //Сеттер для sort.
    set Sort(value) {
        if (value !== null && value !== undefined) {
            this.sort = "&sort=" + encodeURIComponent(value);
        }
        else {
            // Обработка случай, когда значение равно нулю или неопределенно
            this.sort = ""; // Или какое-то другое значение по умолчанию
        }
    }
}
//
function createCellColumns(items) {
    const filesTableBody = document.getElementById('filesTableBody');
    // Получение элементов, в которых мы хотим отобразить данные.
    items.forEach(file => {
        const row = document.createElement('tr');
        // Создание ячейки для каждого свойства пользователя.
        const nameCell = document.createElement('td');
        nameCell.textContent = file.name;
        const typefileCell = document.createElement('td');
        typefileCell.textContent = file.typefile;
        const sizelCell = document.createElement('td');
        sizelCell.textContent = file.sizeInKB;
        const foldeCell = document.createElement('td');
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
function fetchData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url); // Используем API-интерфейс выборки, чтобы сделать запрос GET по предоставленному URL-адресу.
            if (!response.ok) { // Если ответ не ок (статус не в диапазоне 200-299), выдать ошибку
                throw new Error(`HTTP ошибка! положение : ${response.status}`);
            }
            console.log("Response OK!"); // Зарегистрируем сообщение об успехе, если ответ в порядке.
            const files = yield response.json(); // Разбераем тело ответа в массиве тип File как JSON и дождитесь его завершения.
            console.log('Files:', files.Files);
            console.log('Elapsedtime:', files.elapsedtime);
            createCellColumns(files.Files);
            const btnName = document.getElementById('btn-elapsedtime');
            if (btnName) {
                btnName.textContent = 'Elased:' + files.elapsedtime;
            }
            // Вызов функции для отображения элементов в таблице
        }
        catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    });
}
//Функция для проверки «params» параметров «root» и «sort».
function drawFilesTable() {
    const url = new URL(window.location.href); // Создаем новый объект URL-адреса на основе текущего URL-адреса.
    var root = url.searchParams.get('root'); // Получаем значение параметра запроса «root» из URL-адреса.
    var sort = url.searchParams.get('sort'); // Получаем значение параметра запроса «sort» из URL-адреса.
    switch (true) {
        case sort === 'Desc' && root !== null: //Случай, когда сортировка имеет значение «Desc», а корень не равен нулю.
            const urlparams = new URLParameter(); //Создаем новый экземпляр URLParameter.
            urlparams.Root = root; //Установлем для свойства Root urlparams значение корневой переменной.
            urlparams.Sort = sort; //Установлем для свойства Sort urlparams значение корневой переменной.
            let concat = urlparams.Root.concat(urlparams.Sort); // Объединяем свойств Root и Sort для urlparams
            fetchData(concat); // Вызовите функцию fetchData с объединенным URL-адресом в качестве аргумента.
            break; // Выйдим из оператора switch после выполнения этого случая.
        case root !== null && sort == null: // Случай, когда root не равен нулю, а sort имеет значение NULL.
            const urlparam = new URLParameter(); // Создаем новый экземпляр URLParameter.
            urlparam.Root = root; // Установлем для свойства Root urlparams значение корневой переменной.
            fetchData(urlparam.Root); //Вызов функцию fetchData с корневым URL-адресом в качестве аргумента.
            break; // Выйдим из оператора switch после выполнения этого случая
        default:
            console.log("");
    }
}
drawFilesTable(); //вызов Функции для проверки «params»
//Функция обработки собития на кнопки.
function Back() {
    //получаем элемент HTML с идентификатором «backButtom» и приведите его к HTMLElement или нулю.
    const backbuttom = document.getElementById('backButton');
    if (backbuttom) { // Проверяем, существует ли backButton
        //Добовляем прослушиватель событий клика в backButton
        backbuttom.addEventListener('click', function () {
            let currentUrl = new URL(window.location.href); // Создаем новый объект URL-адреса на основе текущего URL-адреса.
            let path = currentUrl.searchParams.get('root'); // Получаем значение параметра запроса «root» из URL-адреса.
            let parts = path === null || path === void 0 ? void 0 : path.split('/'); // Если путь существует, разделите его на части с помощью '/'
            parts === null || parts === void 0 ? void 0 : parts.pop(); // Если части существуют, удалите последнюю часть (фактически поднявшись на один уровень вверх).
            path = (parts === null || parts === void 0 ? void 0 : parts.join('/')) || null; // Соединяем части вместе, чтобы сформировать новый путь.
            if (path) { // Если путь не равен нулю (т. е. мы не находимся в корневом каталоге)
                updateRootParameter(path); //Обновлем корневой параметр в URL-адресе.
                window.location.reload(); // Перезагрузаем страницу, чтобы отразить изменения.
            }
        });
    }
}
exports.Back = Back;
Back(); //вызов Функции обработки собития на кнопки.
// Функция для обновления параметра запроса «root» в URL-адресе.
function updateRootParameter(newRootValue) {
    let url = new URL(window.location.href); // Создаем новый объект URL-адреса на основе текущего URL-адреса.
    // Create a new URLSearchParams object from the current URL's search parameters
    let searchParams = new URLSearchParams(url.search); // Создаём новый объект URLSearchParams на основе параметров поиска текущего URL
    searchParams.set('root', newRootValue);
    url.search = searchParams.toString(); //Обновяем свойство поиска объекта URL новыми параметрами поиска.
    history.pushState(null, '', url.toString()); //Обновяем историю браузера и URL-адрес без перезагрузки страницы.
}
// Функция для обработки щелчка по ячейке
function HandleCellClick(event) {
    // Check if the clicked element is a TD element
    if (event.target.tagName === 'TD') {
        // Get the text content of the clicked cell
        const cellText = event.target.textContent;
        windowsLocation(cellText);
    }
}
exports.HandleCellClick = HandleCellClick;
//Функция SetwindowsParams принимает строковый параметр Celldt, который может 
// быть строковым или нулевым. Затем он создает новый объект URL из текущего местоположения окна.
function windowsLocation(Celldt) {
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
    tableName.addEventListener('click', HandleCellClick);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.ts"](0, __webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map