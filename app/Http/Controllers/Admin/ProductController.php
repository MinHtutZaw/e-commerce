<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'sizes' => function ($query) {
            $query->orderByRaw("CASE 
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
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('admin/products/index', [
            'products' => $products,
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
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'min_order_quantity' => 'required|integer|min:1',
            'gender' => 'required|in:male,female,unisex',
            'uniform_type' => 'required|in:school,college,university,other',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'is_active' => 'boolean',
            'sizes' => 'required|array|min:1',
            'sizes.*.size' => 'required|string',
            'sizes.*.price' => 'required|integer|min:0',
            'sizes.*.stock_quantity' => 'required|integer|min:0',
            'sizes.*.is_available' => 'boolean',
        ]);
    
        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/products'), $imageName);
            $validated['image'] = '/uploads/products/' . $imageName;
        }

        // Generate slug from name
        $slug = Str::slug($validated['name']);
        $originalSlug = $slug;
        $counter = 1;
    
        // Ensure the slug is unique
        while (Product::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }
    
        $validated['slug'] = $slug;
    
        // Set default is_active if not provided
        if (!isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }
    
        // Extract sizes from validated data
        $sizes = $validated['sizes'];
        unset($validated['sizes']);

        // Create product
        $product = Product::create($validated);

        // Create product sizes
        foreach ($sizes as $sizeData) {
            $product->sizes()->create([
                'size' => $sizeData['size'],
                'price' => $sizeData['price'],
                'stock_quantity' => $sizeData['stock_quantity'],
                'is_available' => $sizeData['is_available'] ?? true,
            ]);
        }
    
        return redirect()->route('admin.products.index')
            ->with('flash', 'Product created successfully!');
    }

    public function edit($id)
    {
        $product = Product::with(['category', 'sizes' => function ($query) {
            $query->orderByRaw("CASE 
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
        }])->findOrFail($id);
        
        return Inertia::render('admin/products/edit', [
            'product' => $product,
            'categories' => Category::all(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'min_order_quantity' => 'required|integer|min:1',
            'gender' => 'required|in:male,female,unisex',
            'uniform_type' => 'required|in:school,college,university,other',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'is_active' => 'boolean',
            'sizes' => 'required|array|min:1',
            'sizes.*.id' => 'nullable|exists:product_sizes,id',
            'sizes.*.size' => 'required|string',
            'sizes.*.price' => 'required|integer|min:0',
            'sizes.*.stock_quantity' => 'required|integer|min:0',
            'sizes.*.is_available' => 'boolean',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image && file_exists(public_path($product->image))) {
                unlink(public_path($product->image));
            }

            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/products'), $imageName);
            $validated['image'] = '/uploads/products/' . $imageName;
        }

        // Generate slug from name if name changed
        if ($product->name !== $validated['name']) {
            $slug = Str::slug($validated['name']);
            $originalSlug = $slug;
            $counter = 1;

            // Ensure the slug is unique (excluding current product)
            while (Product::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }

            $validated['slug'] = $slug;
        }

        // Set default is_active if not provided
        if (!isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }

        // Extract sizes from validated data
        $sizes = $validated['sizes'];
        unset($validated['sizes']);

        $product->update($validated);

        // Sync product sizes
        $existingSizeIds = [];
        foreach ($sizes as $sizeData) {
            if (isset($sizeData['id'])) {
                // Update existing size
                $productSize = $product->sizes()->find($sizeData['id']);
                if ($productSize) {
                    $productSize->update([
                        'size' => $sizeData['size'],
                        'price' => $sizeData['price'],
                        'stock_quantity' => $sizeData['stock_quantity'],
                        'is_available' => $sizeData['is_available'] ?? true,
                    ]);
                    $existingSizeIds[] = $sizeData['id'];
                }
            } else {
                // Create new size
                $newSize = $product->sizes()->create([
                    'size' => $sizeData['size'],
                    'price' => $sizeData['price'],
                    'stock_quantity' => $sizeData['stock_quantity'],
                    'is_available' => $sizeData['is_available'] ?? true,
                ]);
                $existingSizeIds[] = $newSize->id;
            }
        }

        // Delete sizes that are not in the request
        $product->sizes()->whereNotIn('id', $existingSizeIds)->delete();

        return redirect()->route('admin.products.index')
            ->with('flash', 'Product updated successfully!');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('flash', 'Product deleted successfully!');
    }
}
