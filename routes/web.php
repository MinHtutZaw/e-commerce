<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CustomOrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Admin\SettingsController;

Route::get('/', function () {
    return Inertia::render('landing/welcome');
})->name('home');

Route::get('/products', [ProductController::class, 'index'])->name('products');
Route::get('/cart', [CartController::class, 'index'])->name('cart');
Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::put('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');

Route::get('/checkout', function (\Illuminate\Http\Request $request) {
    $order = null;
    if ($request->has('order')) {
        $order = \App\Models\Order::find($request->order);
    }
    return Inertia::render('landing/checkout', [
        'order' => $order ? [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'total_amount' => (float) $order->total_amount,
        ] : null,
    ]);
})->name('checkout');
Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');


Route::post('/custom-orders', [CustomOrderController::class, 'store'])->name('custom-orders.store');


Route::get('/about', function () {
    return Inertia::render('landing/about');
})->name('about');

Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');
    
    // Admin routes
    // Route::get('/admin/settings', [SettingsController::class, 'index'])->name('admin.settings');
    // Route::put('/admin/settings', [SettingsController::class, 'update'])->name('admin.settings.update');
    //product 
      Route::get('/products', [\App\Http\Controllers\Admin\ProductController::class, 'index'])->name('admin.products');
      Route::get('/products/create', [\App\Http\Controllers\Admin\ProductController::class, 'create'])->name('admin.products.create');
      Route::post('/products', [\App\Http\Controllers\Admin\ProductController::class, 'store'])->name('admin.products.store');
      Route::get('/products/{id}/edit', [\App\Http\Controllers\Admin\ProductController::class, 'edit'])->name('admin.products.edit');
      Route::put('/products/{id}', [\App\Http\Controllers\Admin\ProductController::class, 'update'])->name('admin.products.update');
      Route::delete('/products/{id}', [\App\Http\Controllers\Admin\ProductController::class, 'destroy'])->name('admin.products.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
