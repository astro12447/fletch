// Функция для обработки щелчка по ячейке
function HandleCellClick(event:MouseEvent):void{
    if((event.target as HTMLElement).tagName==='TD'){
        const Celldt = (event.target as HTMLElement).textContent;
        let url = new URL(window.location.href);
        let sort = url.searchParams.get('sort');
        let root = url.searchParams.get('root');
        if (sort==null && root!=null){
            window.location.href = "?root=" + root;
        }
        if (sort=="Desc" && root!=null){
            window.location.href = "?root=" + Celldt + "&sort=Desc";
        }

    }
}

const tableName = document.getElementById('fileTable');
if (tableName !=null){
    tableName.addEventListener('click' , HandleCellClick)
}