// JavaScript-файл
// Функция для получения данных JSON с сервера
// Get the current URL

function fetchAndDisplayData() {
    fetch("/files?root=/Users/ismaelnvo/Desktop/scanner-post/ui/files&sort=Desc")
        .then(response => response.json())
        .then(data => {
            //  Отобразование данные на странице.
            displayItems(data)
            console.log(data)
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
// Функция для отображения элементов на странице
function displayItems(items) {
    const filesTableBody = document.getElementById('filesTableBody')
    // Получение элементы, в которых вы хотите отображать данные.
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

// затем вызывается функция fetchAndDisplayData, когда это событие  срабатывает
window.onload = fetchAndDisplayData;
