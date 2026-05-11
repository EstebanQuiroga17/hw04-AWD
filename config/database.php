<?php

use Illuminate\Database\Capsule\Manager as Capsule;

require_once __DIR__ . '/../vendor/autoload.php';

$capsule = new Capsule;

$capsule->addConnection([
    "driver" => getenv('DB_DRIVER') ?: "pgsql",
    "host" => getenv('DB_HOST') ?: "aws-1-us-west-2.pooler.supabase.com",
    "database" => getenv('DB_DATABASE') ?: "postgres",
    "username" => getenv('DB_USERNAME') ?: "postgres.pjdbftkrbrguiulkhnpk",
    "password" => getenv('DB_PASSWORD') ?: "ddtvydtt432",
    "port" => getenv('DB_PORT') ?: "6543",
    "charset" => "utf8",
    "schema" => "public",
    "sslmode" => "require"
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();
