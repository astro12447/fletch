import { getJson, getSort,moveBackFromRoot} from "./model";
import {drawpathName, saveUrlWithRootAndSort,drawelapsedtime,drawTable} from "./view";
const url = new URL(window.location.href); 
url.pathname += "./files";
const urlString = url.toString();
document.addEventListener('DOMContentLoaded', async () => {
    const data = await getJson(urlString);
    drawTable(data.Files);
    drawpathName(data.pathName);
    drawelapsedtime(data.elapsedtime);
})
const table = document.getElementById('filesTable') as HTMLTableElement;
table.addEventListener('click', (event: MouseEvent) => {
    const rowData = handleCellClick(event);
    if (rowData) {
        if (rowData[0] == "Каталог") {
            let link = saveUrlWithRootAndSort(rowData[1], getSort());
            getJson(link).then(data => {
                drawTable(data.Files);
                drawpathName(data.pathName);
                drawelapsedtime(data.elapsedtime);
            }).catch(error => {
                console.error('Error fetching JSON data:', error);
            });
        }
    }
});

function handleCellClick(event: MouseEvent): string[] | null {
    const target = event.target as HTMLElement;
    if (target.tagName === 'TD') {
        const row = target.parentNode as HTMLTableRowElement;
        const rowData = Array.from(row.cells).map(cell => cell.innerText);
        return rowData;
    }
    return null;
}
const button = document.getElementById('moveBackButton') as HTMLButtonElement;
button.addEventListener('click', () => {
    const currentRootElement = document.getElementById('pathName') as HTMLParagraphElement;
    const currentRoot = currentRootElement.textContent || '';
    if(currentRoot!==null){
        let newRoot = moveBackFromRoot(currentRoot);
        currentRootElement.textContent = newRoot;
        newRoot = newRoot.replace("PathName: ", "");
        let link = saveUrlWithRootAndSort(newRoot, getSort());
        getJson(link).then(data => {
            drawTable(data.Files);
            drawpathName(data.pathName);
            drawelapsedtime(data.elapsedtime);
        }).catch(error => {
            console.error('Error fetching JSON data:', error);
        });
    }
});
