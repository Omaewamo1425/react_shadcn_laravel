<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthenticationController;
use App\Http\Controllers\user_management\UserController;

// ---------- Public Routes ----------
Route::post('/register', [AuthenticationController::class, 'register'])->name('register');
Route::post('/login', [AuthenticationController::class, 'login'])->name('login');

// ---------- Protected Routes ----------
Route::middleware('auth:sanctum')->group(function () {
    // Route::get('/get-user', [AuthenticationController::class, 'userInfo'])->name('get-user');
    Route::post('/logout', [AuthenticationController::class, 'logOut'])->name('logout');
    Route::get('/user_info', [AuthenticationController::class, 'userInfo'])->name('user');


     // Permissions-based user CRUD
    Route::get('users', [UserController::class, 'index']);
    Route::post('users', [UserController::class, 'store']);
    Route::put('users/{user}', [UserController::class, 'update']);
    Route::delete('users/{user}', [UserController::class, 'destroy']);
});
