<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomOrderPricing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PricingController extends Controller
{
    public function index()
    {
        $pricing = CustomOrderPricing::orderBy('type')->orderBy('name')->get();
        
        return Inertia::render('admin/pricing/index', [
            'pricing' => $pricing,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'price' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $pricing = CustomOrderPricing::findOrFail($id);
        $pricing->update($validated);

        return back()->with('success', 'Price updated successfully.');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:base,fabric',
            'name' => 'required|string|max:50',
            'price' => 'required|integer|min:0',
        ]);

        // Check if already exists
        $exists = CustomOrderPricing::where('type', $validated['type'])
            ->where('name', $validated['name'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['name' => 'This pricing option already exists.']);
        }

        CustomOrderPricing::create([
            'type' => $validated['type'],
            'name' => $validated['name'],
            'price' => $validated['price'],
            'is_active' => true,
        ]);

        return back()->with('success', 'Pricing option added successfully.');
    }

    public function destroy($id)
    {
        $pricing = CustomOrderPricing::findOrFail($id);
        $pricing->delete();

        return back()->with('success', 'Pricing option deleted successfully.');
    }
}
