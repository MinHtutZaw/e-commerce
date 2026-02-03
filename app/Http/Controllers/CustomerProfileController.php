<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class CustomerProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get user's orders
        $orders = Order::where('user_id', $user->id)
            ->with(['items.product', 'payments'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
        
        return Inertia::render('customer/profile', [
            'user' => $user,
            'recentOrders' => $orders,
            'stats' => [
                'totalOrders' => Order::where('user_id', $user->id)->count(),
                'pendingOrders' => Order::where('user_id', $user->id)->where('status', 'pending')->count(),
                'totalSpent' => Order::where('user_id', $user->id)->where('payment_status', 'paid')->sum('total_amount'),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'phone' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
        ]);

        $user->update($validated);

        return back()->with('success', 'Profile updated successfully!');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password updated successfully!');
    }
}
