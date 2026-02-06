<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
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
Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');

// Cart routes - auth required
Route::middleware(['auth'])->group(function () {
    Route::get('/cart', [CartController::class, 'index'])->name('cart');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::put('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');
    Route::get('/cart/count', [CartController::class, 'count'])->name('cart.count');
    
    // Order routes
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::get('/checkout', [OrderController::class, 'checkout'])->name('checkout');
    
    // Payment routes
    Route::post('/payments', [PaymentController::class, 'store'])->name('payments.store');
    Route::get('/payment-info', [PaymentController::class, 'getPaymentInfo'])->name('payment.info');
    
    // Custom Orders (auth required)
    Route::post('/custom-orders', [CustomOrderController::class, 'store'])->name('custom-orders.store');
    Route::get('/my-custom-orders', [CustomOrderController::class, 'customerIndex'])->name('customer.custom-orders');
    
    // Customer Profile routes
    Route::get('/customer/profile', [\App\Http\Controllers\CustomerProfileController::class, 'index'])->name('customer.profile');
    Route::post('/customer/profile/update', [\App\Http\Controllers\CustomerProfileController::class, 'update'])->name('customer.profile.update');
    Route::post('/customer/profile/password', [\App\Http\Controllers\CustomerProfileController::class, 'updatePassword'])->name('customer.profile.password');
});




Route::get('/about', function () {
    return Inertia::render('landing/about');
})->name('about');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        $user = Auth::user();
        $stats = [];
        
        $productSales = [];
        $recentOrders = [];
        
        if ($user->role === 'admin') {
            $orderRevenue = \App\Models\Order::where('payment_status', 'paid')->sum('total_amount');
            $customOrderRevenue = \App\Models\CustomOrder::whereIn('status', ['confirmed', 'processing', 'completed'])->sum('total_price');
            
            $stats = [
                'totalOrders' => \App\Models\Order::count(),
                'pendingOrders' => \App\Models\Order::where('status', 'pending')->count(),
                'processingOrders' => \App\Models\Order::where('status', 'processing')->count(),
                'deliveredOrders' => \App\Models\Order::where('status', 'delivered')->count(),
                'totalUsers' => \App\Models\User::where('role', 'customer')->count(),
                'totalProducts' => \App\Models\Product::count(),
                'pendingPayments' => \App\Models\Payment::where('status', 'pending')->count(),
                'totalRevenue' => $orderRevenue + $customOrderRevenue,
                'totalCustomOrders' => \App\Models\CustomOrder::count(),
                'pendingCustomOrders' => \App\Models\CustomOrder::where('status', 'pending')->count(),
            ];
            
            // Daily revenue for last 90 days
            $chartData = \App\Models\Order::where('payment_status', 'paid')
                ->where('created_at', '>=', now()->subDays(90))
                ->selectRaw('DATE(created_at) as date, SUM(total_amount) as revenue')
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(fn($item) => [
                    'date' => $item->date,
                    'revenue' => (int) $item->revenue,
                ]);
            
            // Product sales (top selling products)
            $productSales = \App\Models\OrderItem::join('products', 'order_items.product_id', '=', 'products.id')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->where('orders.payment_status', 'paid')
                ->selectRaw('products.name as product, SUM(order_items.quantity) as quantity, SUM(order_items.total_price) as total_amount')
                ->groupBy('products.id', 'products.name')
                ->orderByDesc('total_amount')
                ->limit(6)
                ->get();
            
            // Recent orders
            $recentOrders = \App\Models\Order::with('user')
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn($order) => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer' => $order->user?->name ?? 'Guest',
                    'total' => $order->total_amount,
                    'status' => $order->status,
                    'date' => $order->created_at->format('M d, Y'),
                ]);
        } else {
            $stats = [
                'totalOrders' => \App\Models\Order::where('user_id', $user->id)->count(),
                'pendingOrders' => \App\Models\Order::where('user_id', $user->id)->where('status', 'pending')->count(),
                'totalSpent' => \App\Models\Order::where('user_id', $user->id)->where('payment_status', 'paid')->sum('total_amount'),
            ];
        }
        
        return Inertia::render('admin/dashboard', [
            'userRole' => $user->role,
            'stats' => $stats,
            'chartData' => $chartData,
            'productSales' => $productSales,
            'recentOrders' => $recentOrders,
        ]);
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {

    
    Route::get('/customer/orders', [OrderController::class, 'posIndex'])->name('customer.orders.index');
    
    // Admin order management
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus'])->name('orders.update-status');
    Route::put('/payments/{id}/status', [OrderController::class, 'updatePaymentStatus'])->name('payments.update-status');
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->group(function () {
    
    // Products
      Route::get('/products', [\App\Http\Controllers\Admin\ProductController::class, 'index'])->name('admin.products.index');
      Route::get('/products/create', [\App\Http\Controllers\Admin\ProductController::class, 'create'])->name('admin.products.create');
      Route::post('/products', [\App\Http\Controllers\Admin\ProductController::class, 'store'])->name('admin.products.store');
      Route::get('/products/{id}/edit', [\App\Http\Controllers\Admin\ProductController::class, 'edit'])->name('admin.products.edit');
      Route::put('/products/{id}', [\App\Http\Controllers\Admin\ProductController::class, 'update'])->name('admin.products.update');
      Route::delete('/products/{id}', [\App\Http\Controllers\Admin\ProductController::class, 'destroy'])->name('admin.products.destroy');
      Route::post('/categories', [\App\Http\Controllers\Admin\CategoryController::class, 'store']);
    
    // Customers
    Route::get('/customers', [\App\Http\Controllers\Admin\CustomerController::class, 'index'])->name('admin.customers.index');
    Route::get('/customers/{id}/edit', [\App\Http\Controllers\Admin\CustomerController::class, 'edit'])->name('admin.customers.edit');
    Route::put('/customers/{id}', [\App\Http\Controllers\Admin\CustomerController::class, 'update'])->name('admin.customers.update');
    Route::delete('/customers/{id}', [\App\Http\Controllers\Admin\CustomerController::class, 'destroy'])->name('admin.customers.destroy');
    Route::post('/customers/{id}/toggle-status', [\App\Http\Controllers\Admin\CustomerController::class, 'toggleStatus'])->name('admin.customers.toggle-status');
    
    // Custom Orders
    Route::get('/custom-orders', [CustomOrderController::class, 'index'])->name('admin.custom-orders.index');
    Route::get('/custom-orders/{id}', [CustomOrderController::class, 'show'])->name('admin.custom-orders.show');
    Route::put('/custom-orders/{id}/status', [CustomOrderController::class, 'updateStatus'])->name('admin.custom-orders.update-status');
    Route::put('/custom-orders/{id}/quote', [CustomOrderController::class, 'updateQuote'])->name('admin.custom-orders.update-quote');
    
    // Pricing Management
    Route::get('/pricing', [\App\Http\Controllers\Admin\PricingController::class, 'index'])->name('admin.pricing.index');
    Route::post('/pricing', [\App\Http\Controllers\Admin\PricingController::class, 'store'])->name('admin.pricing.store');
    Route::put('/pricing/{id}', [\App\Http\Controllers\Admin\PricingController::class, 'update'])->name('admin.pricing.update');
    Route::delete('/pricing/{id}', [\App\Http\Controllers\Admin\PricingController::class, 'destroy'])->name('admin.pricing.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
