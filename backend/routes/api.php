<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthenticationController;

// ---------- Public Routes ----------
Route::post('/register', [AuthenticationController::class, 'register'])->name('register');
Route::post('/login', [AuthenticationController::class, 'login'])->name('login');

// ---------- Protected Routes ----------
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/get-user', [AuthenticationController::class, 'userInfo'])->name('get-user');
    Route::post('/logout', [AuthenticationController::class, 'logOut'])->name('logout');
});
