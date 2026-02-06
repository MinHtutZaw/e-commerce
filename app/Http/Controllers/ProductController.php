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
        $query = Product::with(['category', 'sizes' => function ($q) {
                $q->where('is_available', true)
                  ->orderByRaw("CASE 
                    WHEN size = 'XS' THEN 1
                    WHEN size = 'S' THEN 2
                    WHEN size = 'M' THEN 3
                    WHEN size = 'L' THEN 4
                    WHEN size = 'XL' THEN 5
                    WHEN size = 'XXL' THEN 6
                    WHEN size = '2XL' THEN 6
                    WHEN size = '3XL' THEN 7
                    ELSE 8
                END, size");
            }])
            ->where('is_active', true);

        // Filter by category
        if ($request->has('category') && $request->category) {
            $query->where('category_id', $request->category);
        }

        // Filter by gender
        if ($request->has('gender') && $request->gender && $request->gender !== 'all') {
            if ($request->gender === 'unisex') {
                // Show male, female, AND unisex products
                $query->whereIn('gender', ['male', 'female', 'unisex']);
            } else {
                // Show only selected gender
                $query->where('gender', $request->gender);
            }
        }

        // Filter by uniform type
        if ($request->has('uniform_type') && $request->uniform_type && $request->uniform_type !== 'all') {
            $query->where('uniform_type', $request->uniform_type);
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
            $sizes = $product->sizes->where('is_available', true);
            $minPrice = $sizes->min('price') ?? 0;
            
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'category' => $product->category->name ?? 'Uncategorized',
                'category_id' => $product->category_id,
                'description' => $product->description,
                'price' => $minPrice, // Show minimum price
                'image' => $product->image ?? '/img/slider-1.png',
                'gender' => $product->gender,
                'uniform_type' => $product->uniform_type,
             
                'sizes' => $sizes->map(function ($size) {
                    return [
                        'id' => $size->id,
                        'size' => $size->size,
                        'price' => $size->price,
                        'stock_quantity' => $size->stock_quantity,
                        'available' => $size->is_available,
                    ];
                })->values()->toArray(),
            ];
        })->toArray();

        $categories = Category::where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'gender']);

        return Inertia::render('landing/products', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'category' => $request->category,
                'gender' => $request->gender,
                'uniform_type' => $request->uniform_type,
                'search' => $request->search,
            ],
        ]);
    }

    public function show(Product $product)
    {
        $product->load(['category', 'sizes' => function ($q) {
            $q->orderByRaw("CASE 
                WHEN size = 'XS' THEN 1
                WHEN size = 'S' THEN 2
                WHEN size = 'M' THEN 3
                WHEN size = 'L' THEN 4
                WHEN size = 'XL' THEN 5
                WHEN size = 'XXL' THEN 6
                WHEN size = '2XL' THEN 6
                WHEN size = '3XL' THEN 7
                ELSE 8
            END, size");
        }]);

        return Inertia::render('landing/product-details', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'category' => $product->category->name ?? 'Uncategorized',
                'category_id' => $product->category_id,
                'description' => $product->description,
                'image' => $product->image ?? '/img/slider-1.png',
                'gender' => $product->gender,
                'uniform_type' => $product->uniform_type,
        
                'is_active' => $product->is_active,
                'sizes' => $product->sizes->map(function ($size) {
                    return [
                        'id' => $size->id,
                        'size' => $size->size,
                        'price' => $size->price,
                        'stock_quantity' => $size->stock_quantity,
                        'is_available' => $size->is_available,
                    ];
                })->toArray(),
            ],
        ]);
    }
}
