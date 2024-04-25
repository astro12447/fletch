// JavaScript-файл
fetchWindowsLink();//вызов функции для проверки и обработки «root» и «sort»
//Функция для получения данных has JSON с сервера

async function fetchAndDisplayData(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ошибка! положение дел: ${response.status}`);
    }
    console.log("Ответ OK!");
    const files = await response.json();
    if (files){
      displayItems(files);
    }else{
      console.error('Директория или файл не содержит элементов');
    }
    // Вызов функции для отаброжении элементов в таблице.
  } catch (error) {
    console.error('Ошибка при получении элементов:', error);
  }
}
// Функция для проaверки «params» параметров «root» и «sort»
function fetchWindowsLink() {
  const params = setSortAndRoot();//Получения  с параметрами «params.root» и «params.sort»
  // Предполагая, что setSortAndRoot() возвращает объект со свойствами sort и root.
  switch (true) { // Использование true в качестве выражения переключения, чтобы всегда входить в блок переключения
    case params.sort === '&sort=null' && params.root !== null:
      fetchAndDisplayData(params.root); 
      break; // Сделаем перерыв после выполнения дела, чтобы предотвратить провал.
    case params.sort === '&sort=Desc' && params.root !== null:
      let concatenateRoot = (params.root + params.sort);
      console.log(concatenateRoot)
      fetchAndDisplayData(concatenateRoot);
      break; // Сделаем перерыв после выполнения дела, чтобы предотвратить провал.
    default:
      console.log("Подходящего случая не найдено!");
  }
}
//Функция для создания табличных элементов @«tr» и @«td». 
function displayItems(items) {
  const filesTableBody = document.getElementById('filesTableBody')
  // Получение элементы, в которых мы хотим отображать данные.
  items.forEach(file => {
    const row = createTableElement('tr')// Создаем новую строку таблицы
    
    const nameCell = createTableElement('td');// Создаем новую ячейку данных таблицы
    nameCell.textContent = file.name;//Установяем текстовое содержимое ячейки

    const typefileCell = createTableElement('td');
    typefileCell.textContent = file.typefile;

    const sizelCell = createTableElement('td');
    sizelCell.textContent = file.sizeInKB;

    const foldeCell = createTableElement('td');
    foldeCell.textContent = file.folder;
    row.appendChild(typefileCell);// Добавление ячейки в строку
    row.appendChild(nameCell);
    row.appendChild(sizelCell);
    row.appendChild(foldeCell);
    filesTableBody.appendChild(row);// Добавление строки в тело таблицы
  });
}
// функция @createHTMLELEMENT предназначена для создания и возврата нового элемента HTML на основе параметра ElementName.
function createTableElement(ElementName) {
  switch (ElementName) {
    case 'tr':
      return document.createElement('tr');
    case 'td':
      return document.createElement('td');
    default:
      console.log("Неизвестное имя элемента: " + ElementName);
      return null; // Верните ноль или выдайте ошибку, если элемент не распознан.
  }
}
// Получение текущий URL
function setSortAndRoot() {
  const url = new URL(window.location.href);
  // Получение параметры «root» и «sort».
  if (url.hostname!=null && url.hostname.split('/')[1]!="?root"){
    const root = url.searchParams.get('root');
    const sort = url.searchParams.get('sort');
    var newRoot = "./files?root=".concat(root);
    var newSort =  "&sort=".concat(sort);
  }else{
    console.log("")
  }
  // Возвращаем объект с параметрами
  return {
    root: newRoot,
    sort: newSort
  };
}

// function setAndRoot() {
//   const url = new URL(window.location.href);
//   // Получение параметры «root» и «sort».
//   const root = url.searchParams.get('root');
//   const sort = url.searchParams.get('sort');

//   // Если параметры root или sort отсутствуют, выходим из функции
  

//   // Создаем новый URL с обновленными параметрами root и sort
//   url.searchParams.set('root', root);
//   url.searchParams.set('sort', sort);

//   // Возвращаем новый URL в виде строки
//   return url.toString();
// }
// const newUrl = setAndRoot();
// if (newUrl) {
//   console.log(newUrl); // Выводит новый URL с обновленными параметрами root и sort
// }