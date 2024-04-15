window.onload = function() {
    // Get the table element
    var tableElement = document.getElementById('filesTable');

    // Attach a click event listener to the table
    tableElement.addEventListener('click', function(event) {
        // Check if the clicked element is a <td>
        if (event.target.tagName === 'TD') {
            // Get the text content of the clicked <td>
            var clickedTdValue = event.target.textContent;
            console.log('A table cell was clicked!');
            console.log('The clicked cell contains:', clickedTdValue);

            // Send the value to the server
            sendValueToServer(clickedTdValue);
        }
    });

    function sendValueToServer(value) {
        // Construct the URL with the value as a query parameter
        var url = 'http://localhost:8080/?value=' + encodeURIComponent(value);
        // Use Fetch API to send a GET request to the server
        fetch(url, {
            method: 'GET', // or 'POST' if you prefer
            headers: {
                'Content-Type': 'application/json',
            //     // 'Authorization': 'Bearer your-token', // if needed
            },
            // body: JSON.stringify(data), // if you're sending data in the body
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // предполагая, что сервер отправляет JSON
        })
        .then(data => {
            console.log('Server response:', data);
            // Обработка ответ сервера здесь
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }
};