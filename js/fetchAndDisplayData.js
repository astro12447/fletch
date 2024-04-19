// JavaScript-файл
var params = getDynamicUrlParams();//Получения  с параметрами «params.root» и «params.sort»
verificateURl();//вызов функции для проверки и обработки «root» и «sort»
//Функция для получения данных has JSON с сервера
async function fetchAndDisplayData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ошибка! положение дел: ${response.status}`);
    }
    console.log("Ответ OK!");
    const files = await response.json();
    // Вызов функции для отаброжении элементов в таблице.
    displayItems(files);
  } catch (error) {
    console.error('Ошибка при получении элементов:', error);
  }
}
// Функция для проверки «params» параметров «root» и «sort»
function verificateURl() {
  if (params.sort === "&sort=null" && params.root !== null) {
    fetchAndDisplayData(params.root);

  } else if (params.sort === "&sort=Desc" && params.root !== null) {
    var concatenateRoot = params.root + "/" + params.sort;
    fetchAndDisplayData(concatenateRoot);
  }else{
    console.log("")
  }
}
//Функция для создания табличных элементов «tr» и «td». 
function displayItems(items) {
  const filesTableBody = document.getElementById('filesTableBody')
  // Получение элементы, в которых мы хотим отображать данные.
  items.forEach(file => {
    const row = document.createElement('tr')
    // Создание ячейки для каждого свойства пользователя.
    const nameCell = document.createElement('td');
    nameCell.textContent = file.name;

    const typefileCell = document.createElement('td');
    typefileCell.textContent = file.typefile;

    const sizelCell = document.createElement('td');
    sizelCell.textContent = file.sizeInKB;
    // Добавление ячейки в строку
    row.appendChild(typefileCell);
    row.appendChild(nameCell);
    row.appendChild(sizelCell);
    // Добавление строки в тело таблицы
    filesTableBody.appendChild(row);
  });
}
// Получение текущий URL
function getDynamicUrlParams() {
  var url = new URL(window.location.href);
  // Получение параметры «root» и «sort».
  var root = url.searchParams.get('root');
  var sort = url.searchParams.get('sort');
  var newRoot = "./files?root=" + root;
  var newSort = "&sort=" + sort
  // Возвращаем объект с параметрами
  return {
    root: newRoot,
    sort: newSort
  };
}