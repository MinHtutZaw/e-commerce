<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('landing/welcome');
})->name('home');

Route::get('/products', function () {
    return Inertia::render('landing/products');
})->name('products');
Route::get('/cart', function () {
    return Inertia::render('landing/cart');
})->name('cart');

Route::get('/checkout', function () {
    return Inertia::render('landing/checkout');
})->name('checkout');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
