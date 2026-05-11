<?php
ini_set('display_errors', '0');
error_reporting(E_ALL);

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

set_exception_handler(function ($e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    exit;
});

register_shutdown_function(function () {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR])) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => 'Fatal error: ' . $error['message']]);
    }
});

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$autoloadPath = __DIR__ . '/vendor/autoload.php';
if (!file_exists($autoloadPath)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Missing vendor/autoload.php. Run composer install.']);
    exit;
}

require_once $autoloadPath;
require_once __DIR__ . '/config/database.php';
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
            $bank = Bank::create([
                'name' => $data['name'] ?? null,
                'country' => $data['country'] ?? null,
                'clients' => $data['clients'] ?? null,
                'owner' => $data['owner'] ?? null,
                'phoneNumber' => $data['phoneNumber'] ?? null,
                'dollarValue' => $data['dollarValue'] ?? null,
                'creationDate' => $data['creationDate'] ?? null,
            ]);
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
