// Функция для обработки щелчка по ячейке
function handleCellClick(event) {
    // Проверяем, является ли выбранный элемент ячейкой таблицы (<td>)
    if (event.target.tagName === 'TD') {
        // Получаем текстовое содержимое выбранной ячейки
        const cellData = event.target.textContent;
        // Получаем текущие параметры URL
        let url = new URL(window.location.href);
        let sort = url.searchParams.get('sort');
        let root = url.searchParams.get('root') 
        // Проверяем значения sort и root, чтобы определить следующий URL
        if (sort== null && root!=null){   
            // Если значение sort равно нулю, а значение root не равно 
            //нулю, перейдите к новому URL-адресу, у которого установлен только корневой параметр.    
            window.location.href = "?root=" + cellData;
            console.log(sort)
        }else if(sort =="Desc" && root!=null){
            // Если сортировка не «&sort=Desc» и корень не равен нулю, перейдите к 
            // новому URL-адресу с установленными параметрами корня и сортировки.
            console.log(sort)
            window.location.href = "?root="+ cellData + "&sort=Desc";
        }
    }
}
const table = document.getElementById('filesTable');
if (table !== undefined && table !== null) {
    table.addEventListener('click', handleCellClick);
}
// Добавяем в таблицу прослушиватель событий кликов с помощью делегирования событий