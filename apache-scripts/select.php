<?php
require_once 'config.php';
//мы устанавливаем заголовки, чтобы разрешить запросы между источниками
header("Access-Control-Allow-Origin: *");
//Устанавливаем тип контента и набор символов для ответа
header("Content-Type: application/json; charset=UTF-8");
//Включаем отчеты об ошибках в целях разработки
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Создаем новое соединение с сервером MySQL
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// проверяем соединение
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// мы получаем данные
$sql = "SELECT C_PATHNAME, C_SIZE, C_ELAPSEDTIME FROM STATISTICS";
$result = $conn->query($sql);

// Закрываем соединение с базой данных
$conn->close();

// Конвертируем результат в ассоциативный массив
$data = array();
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}
// выводим данные в формате JSON
echo json_encode($data);

