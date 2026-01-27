<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'account_name' => 'required|string|max:255',
            'transaction_id' => 'required|string|max:4',
        ]);

        $order = Order::findOrFail($request->order_id);

        // Check if user owns the order or is guest
        if (Auth::check() && $order->user_id !== Auth::id()) {
            return back()->withErrors(['error' => 'Unauthorized']);
        }

        // Update order payment status
        $order->update([
            'payment_status' => 'pending',
            'payment_method' => $request->account_name,
            'transaction_id' => $request->transaction_id,
        ]);

        return back()->with('success', 'Payment submitted successfully! We will verify and confirm your payment shortly.');
    }

    public function getPaymentInfo()
    {
        return response()->json([
            'account_name' => Setting::get('payment_account_name', 'EduFit'),
            'account_number' => Setting::get('payment_account_number', '09876543210'),
            'bank_name' => Setting::get('payment_bank_name', 'KBZ Bank'),
        ]);
    }
}
