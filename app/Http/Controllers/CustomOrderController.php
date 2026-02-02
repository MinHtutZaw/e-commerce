<?php

namespace App\Http\Controllers;

use App\Models\CustomOrder;
use Illuminate\Http\Request;
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
        $customOrders = CustomOrder::orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('admin/custom-orders/index', [
            'customOrders' => $customOrders,
        ]);
    }

    /**
     * Store a new custom order
     */
    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
            'customer_phone' => 'required|string',
            'delivery_address' => 'required|string',
            'customer_type' => 'required|in:child,adult',
            'gender' => 'required|in:male,female,unisex',
            'uniform_type' => 'nullable|string',
            'size_small_quantity' => 'nullable|integer|min:0',
            'size_medium_quantity' => 'nullable|integer|min:0',
            'size_large_quantity' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $customOrder = CustomOrder::create([
            'customer_name' => $request->customer_name,
            'customer_email' => $request->customer_email,
            'customer_phone' => $request->customer_phone,
            'delivery_address' => $request->delivery_address,
            'customer_type' => $request->customer_type,
            'gender' => $request->gender,
            'uniform_type' => $request->uniform_type,
            'size_small_quantity' => $request->size_small_quantity ?? 0,
            'size_medium_quantity' => $request->size_medium_quantity ?? 0,
            'size_large_quantity' => $request->size_large_quantity ?? 0,
            'notes' => $request->notes,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Custom order submitted successfully!',
            'order' => $customOrder,
        ]);
    }

    /**
     * Update the status of a custom order (Admin)
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled',
        ]);

        $customOrder = CustomOrder::findOrFail($id);
        $customOrder->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully!',
        ]);
    }
}
