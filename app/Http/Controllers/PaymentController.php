<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'bank' => 'required|in:KBZ,AYA',
            'transaction_id' => 'required|string|size:4',
            'amount' => 'required|integer|min:0',
        ]);

        $order = Order::findOrFail($request->order_id);

        // Check if user owns the order
        if ($order->user_id !== Auth::id()) {
            return back()->withErrors(['error' => 'Unauthorized']);
        }

        // Verify amount matches order total
        if ($request->amount != $order->total_amount) {
            return back()->withErrors(['error' => 'Payment amount does not match order total']);
        }

        // Check if payment already exists
        $existingPayment = Payment::where('order_id', $order->id)
            ->whereIn('status', ['pending', 'paid'])
            ->first();

        if ($existingPayment) {
            return back()->withErrors(['error' => 'Payment already submitted for this order']);
        }

        // Create payment record
        Payment::create([
            'order_id' => $order->id,
            'bank' => $request->bank,
            'transaction_id' => $request->transaction_id,
            'amount' => $request->amount,
            'status' => 'pending',
        ]);

        // Update order payment status
        $order->update(['payment_status' => 'pending']);

        return redirect()->route('orders.show', $order->id)
            ->with('success', 'Payment submitted successfully! Admin will verify your payment shortly.');
    }

    public function getPaymentInfo()
    {
        // Payment methods with their account information
        $paymentMethods = [
            'KBZ' => [
                'bank_name' => 'KBZ Pay',
                'account_name' => 'EduFit Uniforms',
                'account_number' => '09123456789',
            ],
            'AYA' => [
                'bank_name' => 'AYA Pay',
                'account_name' => 'EduFit Uniforms',
                'account_number' => '09987654321',
            ],
        ];

        return response()->json($paymentMethods);
    }
}
