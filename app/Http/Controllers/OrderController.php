<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    // Store a new order
    public function store(Request $request)
    {
    $request->validate(['notes' => 'nullable|string']);

    $cartItems = CartItem::with(['product', 'productSize'])
        ->where('user_id', Auth::id())
        ->get();

    if ($cartItems->isEmpty()) {
        return back()->withErrors(['error' => 'Cart is empty']);
    }

    $order = DB::transaction(function () use ($cartItems, $request) {

        $totalAmount = 0;
        $orderItemsData = [];

        foreach ($cartItems as $item) {
            $productSize = $item->productSize;

            if (!$productSize || !$productSize->is_available) {
                abort(400, 'Product size not available');
            }

            $unitPrice = $productSize->price;
            $totalPrice = $unitPrice * $item->quantity;

            $totalAmount += $totalPrice;

            $orderItemsData[] = [
                'product_id' => $item->product_id,
                'product_size_id' => $productSize->id,
                'quantity' => $item->quantity,
                'unit_price' => $unitPrice,
                'total_price' => $totalPrice,
            ];
        }

        // Create order
        $order = Order::create([
            'user_id' => Auth::id(),
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'total_amount' => $totalAmount,
            'notes' => $request->notes,
        ]);

        // Generate order number (once)
        $order->update([
            'order_number' => 'ORD-' . str_pad($order->id, 5, '0', STR_PAD_LEFT),
        ]);

        // Save order items
        $order->items()->createMany($orderItemsData);

        // Clear cart
        $cartItems->each->delete();

        return $order;
    });

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
}


    // Show order details
    public function show($id)
    {
        $order = $this->getOrderForUser(Auth::user(), $id);

        $view = Auth::user()->role === 'admin'
            ? 'admin/orders/orderDetails'
            : 'customer/order-details';

        return Inertia::render($view, ['order' => $order, 'userRole' => Auth::user()->role]);
    }

    // Checkout page
    public function checkout(Request $request)
    {
        $orderId = $request->query('order');
        if (!$orderId) return redirect()->route('cart');

        $order = Order::findOrFail($orderId);

        abort_unless($order->user_id === Auth::id(), 403);

        return Inertia::render('landing/checkout', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'total_amount' => $order->total_amount,
            ],
        ]);
    }

    // List orders for POS/admin
    public function posIndex()
    {
        $user = Auth::user();
        $orders = $user->role === 'admin'
            ? Order::with(['user', 'items.product', 'items.productSize', 'payments'])->latest()->get()
            : Order::with(['items.product', 'items.productSize', 'payments'])->where('user_id', $user->id)->latest()->get();

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'userRole' => $user->role,
        ]);
    }

    // Update order status
    public function updateStatus(Request $request, $id)
    {
        $this->authorizeAdmin();

        $request->validate([
            'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled',
        ]);

        $order = Order::with('items.productSize')->findOrFail($id);
        $this->validateOrderStatusChange($order, $request->status);

        // Reduce stock when status changes to "processing"
        if ($request->status === 'processing' && $order->status !== 'processing') {
            DB::transaction(function () use ($order) {
                foreach ($order->items as $item) {
                    if ($item->productSize) {
                        $newStock = max(0, $item->productSize->stock_quantity - $item->quantity);
                        $item->productSize->update([
                            'stock_quantity' => $newStock,
                            'is_available' => $newStock > 0,
                        ]);
                    }
                }
            });
        }

        // Restore stock when order is cancelled (if it was already processing or beyond)
        if ($request->status === 'cancelled' && in_array($order->status, ['processing', 'shipped', 'delivered'])) {
            DB::transaction(function () use ($order) {
                foreach ($order->items as $item) {
                    if ($item->productSize) {
                        $item->productSize->increment('stock_quantity', $item->quantity);
                        $item->productSize->update(['is_available' => true]);
                    }
                }
            });
        }

        $order->update(['status' => $request->status]);

        return back()->with('success', 'Order status updated successfully.');
    }

    public function updatePaymentStatus(Request $request, $paymentId)
    {
        $this->authorizeAdmin();
    
        // Allow paid, failed, or pending (for reset)
        $request->validate(['status' => 'required|in:paid,failed,pending']);
    
        $payment = Payment::findOrFail($paymentId);
    
        // Resetting paid or failed payment back to pending
        if (($payment->status === 'paid' || $payment->status === 'failed') && $request->status === 'pending') {
            $payment->update(['status' => 'pending']);
            // Reset order payment and order status
            $payment->order->update([
                'payment_status' => 'pending',
                'status' => 'pending',  // <-- reset order status as well
            ]);
            return back()->with('success', 'Payment and order status have been reset to pending.');
        }
    
        // Only allow updating pending payments to paid or failed
        if ($payment->status !== 'pending') {
            return back()->withErrors(['error' => 'This payment has already been verified or rejected.']);
        }
    
        $payment->update(['status' => $request->status]);
    
        // Update order payment status based on payment
        $payment->order->update(['payment_status' => $request->status === 'paid' ? 'paid' : 'failed']);
    
        return back()->with('success', $request->status === 'paid'
            ? 'Payment verified. You can now confirm the order.'
            : 'Payment rejected.');
    }
    
 


    // ------------------ Helper Methods ------------------

    private function getOrderForUser($user, $orderId)
    {
        $query = Order::with(['items.product', 'items.productSize', 'payments']);
        if ($user->role !== 'admin') $query->where('user_id', $user->id);

        return $query->findOrFail($orderId);
    }

    private function authorizeAdmin()
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }
    }

    private function validateOrderStatusChange(Order $order, string $newStatus)
    {
        $allowedWithoutPayment = ['pending', 'cancelled'];
        if (!in_array($newStatus, $allowedWithoutPayment, true) && $order->payment_status !== 'paid') {
            abort(400, 'Payment must be verified before updating this status.');
        }

        $sequence = ['pending', 'processing', 'delivered'];
        $currentIndex = array_search($order->status, $sequence, true);
        $newIndex = array_search($newStatus, $sequence, true);

        if ($currentIndex !== false && $newIndex !== false && $newIndex < $currentIndex && $newStatus !== 'cancelled') {
            abort(400, 'Order status cannot move backward.');
        }
    }
}
