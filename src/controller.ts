import { getJson, getSort,moveBackFromRoot} from "./model";
import {drawpathName, saveUrlWithRootAndSort,drawelapsedtime,drawTable,removeParag} from "./view";
const url = new URL(window.location.href);  // создаем новый объект URL на основе URL-адреса текущей страницы.
url.pathname += "./files"; // добавляем «./files» к пути URL-адреса.
const urlString = url.toString();  //конвертируем объект URL обратно в строку

//Добавляем прослушиватель событий для события DOMContentLoaded.
document.addEventListener('DOMContentLoaded', async () => {
    removeParag(); //Удаляем все существующие сообщения о загрузке из DOM
    const data = await getJson(urlString);  //получаем данные JSON из строки URL
    drawTable(data.Files); // Рисуем таблицу, используя свойство «Файлы» извлеченных данных
    drawpathName(data.pathName);  // обновляем имя пути в DOM, используя свойство pathName извлеченных данных.
    drawelapsedtime(data.elapsedtime); // обновляем прошедшее время в DOM, используя свойство elapsedtime извлеченных данных.
})

//получаем элемент таблицы с идентификатором filesTable и приводим его к HTMLTableElement.
const table = document.getElementById('filesTable') as HTMLTableElement;
//Добавляем прослушиватель событий клика в таблицу
table.addEventListener('click', (event: MouseEvent) => {
    removeParag(); // Удаляем все существующие сообщения о загрузке из DOM
    const rowData = handleCellClick(event); //Обработка события щелчка по ячейке в таблице
    if (rowData) {   //Проверяем, вернула ли функция handleCellClick действительные данные
        if (rowData[0] == "Каталог") { //Проверяем, является ли первый элемент массива данных «Каталог»
            //Новый URL-адрес основан на корневом параметре и параметрах сортировки из данных ячейки, на которую щелкнули.
            let link = saveUrlWithRootAndSort(rowData[1], getSort());
            getJson(link).then(data => {
                drawTable(data.Files);
                drawpathName(data.pathName);
                drawelapsedtime(data.elapsedtime);
            }).catch(error => {
                console.error('Ошибка при получении данных JSON:', error);
            });
        }
    }
});

//мы определяем функцию с именем «handleCellClick», которая принимает MouseEvent в качестве аргумента.
function handleCellClick(event: MouseEvent): string[] | null {
    const target = event.target as HTMLElement;
    if (target.tagName === 'TD') {
        const row = target.parentNode as HTMLTableRowElement;
        //Создаем массив внутреннего текста каждой ячейки строки
        const rowData = Array.from(row.cells).map(cell => cell.innerText);
        return rowData; //Возвращаем массив данных строк
    }
    return null;
}
const button = document.getElementById('moveBackButton') as HTMLButtonElement;
button.addEventListener('click', () => {
    removeParag();
    const currentRootElement = document.getElementById('pathName') as HTMLParagraphElement;
    const currentRoot = currentRootElement.textContent || '';
    if(currentRoot!==null){
        let newRoot = moveBackFromRoot(currentRoot);
        currentRootElement.textContent = newRoot;
        newRoot = newRoot.replace("PathName: ", "");
        let link = saveUrlWithRootAndSort(newRoot, getSort());
        getJson(link).then(data => {
            drawTable(data.Files);
            drawpathName(data.pathName);
            drawelapsedtime(data.elapsedtime);
        }).catch(error => {
            console.error('Error fetching JSON data:', error);
        });
    }
});
