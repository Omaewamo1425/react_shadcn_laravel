<?php

namespace App\Http\Controllers\role;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public function index() 
    {
        return Role::with('permissions')->get();
    }

    public function store(Request $request) 
    {
        $role = Role::create(['name' => $request->name, 'guard_name' => 'web']);
        $role->syncPermissions($request->permissions);
        return $role->load('permissions');
    }

    public function update(Request $request, Role $role) 
    {
        $role->update(['name' => $request->name]);
        $role->syncPermissions($request->permissions);
        return $role->load('permissions');
    }
    
    public function destroy(Role $role) 
    {
        $role->delete();
        return response()->json(['message' => 'Role deleted']);
    }
}
