<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 0; $i < 10; $i++) {
            User::factory()->count(100)->create();
            echo "Seeded " . (($i + 1) * 100) . " users...\n";
        }

        $this->command->info('✅ 1,000 users seeded successfully (in chunks).');
    }
}
