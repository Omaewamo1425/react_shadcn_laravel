<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Spatie\Permission\Models\Role;
class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $permissions = [
            'create-users',
            'edit-users',
            'delete-users',
            'view-users',
            'create-permissions',
            'edit-permissions',
            'delete-permissions',
            'view-permissions',
            'create-roles',
            'edit-roles',
            'delete-roles',
            'view-roles',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }

        $admin_role = Role::firstOrCreate(['name' => 'super admin', 'guard_name' => 'web']);

        $admin_role->syncPermissions($permissions);

        $super_admin_user = User::find(1);
        $super_admin_user->assignRole('super admin');
    }

}
