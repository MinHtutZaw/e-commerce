<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'customer')
            ->withCount('orders')
            ->with(['orders' => function($q) {
                $q->where('payment_status', 'paid');
            }]);

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Sort and paginate (10 per page); allow id, name, created_at, orders_count
        $allowedSort = ['id', 'name', 'created_at', 'orders_count'];
        $sortBy = $request->get('sort_by', 'id');
        if (!in_array($sortBy, $allowedSort, true)) {
            $sortBy = 'id';
        }
        $sortOrder = strtolower($request->get('sort_order', 'desc'));
        if (!in_array($sortOrder, ['asc', 'desc'], true)) {
            $sortOrder = ($sortBy === 'name') ? 'asc' : 'desc';
        }

        $customers = $query->orderBy($sortBy, $sortOrder)->paginate(10)->withQueryString()->through(function ($customer) {
            $totalSpent = $customer->orders->where('payment_status', 'paid')->sum('total_amount');

            return [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'address' => $customer->address,
                'orders_count' => $customer->orders_count,
                'total_spent' => $totalSpent,
                'created_at' => $customer->created_at->format('M d, Y'),
                'status' => $customer->email_verified_at ? 'Active' : 'Inactive',
            ];
        });

        return Inertia::render('admin/customers/index', [
            'customers' => $customers,
            'filters' => [
                'search' => $request->search,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    public function edit($id)
    {
        $customer = User::where('role', 'customer')
            ->with(['orders' => function($q) {
                $q->with(['items.product', 'payments'])
                  ->orderBy('created_at', 'desc')
                  ->limit(10);
            }])
            ->findOrFail($id);

        $stats = [
            'total_orders' => $customer->orders()->count(),
            'pending_orders' => $customer->orders()->where('status', 'pending')->count(),
            'completed_orders' => $customer->orders()->where('status', 'delivered')->count(),
            'total_spent' => $customer->orders()->where('payment_status', 'paid')->sum('total_amount'),
        ];

        return Inertia::render('admin/customers/edit', [
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'address' => $customer->address,
                'is_active' => (bool) $customer->email_verified_at,
                'created_at' => $customer->created_at->format('F d, Y'),
            ],
            'orders' => $customer->orders->map(function($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'total_amount' => $order->total_amount,
                    'items_count' => $order->items->count(),
                    'created_at' => $order->created_at->format('M d, Y'),
                ];
            }),
            'stats' => $stats,
        ]);
    }

    public function update(Request $request, $id)
    {
        $customer = User::where('role', 'customer')->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($customer->id)],
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
        ];

        // Update password if provided
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $customer->update($data);

        return back()->with('success', 'Customer updated successfully');
    }

    public function destroy($id)
    {
        $customer = User::where('role', 'customer')->findOrFail($id);

        // Check if customer has orders
        if ($customer->orders()->count() > 0) {
            return back()->withErrors(['error' => 'Cannot delete customer with existing orders. Consider deactivating instead.']);
        }

        $customer->delete();

        return redirect()->route('admin.customers.index')->with('success', 'Customer deleted successfully');
    }

    public function toggleStatus($id)
    {
        $customer = User::where('role', 'customer')->findOrFail($id);

        if ($customer->email_verified_at) {
            $customer->update(['email_verified_at' => null]);
            $message = 'Customer set to inactive';
        } else {
            $customer->update(['email_verified_at' => now()]);
            $message = 'Customer set to active';
        }

        return back()->with('success', $message);
    }
}
