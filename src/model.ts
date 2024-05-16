
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
export class params {
    root: string | null;
    sort: string | null;
    constructor(root: string | null, sort: string | null) {
        this.root = root;
        this.sort = sort;
    }
}
async function getJson(url:string):Promise<any> {
    try{

        const response = await fetch(url);
        const data = response.json();
        return data;
    }catch(error){
        console.error('Error fetching data:', error);
        throw error;
    }
    
}
export{getJson}

export function moveBackFromRoot(path: string): string {
    const parts = path.split('/');
    parts.pop();
    const newPath = parts.join('/');
    
    return newPath;
}
export function getSort():string{
    const url = new URL(window.location.href); // files
    return url.searchParams.get("sort")|| "";
}

