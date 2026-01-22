<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'sizes'])
            ->where('is_active', true);

        // Filter by category/type
        if ($request->has('type') && $request->type) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('name', $request->type);
            });
        }

        // Filter by size
        if ($request->has('size') && $request->size) {
            $query->whereHas('sizes', function ($q) use ($request) {
                $q->where('size', $request->size)->where('is_available', true);
            });
        }

        // Search
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $products = $query->get()->map(function ($product) {
            $basePrice = (float) $product->base_price;
            return [
                'id' => $product->id,
                'name' => $product->name,
                'type' => $product->category->name ?? 'Uncategorized',
                'price' => $basePrice,
                'image' => $product->image ?? '/img/slider-1.png',
                'sizes' => $product->sizes->map(function ($size) use ($basePrice) {
                    return [
                        'size' => $size->size,
                        'price' => (float) ($basePrice + $size->price_adjustment),
                        'available' => $size->is_available,
                    ];
                })->toArray(),
            ];
        })->toArray();

        $categories = Category::where('is_active', true)->get(['id', 'name']);

        return Inertia::render('landing/products', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }
}
