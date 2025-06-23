<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
       public function run(): void
    {
        $user = User::find(1); // You can change to User::first() if needed

        if (!$user) {
            $this->command->error("User with ID 1 not found.");
            return;
        }

        $permissions = ['create users', 'edit users', 'delete users'];

        foreach ($permissions as $perm) {
            // Create the permission if it doesn't exist
            $permission = Permission::firstOrCreate(['name' => $perm]);

            // Give the permission to the user
            $user->givePermissionTo($permission);
        }

        $this->command->info("Permissions assigned to user: {$user->email}");
    }

}
