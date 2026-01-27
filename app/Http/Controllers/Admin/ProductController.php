<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::paginate(10);

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'flash' => session('flash'),
        ]);
    }
    public function create()
    {
        return Inertia::render('admin/products/create', [
        'categories' => Category::all(),
        ]);
    }
    

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'min_order_quantity' => 'required|integer|min:1',
            'image' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
    
        Product::create($validated);
    
        return redirect()->route('admin.products.index')
            ->with('flash', [
                'type' => 'success',
                'message' => 'Product created successfully',
            ]);
    }
    
}
