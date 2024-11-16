<?php
header('Content-Type: application/json');

$serverName = "ваш_сервер";
$connectionInfo = array(
    "Database"=>"FaceRecognitionDB",
    "UID"=>"ваш_пользователь",
    "PWD"=>"ваш_пароль"
);

$conn = sqlsrv_connect($serverName, $connectionInfo);

if($conn === false) {
    die(json_encode(['error' => 'Connection failed']));
}

$data = json_decode(file_get_contents('php://input'), true);
$phoneNumber = $data['phoneNumber'];
$descriptor = $data['descriptor'];

$params = array($phoneNumber, $descriptor);
$sql = "{call RegisterFaceID (?, ?)}";

$stmt = sqlsrv_query($conn, $sql, $params);

if($stmt === false) {
    die(json_encode(['error' => 'Query failed']));
}

echo json_encode(['success' => true]);
sqlsrv_close($conn);
?> 