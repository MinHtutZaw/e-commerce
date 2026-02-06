<?php

namespace App\Http\Controllers;

use App\Models\CustomOrder;
use App\Models\CustomOrderPricing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CustomOrderController extends Controller
{

    // Show form
    public function create()
    {
        return Inertia::render('landing/custom-order');
    }

    // Store order
    public function store(Request $request)
    {
        // Get active fabric types from database
        $activeFabrics = CustomOrderPricing::where('type', 'fabric')
            ->where('is_active', true)
            ->pluck('name')
            ->toArray();
        
        $validated = $request->validate([
            'customer_type' => 'required|in:child,adult',
            'fabric_type' => 'required|string|in:' . implode(',', $activeFabrics),
            'waist' => 'nullable|numeric|min:0',
            'hip' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'uniform_type' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);
    
        // Get prices from database
        $basePrices = CustomOrderPricing::getBasePrices();
        $fabricPrices = CustomOrderPricing::getFabricPrices();
        
        $basePrice = $basePrices[$validated['customer_type']] ?? 0;
        $fabricPrice = $fabricPrices[$validated['fabric_type']] ?? 0;
        $unitPrice = $basePrice + $fabricPrice;
        $totalPrice = $unitPrice * $validated['quantity'];
    
        DB::beginTransaction();
        try {
            CustomOrder::create([
                'user_id' => Auth::id(),
                'customer_type' => $validated['customer_type'],
                'fabric_type' => $validated['fabric_type'],
                'uniform_type' => $validated['uniform_type'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'waist' => $validated['waist'],
                'hip' => $validated['hip'],
                'height' => $validated['height'],
                'quantity' => $validated['quantity'],
                'unit_price' => $unitPrice,
                'total_price' => $totalPrice,
                'status' => 'pending',
            ]);
    
            DB::commit();
    
            return redirect()->back()->with('success', 'Custom order submitted successfully! We will contact you soon.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Custom order creation failed: '.$e->getMessage());
    
            return redirect()->back()->withErrors(['error' => 'Failed to submit order. Please try again.']);
        }
    }
    
    

    // Customer orders
    public function customerIndex()
    {
        $orders = CustomOrder::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('customer/custom-orders', [
            'customOrders' => $orders,
        ]);
    }

    // Admin: List all custom orders
    public function index(Request $request)
    {
        $orders = CustomOrder::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('admin/custom-orders/index', [
            'customOrders' => $orders,
        ]);
    }

    // Admin: Show single custom order
    public function show($id)
    {
        $order = CustomOrder::with('user')->findOrFail($id);

        return Inertia::render('admin/custom-orders/show', [
            'customOrder' => $order,
        ]);
    }

    // Admin: Update order status
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,processing,completed,cancelled',
        ]);

        $order = CustomOrder::findOrFail($id);
        $order->update(['status' => $validated['status']]);

        return back()->with('success', 'Order status updated successfully.');
    }

    // Admin: Update quote (kept for compatibility, but not used in simplified version)
    public function updateQuote(Request $request, $id)
    {
        $validated = $request->validate([
            'quoted_price' => 'required|numeric|min:0',
        ]);

        $order = CustomOrder::findOrFail($id);
        $order->update(['total_price' => $validated['quoted_price']]);

        return back()->with('success', 'Quote updated successfully.');
    }
}
