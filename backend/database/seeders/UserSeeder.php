<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@feed-inc.com'],
            [
                'name' => 'Admin User',
                'email' => 'admin@feed-inc.com',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );
    }
}
