<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'transaction_id' => 'required|string|max:4',
            'payment_type' => 'required|in:bank,qr',
        ]);

        $order = Order::findOrFail($request->order_id);

        // Check if user owns the order or is guest
        if (Auth::check() && $order->user_id !== Auth::id()) {
            return back()->withErrors(['error' => 'Unauthorized']);
        }

        $payment = Payment::create([
            'order_id' => $order->id,
            'payment_method_id' => $request->payment_method_id,
            'amount' => $order->total_amount,
            'transaction_id' => $request->transaction_id,
            'payment_type' => $request->payment_type,
            'status' => 'pending',
        ]);

        // Update order payment status
        $order->update([
            'payment_status' => 'pending',
            'payment_method' => $payment->paymentMethod->name,
            'transaction_id' => $request->transaction_id,
        ]);

        return back()->with('success', 'Payment submitted successfully! We will verify and confirm your payment shortly.');
    }
}
