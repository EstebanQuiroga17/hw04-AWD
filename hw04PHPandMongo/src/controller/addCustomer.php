<?php
require_once __DIR__ . '/../../vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = htmlspecialchars($_POST['id'] ?? '');
    $name = htmlspecialchars($_POST['name'] ?? '');
    $password = $_POST['password'] ?? '';
    $URI = getenv('MONGODB_URI');

    if (!empty($id) && !empty($name) && !empty($password)) {
        try {
            $client = new MongoDB\Client($URI);
            
            $db = $client->students;
            $collection = $db->Customer;

            $insertOneResult = $collection->insertOne([
                'id' => $id,
                'name' => $name,
                'password' => password_hash($password, PASSWORD_BCRYPT) 
            ]);
            
            echo "Customer added successfully with MongoDB _id: " . $insertOneResult->getInsertedId();
        } catch (Exception $e) {
            echo "Error connecting to MongoDB: " . $e->getMessage();
        }
    } else {
        echo "Please fill in all fields.";
    }
}
?>