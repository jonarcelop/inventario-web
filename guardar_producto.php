<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if ($data) {
    $archivo = 'productos.json';
    $productos = json_decode(file_get_contents($archivo), true);
    $productos[] = $data;
    file_put_contents($archivo, json_encode($productos, JSON_PRETTY_PRINT));
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
?>
