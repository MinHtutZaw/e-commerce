<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CustomOrderController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\PaymentController;

Route::get('/', function () {
    return Inertia::render('landing/welcome');
})->name('home');

Route::get('/products', [ProductController::class, 'index'])->name('products');
Route::get('/cart', [CartController::class, 'index'])->name('cart');
Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::put('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');

Route::get('/checkout', function () {
    return Inertia::render('landing/checkout');
})->name('checkout');
Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
Route::post('/payments', [PaymentController::class, 'store'])->name('payments.store');

Route::post('/custom-orders', [CustomOrderController::class, 'store'])->name('custom-orders.store');

Route::get('/api/payment-methods', [PaymentMethodController::class, 'index'])->name('api.payment-methods');

Route::get('/about', function () {
    return Inertia::render('landing/about');
})->name('about');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
