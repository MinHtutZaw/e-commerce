<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductSize;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = CartItem::where('user_id', Auth::id())
            ->with(['product.category', 'productSize'])
            ->get();

        $items = $cartItems->map(function ($item) {
            $product = $item->product;
            $productSize = $item->productSize;
            $unitPrice = $productSize ? $productSize->price : 0;

            return [
                'id' => $item->id,
                'product_id' => $product->id,
                'product_size_id' => $item->product_size_id,
                'name' => $product->name,
                'size' => $productSize ? $productSize->size : 'N/A',
                'quantity' => $item->quantity,
                'unit_price' => $unitPrice,
                'total_price' => $unitPrice * $item->quantity,
                'image' => $product->image ?? '/img/slider-1.png',
                'gender' => $product->gender,
                'uniform_type' => $product->uniform_type,
                'max_quantity' => $productSize ? $productSize->stock_quantity : 0,
            ];
        })->toArray();

        $subtotal = collect($items)->sum('total_price');
        $total = $subtotal;

        return Inertia::render('landing/cart', [
            'items' => $items,
            'subtotal' => $subtotal,
            'total' => $total,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_size_id' => 'required|exists:product_sizes,id',
            'quantity' => 'required|integer|min:1',
        ]);

        // Verify product_size belongs to product
        $productSize = ProductSize::where('id', $request->product_size_id)
            ->where('product_id', $request->product_id)
            ->where('is_available', true)
            ->firstOrFail();

        if ($productSize->stock_quantity <= 0) {
            return back()->withErrors(['quantity' => 'This size is currently sold out.']);
        }

        if ($request->quantity > $productSize->stock_quantity) {
            return back()->withErrors([
                'quantity' => "Only {$productSize->stock_quantity} item(s) available for {$productSize->size}."
            ]);
        }

        $cartItem = CartItem::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->where('product_size_id', $request->product_size_id)
            ->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $request->quantity;
            if ($newQuantity > $productSize->stock_quantity) {
                return back()->withErrors([
                    'quantity' => "Only {$productSize->stock_quantity} item(s) available for {$productSize->size}."
                ]);
            }
            $cartItem->update([
                'quantity' => $newQuantity,
            ]);
        } else {
            CartItem::create([
                'user_id' => Auth::id(),
                'product_id' => $request->product_id,
                'product_size_id' => $request->product_size_id,
                'quantity' => $request->quantity,
            ]);
        }

        return back()->with('success', 'Item added to cart');
    }

    public function update(Request $request, CartItem $cartItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // Check ownership
        if ($cartItem->user_id !== Auth::id()) {
            return back()->withErrors(['error' => 'Unauthorized']);
        }

        $productSize = ProductSize::find($cartItem->product_size_id);
        if (!$productSize || $productSize->stock_quantity <= 0) {
            return back()->withErrors(['quantity' => 'This size is currently unavailable.']);
        }

        if ($request->quantity > $productSize->stock_quantity) {
            return back()->withErrors([
                'quantity' => "Only {$productSize->stock_quantity} item(s) available for {$productSize->size}."
            ]);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return back()->with('success', 'Cart updated');
    }

    public function destroy(CartItem $cartItem)
    {
        // Check ownership
        if ($cartItem->user_id !== Auth::id()) {
            return back()->withErrors(['error' => 'Unauthorized']);
        }

        $cartItem->delete();

        return back()->with('success', 'Item removed from cart');
    }

    public function count()
    {
        $count = CartItem::where('user_id', Auth::id())->sum('quantity');
        
        return response()->json(['count' => $count]);
    }
}
