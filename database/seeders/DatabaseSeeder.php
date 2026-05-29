<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin + user accounts. Credentials come from env in production
        // (Admin_EMAIL/Admin_PASSWORD, User_EMAIL/User_PASSWORD) with
        // sensible local fallbacks.
        User::updateOrCreate(
            ['email' => env('Admin_EMAIL', 'info@eloquentservice.com')],
            [
                'name'     => 'Academy Director',
                'role'     => 'admin',
                'password' => Hash::make(env('Admin_PASSWORD', '1@Ab56ab56')),
            ],
        );

        User::updateOrCreate(
            ['email' => env('User_EMAIL', 'user@eloquentservice.com')],
            [
                'name'     => 'Academy Staff',
                'role'     => 'user',
                'password' => Hash::make(env('User_PASSWORD', 'password')),
            ],
        );

        // Demo academy data (courses, students, payments, sessions).
        $this->call([
            AcademySeeder::class,
        ]);
    }
}
