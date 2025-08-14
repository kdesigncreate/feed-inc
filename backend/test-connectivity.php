<?php
// Test Laravel application connectivity
echo "=== Feed Inc Laravel Connectivity Test ===\n";

// Test 1: Check if we can load Laravel
try {
    require_once __DIR__ . '/vendor/autoload.php';
    echo "✅ Laravel autoloader: OK\n";
} catch (Exception $e) {
    echo "❌ Laravel autoloader failed: " . $e->getMessage() . "\n";
    exit(1);
}

// Test 2: Check environment variables
echo "🔍 Environment variables:\n";
echo "DB_CONNECTION: " . ($_ENV['DB_CONNECTION'] ?? 'NOT SET') . "\n";
echo "DB_HOST: " . ($_ENV['DB_HOST'] ?? 'NOT SET') . "\n";
echo "DB_DATABASE: " . ($_ENV['DB_DATABASE'] ?? 'NOT SET') . "\n";

// Test 3: Try to bootstrap Laravel app
try {
    $app = require_once __DIR__ . '/bootstrap/app.php';
    echo "✅ Laravel app bootstrap: OK\n";
} catch (Exception $e) {
    echo "❌ Laravel app bootstrap failed: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
    exit(1);
}

// Test 4: Test database connection
try {
    $app->make('db')->connection()->getPdo();
    echo "✅ Database connection: OK\n";
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
}

echo "=== Test completed ===\n";