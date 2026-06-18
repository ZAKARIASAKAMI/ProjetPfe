<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MagasinController;
use App\Http\Controllers\Api\MouvementStockController;
use App\Http\Controllers\Api\ProduitController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Auth
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);

// Users
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// Dashboard
Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

// Produits
Route::apiResource('produits', ProduitController::class);

// Magasins
Route::apiResource('magasins', MagasinController::class);

// Mouvements
Route::get('/movements', [MouvementStockController::class, 'index']);
Route::post('/movements', [MouvementStockController::class, 'store']);
Route::post('/movements/transfer', [MouvementStockController::class, 'transfer']);
Route::get('/movements/{mouvementStock}', [MouvementStockController::class, 'show']);
Route::delete('/movements/{mouvementStock}', [MouvementStockController::class, 'destroy']);
