<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config/database.php';
use Models\Bank;

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $action = $_GET['action'] ?? '';
        if ($action === 'get_all') {
            $banks = Bank::orderBy('name')->get();
            echo json_encode(['success' => true, 'banks' => $banks]);
            exit;
        }
    } elseif ($method === 'POST') {
        
        $data = json_decode(file_get_contents('php://input'), true);
        $action = $data['action'] ?? '';

        if ($action === 'create_bank') {
            $bank = Bank::create(['name' => $data['name'], 'id' => $data['id']]);
            echo json_encode(['success' => true, 'bank' => $bank]);
            exit;
        } elseif ($action === 'delete_bank') {
            Bank::where('id', $data['id'])->delete();
            echo json_encode(['success' => true]);
            exit;
        }
    }
    
    echo json_encode(['success' => false, 'message' => 'Acción no válida o no especificada']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
