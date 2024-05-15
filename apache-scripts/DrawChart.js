function drawChart(xdata, ydata) {
    let ctx = document.getElementById('myChart').getContext('2d');
    let config = {
        type: 'line',
        data: {
            labels: xdata,
            datasets: [{
                label: 'Elapsedtime',
                data: ydata
            }]
        },
        options: {
            scales: {
                y: {
                    ticks: {

                    }
                }
            }
        }
    };
    let myChart = new Chart(ctx, config);
}

fetch('http://localhost/fetch_data.php') // мы используем полный URL-адрес PHP-скрипта
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let xdata = [];
        let ydata = [];
        for(let i = 0 ; i < data.length; i++){
            xdata.push(data[i].C_ELAPSEDTIME); 
            ydata.push(data[i].C_SIZE); console.log(data[i].C_SIZE , 
            data[i].C_ELAPSEDTIME);
        }
        drawChart(xdata, ydata);
    })
    .catch(error => console.error('Error fetching data:', error));
function convertNumber(str, decimalPlaces = 3) {
        // Удаляем часть «MB» из строки
        let cleanedStr = str.replace('MB', '').trim();
        // Конвертируем очищенную строку в число с плавающей запятой
        let num = parseFloat(cleanedStr);
        
        return num;
      }

