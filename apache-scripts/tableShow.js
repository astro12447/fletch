function displayItems(items) {
    const filesTableBody = document.getElementById('stat')
    // Получение элементы, в которых мы хотим отображать данные.
    items.forEach(file => {
      const row = createTableElement('tr')// Создаем новую строку таблицы

      const fileNameCell = createTableElement('td');
      fileNameCell.textContent = file.C_PATHNAME;

      const sizeCell = createTableElement('td');// Создаем новую ячейку данных>
      sizeCell.textContent = file.C_SIZE +' MB';//Установяем текстовое содержи>
  

      const elapsedtimeCell = createTableElement('td');
      elapsedtimeCell.textContent = file.C_ELAPSEDTIME;
  
      row.appendChild(fileNameCell);// Добавление ячейки в строку
      row.appendChild(sizeCell);
      row.appendChild(elapsedtimeCell);
      filesTableBody.appendChild(row);// Добавление строки в тело таблицы
    });
  }


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

fetch('http://localhost/fetch_data.php') 
    .then(response => response.json())
    .then(data => {
        displayItems(data);
    })
    .catch(error => console.error('Ошибка получения данных:', error));
