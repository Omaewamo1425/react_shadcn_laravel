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
        return Role::all();
    }
    public function read(Request $request)
    {
        $query = Role::with('permissions');

        if ($search = $request->query('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($sortBy = $request->query('sort_by')) {
            $order = $request->query('order', 'asc');
            $query->orderBy($sortBy, $order);
        }

        $limit = intval($request->query('limit', 10));

        return response()->json($query->paginate($limit));
    }


    public function store(Request $request) 
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name',
        ]);

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
