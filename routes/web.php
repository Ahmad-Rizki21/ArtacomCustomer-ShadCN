<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;

Route::get('/', function () {
    // Jika pengguna sudah login, redirect ke dashboard
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    // Jika belum login, redirect ke halaman login
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Main Dashboard
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Alfamart Lawson Routes
    Route::prefix('dashboard/alfamart')->group(function () {
        Route::get('/remote-site', function () {
            return Inertia::render('Alfamart/RemoteSite');
        })->name('alfamart.remote-site');
        
        Route::get('/dc', function () {
            return Inertia::render('Alfamart/DC');
        })->name('alfamart.dc');
        
        Route::get('/customer', function () {
            return Inertia::render('Alfamart/Customer');
        })->name('alfamart.customer');
    });
    
    // FTTH Routes
    Route::prefix('dashboard/ftth')->group(function () {
        Route::get('/remote', function () {
            return Inertia::render('FTTH/Remote');
        })->name('ftth.remote');
        
        Route::get('/customer', function () {
            return Inertia::render('FTTH/Customer');
        })->name('ftth.customer');
    });
});


Route::middleware(['auth'])->group(function () {
    // User Management Routes
    Route::get('/settings/user-management', [UserController::class, 'index'])->name('user-management.index');
    Route::post('/settings/user-management', [UserController::class, 'store'])->name('user-management.store');
    Route::put('/settings/user-management/{user}', [UserController::class, 'update'])->name('user-management.update');
    Route::delete('/settings/user-management/{user}', [UserController::class, 'destroy'])->name('user-management.destroy');

    // Role Management Routes
    Route::get('/settings/role-management', [RoleController::class, 'index'])->name('role-management.index');
    Route::post('/settings/role-management', [RoleController::class, 'store'])->name('role-management.store');
    Route::put('/settings/role-management/{role}', [RoleController::class, 'update'])->name('role-management.update');
    Route::delete('/settings/role-management/{role}', [RoleController::class, 'destroy'])->name('role-management.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';