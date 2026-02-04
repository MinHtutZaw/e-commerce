<?php

namespace App\Http\Controllers;

use App\Models\CustomOrder;
use App\Models\CustomOrderSize;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CustomOrderController extends Controller
{
    /**
     * Display the custom order form
     */
    public function create()
    {
        return Inertia::render('landing/custom-order');
    }

    /**
     * Display a listing of custom orders (Admin)
     */
    public function index()
    {
        $customOrders = CustomOrder::with(['user', 'sizes'])
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(function ($order) {
                $order->total_quantity = $order->sizes->sum('quantity');
                return $order;
            });

        return Inertia::render('admin/custom-orders/index', [
            'customOrders' => $customOrders,
        ]);
    }

    /**
     * Display customer's own custom orders
     */
    public function customerIndex()
    {
        $customOrders = CustomOrder::with(['sizes'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                $order->total_quantity = $order->sizes->sum('quantity');
                return $order;
            });

        return Inertia::render('customer/custom-orders', [
            'customOrders' => $customOrders,
        ]);
    }

    /**
     * Store a new custom order
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_type' => 'required|in:child,adult',
            'gender' => 'required|in:male,female,unisex',
            'uniform_type' => 'nullable|string|max:255',
            'sizes' => 'required|array|min:1',
            'sizes.*.size' => 'required|string|max:10',
            'sizes.*.quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        // Validate minimum total quantity
        $totalQuantity = collect($request->sizes)->sum('quantity');
        if ($totalQuantity < 10) {
            return back()->withErrors(['sizes' => 'Minimum total quantity is 10 items.']);
        }

        DB::beginTransaction();
        try {
            // Create custom order (user info comes from authenticated user)
            $customOrder = CustomOrder::create([
                'user_id' => Auth::id(),
                'customer_type' => $request->customer_type,
                'gender' => $request->gender,
                'uniform_type' => $request->uniform_type ?? 'school',
                'notes' => $request->notes,
                'status' => 'pending',
            ]);

            // Create sizes
            foreach ($request->sizes as $sizeData) {
                if (!empty($sizeData['size']) && $sizeData['quantity'] > 0) {
                    $customOrder->sizes()->create([
                        'size' => $sizeData['size'],
                        'quantity' => (int) $sizeData['quantity'],
                    ]);
                }
            }

            DB::commit();

            return back()->with('success', 'Custom order submitted successfully! We will contact you soon with a quote.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Custom order creation failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to submit order. Please try again.']);
        }
    }

    /**
     * Show a specific custom order (Admin)
     */
    public function show($id)
    {
        $customOrder = CustomOrder::with(['user', 'product', 'sizes'])->findOrFail($id);
        $customOrder->total_quantity = $customOrder->sizes->sum('quantity');

        return Inertia::render('admin/custom-orders/show', [
            'customOrder' => $customOrder,
        ]);
    }

    /**
     * Update the status of a custom order (Admin)
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,quoted,confirmed,processing,completed,cancelled',
        ]);

        $customOrder = CustomOrder::findOrFail($id);
        $customOrder->update(['status' => $request->status]);

        return back()->with('success', 'Status updated successfully!');
    }

    /**
     * Update quoted price (Admin)
     */
    public function updateQuote(Request $request, $id)
    {
        $request->validate([
            'quoted_price' => 'required|numeric|min:0',
        ]);

        $customOrder = CustomOrder::findOrFail($id);
        $customOrder->update([
            'quoted_price' => $request->quoted_price,
            'status' => 'quoted',
        ]);

        return back()->with('success', 'Quote updated successfully!');
    }
}
