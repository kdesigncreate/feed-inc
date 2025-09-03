<?php
// Initialize database for Feed Inc project
require_once __DIR__ . '/backend/vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Support\Facades\Hash;

// Database configuration from .env.docker
$db = new DB;
$db->addConnection([
    'driver' => 'mysql',
    'host' => 'mysql',
    'database' => 'feed_database',
    'username' => 'feed_user',
    'password' => '0zu/PKX5rocZdYBg1xq4RwLD98Of0ppJkJFtCW/l7H8=',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
]);

$db->bootEloquent();

try {
    // Test database connection
    DB::connection()->getPdo();
    echo "✅ Database connection successful\n";
    
    // Check if users table exists
    $tables = DB::select("SHOW TABLES LIKE 'users'");
    if (empty($tables)) {
        echo "❌ Users table doesn't exist. Database migrations needed.\n";
    } else {
        echo "✅ Users table exists\n";
        
        // Check if admin user exists
        $adminExists = DB::table('users')->where('email', 'admin@feed-inc.com')->exists();
        if (!$adminExists) {
            echo "⚠️ Admin user doesn't exist\n";
        } else {
            echo "✅ Admin user exists\n";
        }
    }
    
} catch (Exception $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
    echo "This suggests the MySQL service may not be running or accessible.\n";
}