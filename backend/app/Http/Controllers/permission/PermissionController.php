<?php

namespace App\Http\Controllers\permission;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function index() 
    {
        return Permission::all();
    }
    // public function createPermission(Request $request)
    // {
    //     $request->validate(['name' => 'required|string|unique:permissions,name']);

    //     $permission = Permission::create(['name' => $request->name]);

    //     return response()->json(['message' => 'Permission created', 'permission' => $permission]);
    // }


    // public function assignPermission(Request $request)
    // {
    //     $request->validate([
    //         'user_id' => 'required|exists:users,id',
    //         'permission' => 'required|exists:permissions,name'
    //     ]);

    //     $user = User::findOrFail($request->user_id);
    //     $user->givePermissionTo($request->permission);

    //     return response()->json(['message' => 'Permission assigned']);
    // }
}
