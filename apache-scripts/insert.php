<?php
// мы включаем файл конфигурации
require_once 'config.php';
header('Content-type: text/html; charset=UTF-8');
// Проверяем, является ли метод запроса POST
if ($_SERVER['REQUEST_METHOD'] === "POST") {
    // Читаем данные JSON из тела запроса
    $jsonData = file_get_contents('php://input');
    // Декодируем данные JSON в ассоциативный массив
    $data = json_decode($jsonData, true);
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    if ($mysqli->connect_errno) {
        echo 'Соединение не удалось: ' . $mysqli->connect_error;
        exit();
    }

    $PathName = $data['PathName'];
    $Size = $data['Size'];
    $ElapsedTime = $data['ElapsedTime'];

    // Используем правильные имена столбцов из базы данных
    $stmt = $mysqli->prepare("INSERT INTO STATISTICS (C_PATHNAME, C_SIZE, C_ELAPSEDTIME) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $PathName, $Size, $ElapsedTime);

    // мы выполняем заявление
    if ($stmt->execute()) {
        http_response_code(200); // мы устанавливаем код ответа HTTP на 200 (OK)
        echo json_encode(['message' => 'The data has inserted into the database.']);
    } else {
        echo "Error: " . $stmt->error;
        http_response_code(500); // мы устанавливаем код ответа HTTP на 500 (внутренняя ошибка сервера)
        echo json_encode(['error' => 'Не удалось вставить данные в базу данных.']);
    }

    $stmt->close();
    $mysqli->close();
} else {
    // Если метод запроса не POST, ответьте ошибкой 405 Method Not Allowed.
    http_response_code(405); 
    echo json_encode(['error' => 'Эта конечная точка принимает только запросы POST.']);
} 
