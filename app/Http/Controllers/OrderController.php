<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
            'customer_phone' => 'required|string',
            'delivery_address' => 'required|string',
        ]);

        $cartItems = Auth::check()
            ? CartItem::where('user_id', Auth::id())->with(['product', 'productSize'])->get()
            : CartItem::where('session_id', session()->getId())->with(['product', 'productSize'])->get();

        if ($cartItems->isEmpty()) {
            return back()->withErrors(['error' => 'Cart is empty']);
        }

        DB::beginTransaction();
        try {
            $subtotal = 0;
            $orderItems = [];

            foreach ($cartItems as $cartItem) {
                $product = $cartItem->product;
                $unitPrice = $product->base_price;
                
                if ($cartItem->productSize) {
                    $unitPrice += $cartItem->productSize->price_adjustment;
                }

                $totalPrice = $unitPrice * $cartItem->quantity;
                $subtotal += $totalPrice;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_type' => $product->category->name ?? null,
                    'size' => $cartItem->size,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $totalPrice,
                ];
            }

            $shippingCost = 0; // Calculate shipping if needed
            $totalAmount = $subtotal + $shippingCost;

            $order = Order::create([
                'user_id' => Auth::id(),
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'customer_phone' => $request->customer_phone,
                'delivery_address' => $request->delivery_address,
                'order_type' => 'standard',
                'status' => 'pending',
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'total_amount' => $totalAmount,
                'payment_status' => 'pending',
            ]);

            foreach ($orderItems as $item) {
                $order->items()->create($item);
            }

            // Clear cart
            $cartItems->each->delete();

            DB::commit();

            return back()->with([
                'success' => 'Order created successfully',
                'order' => $order,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create order']);
        }
    }
}
