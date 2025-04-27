<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';