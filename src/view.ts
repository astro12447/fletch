
import { File } from "./model";
export function saveUrlWithRootAndSort(rootValue: string, sortValue: string): string {
    const currentUrl = new URL(window.location.href);
    const newUrl = new URL(`${currentUrl.protocol}//${currentUrl.hostname}${currentUrl.port ? ':' + currentUrl.port : ''}`);
    newUrl.pathname = './files'; // Set the path to './files'
    newUrl.searchParams.set('root', rootValue);
    newUrl.searchParams.set('sort', sortValue);
    const urlString = newUrl.toString();

    return urlString;
}

export function drawelapsedtime(param: any) {
    const elapsedtimeId = document.getElementById('btn-elapsedtime')
    if (elapsedtimeId) {
        elapsedtimeId.textContent = 'Elased:' + ' ' + param;
    }
}

export function drawpathName(param: any) {
    const elapsedtimeId = document.getElementById('pathName')
    if (elapsedtimeId) {
        elapsedtimeId.textContent = 'PathName:' + ' ' + param;
    }
}

export function drawTable(data: File[]): void {
    const tableBody = document.getElementById('filesTable') as HTMLTableSectionElement;
    if (!tableBody) return;

    tableBody.innerHTML = ''; // Clear existing rows
     // Create the table header element
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Create the header cells
    const typeHeader = document.createElement('th');
    typeHeader.textContent = 'Type';
    headerRow.appendChild(typeHeader);

    const directoryPathNameHeader = document.createElement('th');
    directoryPathNameHeader.textContent = 'Directory Path Name';
    headerRow.appendChild(directoryPathNameHeader);

    const sizeHeader = document.createElement('th');
    sizeHeader.textContent = 'Size';
    headerRow.appendChild(sizeHeader);

    const kindHeader = document.createElement('th');
    kindHeader.textContent = 'Kind';
    headerRow.appendChild(kindHeader);

    // Append the header row to the table header
    thead.appendChild(headerRow);
    const totalRows = data.length;
    let drawnRows = 0;
  
    tableBody.appendChild(thead);
    data.forEach(item => {
        const row = document.createElement('tr');

        const typefileCell = document.createElement('td');
        typefileCell.textContent = item.typefile;
        row.appendChild(typefileCell);

        const filenameCell = document.createElement('td');
        filenameCell.textContent = item.filename;
        row.appendChild(filenameCell);

        const sizeInMBCell = document.createElement('td');
        sizeInMBCell.textContent = item.sizeInMB + " MB"; 
        row.appendChild(sizeInMBCell);

        const folderCell = document.createElement('td');
        folderCell.textContent = item.folder;
        row.appendChild(folderCell);
        
        tableBody.appendChild(row);
        drawnRows++;
        const progress = Math.round((drawnRows / totalRows) * 100);
        updateProgressBar(progress);
    });
}

function updateProgressBar(progress: number): void {
    const progressBar = document.getElementById('tableProgress') as HTMLProgressElement;
    if (progressBar) {
      progressBar.value = progress;
    }
  }

  