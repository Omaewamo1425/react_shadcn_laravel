<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\role\RoleController;
use App\Http\Controllers\API\AuthenticationController;
use App\Http\Controllers\user_management\UserController;
use App\Http\Controllers\permission\PermissionController;

// ---------- Public Routes ----------
Route::post('/register', [AuthenticationController::class, 'register'])->name('register');
Route::post('/login', [AuthenticationController::class, 'login'])->name('login');

// ---------- Protected Routes ----------
Route::middleware('auth:sanctum')->group(function () {
    // Route::get('/get-user', [AuthenticationController::class, 'userInfo'])->name('get-user');
    Route::post('/logout', [AuthenticationController::class, 'logOut'])->name('logout');
    Route::get('/user_info', [AuthenticationController::class, 'userInfo'])->name('user');


    Route::get('/roles', function () {
        return \Spatie\Permission\Models\Role::select('id', 'name')->get();
    });
    Route::get('users', [UserController::class, 'index']);
    Route::post('users', [UserController::class, 'store']);
    Route::put('users/{user}', [UserController::class, 'update']);
    Route::delete('users/{user}', [UserController::class, 'destroy']);


    Route::get('/roles', [RoleController::class, 'index']);
    Route::get('/roles/read', [RoleController::class, 'read']);
    Route::post('/roles', [RoleController::class, 'store']);
    Route::put('/roles/{role}', [RoleController::class, 'update']);
    Route::delete('/roles/{role}', [RoleController::class, 'destroy']);
    Route::get('/permissions', [PermissionController::class, 'index']);


    Route::get('/permissions', [PermissionController::class, 'index']);
    Route::get('/permissions/read', [PermissionController::class, 'read']);
    Route::post('/permissions', [PermissionController::class, 'store']);
    Route::put('/permissions/{permission}', [PermissionController::class, 'update']);
    Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy']);
});
