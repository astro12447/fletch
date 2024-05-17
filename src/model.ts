import { styleLoadingMessage } from "./view";
//Определяем класс файла.
export class File {
    //Свойства класса File
    filename: string;  //Имя файла
    typefile: string; // тип файла (например, txt, pdf, docx)
    sizeInMB: string;
    sizeInBytes: string;
    folder: string; // Папка, в которой находится файл
    //Конструктор класса File
    constructor(typefile: string, filename: string, sizeInMB: string, siseInbytes: string, folder: string) {
        //Инициализируйте свойства значениями, переданными конструктору.
        this.typefile = typefile;
        this.filename = filename;
        this.sizeInMB = sizeInMB;
        this.sizeInBytes = siseInbytes;
        this.folder = folder;
    }
}

//мы определяем класс с именем «params» для инкапсуляции корневых параметров и параметров сортировки.
export class params {
    root: string | null; // свойство root, которое может быть строкой или значением NULL.
    sort: string | null; // свойство sort, которое может быть строкой или значением NULL.
    //Конструктор для инициализации объекта params с помощью корневых значений и значений сортировки.
    constructor(root: string | null, sort: string | null) {
        this.root = root;  // присваиваем предоставленное корневое значение свойству root.
        this.sort = sort;  // присваиваем предоставленное значение сортировки свойству sort
    }
}

//определяем асинхронную функцию с именем getJson, которая извлекает данные JSON из URL-адреса.
async function getJson(url:string):Promise<any> {
    try{
        //Создаем новый элемент абзаца для отображения сообщения о загрузке
        const loadingMessage = document.createElement('p') as HTMLParagraphElement;
        //устанавливаем текстовое содержимое сообщения о загрузке на «Загрузка...»
        loadingMessage.textContent = 'Loading...';
        //применяем стили к сообщению о загрузке, чтобы сделать его визуально отличным
        styleLoadingMessage(loadingMessage);
        // Добавляем сообщение о загрузке в тело документа
        document.body.appendChild(loadingMessage);
        //используем API выборки, чтобы сделать запрос на указанный URL
        const response = await fetch(url);
        const data = response.json();  // анализируем тело ответа как JSON
        loadingMessage.style.display = 'none'; //Возвращаем проанализированные данные JSON
        return data;
    }catch(error){
        console.error('Ошибка получения данных:', error);
        throw error;
    }
    
}
export{getJson}
//moveBackFromRoot предназначен для удаления последнего сегмента пути к файлу, 
//эффективно перемещаясь на один уровень вверх в иерархии каталогов.
export function moveBackFromRoot(path: string): string {
    const parts = path.split('/');
    parts.pop();
    const newPath = parts.join('/');
    
    return newPath;
}
//getSort извлекает значение параметра запроса sort из текущего URL-адреса.
export function getSort():string{
    //создаем новый объект URL на основе URL-адреса текущей страницы.
    const currentURL = new URL(window.location.href); 
    return currentURL.searchParams.get("sort")|| "";
}

