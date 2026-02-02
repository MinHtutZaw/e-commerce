<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{

    public function store(Request $request)
    {
        $request->validate([
            'notes' => 'nullable|string',
        ]);

        $cartItems = CartItem::where('user_id', Auth::id())
            ->with(['product', 'productSize'])
            ->get();

        if ($cartItems->isEmpty()) {
            return back()->withErrors(['error' => 'Cart is empty']);
        }

        DB::beginTransaction();
        try {
            $totalAmount = 0;
            $orderItems = [];

            foreach ($cartItems as $cartItem) {
                $product = $cartItem->product;
                $productSize = $cartItem->productSize;
                
                if (!$productSize || !$productSize->is_available) {
                    throw new \Exception("Product size not available");
                }

                $unitPrice = $productSize->price;
                $totalPrice = $unitPrice * $cartItem->quantity;
                $totalAmount += $totalPrice;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'product_size_id' => $productSize->id,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $totalPrice,
                ];
            }

            $order = Order::create([
                'user_id' => Auth::id(),
                'status' => 'pending',
                'total_amount' => $totalAmount,
                'notes' => $request->notes,
            ]);

            foreach ($orderItems as $item) {
                $order->items()->create($item);
            }

            // Clear cart
            $cartItems->each->delete();

            DB::commit();

            // Return checkout page directly with order data
            return Inertia::render('landing/checkout', [
                'order' => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total_amount' => $order->total_amount,
                ],
                'flash' => [
                    'success' => 'Order created successfully! Please proceed with payment.',
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create order: ' . $e->getMessage()]);
        }
    }

    public function show($id)
    {
        $user = Auth::user();
        
        // For customers, only show their own orders. For admins, show any order
        if ($user->role === 'admin') {
            $order = Order::with(['user', 'items.product', 'items.productSize', 'payments'])
                ->findOrFail($id);
        } else {
            $order = Order::where('user_id', $user->id)
                ->with(['items.product', 'items.productSize', 'payments'])
                ->findOrFail($id);
        }

        return Inertia::render('admin/orders/show', [
            'order' => $order,
            'userRole' => $user->role,
        ]);
    }

    public function checkout(Request $request)
    {
        $orderId = $request->query('order');
        
        if (!$orderId) {
            return redirect()->route('cart');
        }

        $order = Order::findOrFail($orderId);

        // Check ownership
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('landing/checkout', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'total_amount' => $order->total_amount,
            ],
        ]);
    }

    public function posIndex()
    {
        $user = Auth::user();
        
        // For customers, show their orders. For admins, show all orders
        if ($user->role === 'admin') {
            $orders = Order::with(['user', 'items.product', 'items.productSize', 'payments'])
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $orders = Order::where('user_id', $user->id)
                ->with(['items.product', 'items.productSize', 'payments'])
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'userRole' => $user->role,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $user = Auth::user();
        
        // Only admins can update order status
        if ($user->role !== 'admin') {
            return back()->withErrors(['error' => 'Unauthorized']);
        }

        $request->validate([
            'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->update([
            'status' => $request->status,
        ]);

        return back()->with('success', 'Order status updated successfully');
    }

    public function updatePaymentStatus(Request $request, $paymentId)
    {
        $user = Auth::user();
        
        // Only admins can update payment status
        if ($user->role !== 'admin') {
            return back()->withErrors(['error' => 'Unauthorized']);
        }

        $request->validate([
            'status' => 'required|in:pending,paid,failed,refunded',
        ]);

        $payment = \App\Models\Payment::findOrFail($paymentId);
        $payment->update([
            'status' => $request->status,
        ]);

        // If payment is approved, update order payment status
        if ($request->status === 'paid') {
            $payment->order->update([
                'payment_status' => 'paid',
            ]);
        }

        return back()->with('success', 'Payment status updated successfully');
    }
}
