function sendUrlpath() {
    window.onload = function () {
        // Get the current URL path
        var urlPath = window.location.pathname;
        
        // Send the URL path to the server
        fetch('/root' + urlPath, {
            method: 'GET',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log('Server response:', data);
            // Process the server's response here
            // For example, display it on the page
            document.getElementById('serverResponse').textContent = data;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}

// Call the function to send the URL path
sendUrlpath();
