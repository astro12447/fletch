// Функция для обработки щелчка по ячейке
function handleCellClick(event) {
    // Проверяем, является ли выбранный элемент ячейкой таблицы (<td>)
    if (event.target.tagName === 'TD') {
        // Получаем текстовое содержимое выбранной ячейки
        const cellData = event.target.textContent;
        // Получаем текущие параметры URL
        setwindowsref(cellData);
    }
}

function setwindowsref(cellData){
    let url = new URL(window.location.href);
    let currenSort = url.searchParams.get('sort');
    let currebtRoot = url.searchParams.get('root');
    if (currenSort== null && currebtRoot!=null){   
        // Если значение sort равно нулю, а значение root не равно 
        //нулю, перейдите к новому URL-адресу, у которого установлен только корневой параметр.    
        window.location.href = "?root=" + cellData;

    }else if(currenSort =="Desc" && currebtRoot!=null){
        // Если сортировка не «&sort=Desc» и корень не равен нулю, перейдите к 
        // новому URL-адресу с установленными параметрами корня и сортировки.
        window.location.href = "?root="+ cellData + "&sort=Desc";
    }else{

    }
}

const table = document.getElementById('filesTable');
if (table !== undefined && table !== null) {
    table.addEventListener('click', handleCellClick);
}
// Добавяем в таблицу прослушиватель событий кликов с помощью делегирования событий