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
exports.HandleCellClick = void 0;
//Определяем класс файла.
class File {
    //Конструктор класса File
    constructor(typefile, filename, sizeInMB, siseInbytes, folder) {
        //Инициализируйте свойства значениями, переданными конструктору.
        this.typefile = typefile;
        this.filename = filename;
        this.sizeInMB = sizeInMB;
        this.sizeInBytes = siseInbytes;
        this.folder = folder;
    }
}
class params {
    constructor(root, sort) {
        this.root = root;
        this.sort = sort;
    }
}
function drawTable(items) {
    const filesTableBody = document.getElementById('filesTableBody');
    // Получение элементов, в которых мы хотим отобразить данные.
    items.forEach(file => {
        const row = document.createElement('tr');
        // Создание ячейки для каждого свойства пользователя.
        const nameCell = document.createElement('td');
        nameCell.textContent = file.filename;
        const typefileCell = document.createElement('td');
        typefileCell.textContent = file.typefile;
        const sizeInBMCell = document.createElement('td');
        sizeInBMCell.textContent = file.sizeInMB + " MB";
        const foldeCell = document.createElement('td');
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
            drawTable(files.Files);
            Drawelapsedtime(files.elapsedtime);
            // Вызов функции для отображения элементов в таблице
        }
        catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    });
}
// insertar texto en el botton con id:elapsedtime.
function Drawelapsedtime(param) {
    const elapsedtimeId = document.getElementById('btn-elapsedtime');
    if (elapsedtimeId) {
        elapsedtimeId.textContent = 'Elased:' + ' ' + param;
    }
}
//Функция для проверки «params» параметров «root» и «sort».
document.addEventListener("DOMContentLoaded", () => {
    const url = new URL(window.location.href); // files;
    const param = new params(url.searchParams.get("root"), url.searchParams.get("sort"));
    if (param.root != "") {
        url.pathname += "./files";
        let newULR = url.toString();
        fetchData(newULR);
    }
});
const backbuttom = document.getElementById('backButton');
if (backbuttom) {
    backbuttom.addEventListener("click", () => {
        const url = new URL(window.location.href);
        let newRoot = url.searchParams.get("root");
        let parts = newRoot === null || newRoot === void 0 ? void 0 : newRoot.split('/');
        parts === null || parts === void 0 ? void 0 : parts.pop();
        newRoot = (parts === null || parts === void 0 ? void 0 : parts.join('/')) || null;
        if (newRoot) {
            updateRootParameter(newRoot);
            window.location.reload();
        }
    });
}
function convertBytesToMB(bytes) {
    const megabytes = bytes / (1024 * 1024);
    return parseFloat(megabytes.toFixed(4));
}
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
        UpadateRoot(cellText);
    }
}
exports.HandleCellClick = HandleCellClick;
//проверяет, не является ли имя_таблицы нулевым. Если tableName не равно нулю, к 
//элементу tableName добавляется прослушиватель событий, который прослушивает события щелчка.
const tableName = document.getElementById('filesTable');
if (tableName) {
    tableName.addEventListener('click', HandleCellClick);
}
//Функция SetwindowsParams принимает строковый параметр Celldt, который может 
// быть строковым или нулевым. Затем он создает новый объект URL из текущего местоположения окна.
function UpadateRoot(Celldt) {
    const url = new URL(window.location.href);
    try {
        if (Celldt) {
            url.searchParams.set('root', Celldt);
            window.location.href = url.toString();
        }
    }
    catch (error) {
        console.error("Cell data  don't exist!");
    }
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