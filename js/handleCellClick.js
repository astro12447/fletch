// Функция для обработки щелчка по ячейке
function handleCellClick(event) {
    if (event.target.tagName === 'TD') {
        const cellData = event.target.textContent;
        console.log('Нажатые данные ячейки:', cellData);
    }
}
// Получить элемент таблицы
const table = document.getElementById('filesTable');
// Добавяем в таблицу прослушиватель событий кликов с помощью делегирования событий.
table.addEventListener('click', handleCellClick);