
import { File } from "./model";//Экспортируем функцию, чтобы ее можно было использовать в других модулях
//функция для создания URL-адреса, указывающего на определенный каталог («./files») в том же домене, что и текущая страница, с настраиваемыми параметрами запроса для «корня» и «сортировки».
export function saveUrlWithRootAndSort(rootValue: string, sortValue: string): string {
    //создаем новый объект URL на основе URL-адреса текущей страницы.
    const currentUrl = new URL(window.location.href);
    //создаем новый объект URL, который включает протокол, имя хоста и дополнительный порт.
    const newUrl = new URL(`${currentUrl.protocol}//${currentUrl.hostname}${currentUrl.port ? ':' + currentUrl.port : ''}`);
    //устанавливаем путь нового URL-адреса к «./files»
    newUrl.pathname = './files'; // Set the path to './files'
    //добавляем или обновляем параметр запроса «root», используя предоставленное rootValue
    newUrl.searchParams.set('root', rootValue);
    //добавляем или обновляем параметр запроса sort, используя предоставленное значение sortValue.
    newUrl.searchParams.set('sort', sortValue);
    //конвертируем новый объект URL обратно в строку и возвращаем его
    const urlString = newUrl.toString();

    return urlString;
}
//функция для динамического обновления содержимого элемента HTML, чтобы показать прошедшее время
export function drawelapsedtime(param: any) {
    //Получаем HTML-элемент с идентификатором 'btn-elapsedtime'
    const elapsedtimeId = document.getElementById('btn-elapsedtime')
    //Проверяем, существует ли элемент с указанным идентификатором
    if (elapsedtimeId) {
        //обновляем текстовое содержимое элемента, чтобы отобразить «Прошло:», за которым следует предоставленный параметр.
        elapsedtimeId.textContent = 'Elased:' + ' ' + param;
    }
}
//функция для динамического обновления содержимого элемента HTML для отображения имени пути.
export function drawpathName(param: any) {
    const elapsedtimeId = document.getElementById('pathName')
    if (elapsedtimeId) {
        elapsedtimeId.textContent = 'PathName:' + ' ' + param;
    }
}
//Эта функция для динамического создания таблицы для отображения информации о файле. 
//Предполагается, что параметр данных представляет собой массив объектов File, каждый 
//из которых имеет такие свойства, как файл типа, имя файла, sizeInMB и папка.
export function drawTable(data: File[]): void {
    //получаем элемент HTML с идентификатором filesTable и приводим его к HTMLTableSectionElement.
    const tableBody = document.getElementById('filesTable') as HTMLTableSectionElement;
    if (!tableBody) return;

    tableBody.innerHTML = ''; // Очищаем все существующие строки в теле таблицы
     // Создаем элемент заголовка таблицы
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Создаем ячейки заголовка
    const typeHeader = document.createElement('th');
    typeHeader.textContent = 'Type';
    headerRow.appendChild(typeHeader);

    const directoryPathNameHeader = document.createElement('th');
    directoryPathNameHeader.textContent = 'Directory Path Name';
    headerRow.appendChild(directoryPathNameHeader);

    const sizeHeader = document.createElement('th');
    sizeHeader.textContent = 'Size';
    headerRow.appendChild(sizeHeader);

    const kindHeader = document.createElement('th');
    kindHeader.textContent = 'Kind';
    headerRow.appendChild(kindHeader);

    // добавляем строку заголовка в заголовок таблицы
    thead.appendChild(headerRow);

    tableBody.appendChild(thead);
    //перебираем массив данных (это массив объектов File)
    data.forEach(item => {
        //Создаем новый элемент строки (tr) для каждого файла
        const row = document.createElement('tr');
        // Создаем ячейки (td) для строки и заполняем их данными файла
        const typefileCell = document.createElement('td');
        typefileCell.textContent = item.typefile; // «typefile» является свойством объекта File.
        row.appendChild(typefileCell);

        const filenameCell = document.createElement('td');
        filenameCell.textContent = item.filename;
        row.appendChild(filenameCell);

        const sizeInMBCell = document.createElement('td');
        sizeInMBCell.textContent = item.sizeInMB + " MB"; 
        row.appendChild(sizeInMBCell);

        const folderCell = document.createElement('td');
        folderCell.textContent = item.folder;
        row.appendChild(folderCell);
        // добавляем строку в тело таблицы
        tableBody.appendChild(row);
    });
}

//функция для оформления сообщения о загрузке, которое может появиться, когда приложение выполняет задачу, которая занимает некоторое время.
  export function styleLoadingMessage(message: HTMLParagraphElement) {
    message.style.fontSize = '1.5em'; 
    message.style.position = 'absolute'; 
    message.style.top = '0'; 
    message.style.left = '0'; 
    message.style.width = '100%'; 
    message.style.textAlign = 'center'; 
    message.style.padding = '10px'; 
    message.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; 
    message.style.borderRadius = '5px'; 
    message.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)'; 
    message.style.color = 'blue'; 
  }
//Эта функция  для очистки DOM после завершения состояния загрузки.
export function removeParag():void{
    const existingLoadingMessages = document.querySelectorAll('p');
    existingLoadingMessages.forEach((message) => {
      if (message.textContent === 'Loading...') {
        message.remove();
      }
    });
}

  