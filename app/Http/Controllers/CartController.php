<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = $this->getCartItems();

        $items = $cartItems->map(function ($item) {
            $product = $item->product;
            $unitPrice = (float) $product->base_price;
            
            if ($item->productSize) {
                $unitPrice += (float) $item->productSize->price_adjustment;
            }

            return [
                'id' => $item->id,
                'product_id' => $product->id,
                'name' => $product->name,
                'size' => $item->size,
                'quantity' => $item->quantity,
                'unit_price' => $unitPrice,
                'total_price' => $unitPrice * $item->quantity,
                'image' => $product->image ?? '/img/slider-1.png',
            ];
        })->toArray();

        $subtotal = collect($items)->sum('total_price');
        $total = $subtotal; // Add shipping if needed

        return Inertia::render('landing/cart', [
            'items' => $items,
            'subtotal' => (float) $subtotal,
            'total' => (float) $total,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'size' => 'required|string',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        $cartItem = CartItem::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'session_id' => Auth::check() ? null : session()->getId(),
                'product_id' => $request->product_id,
                'size' => $request->size,
            ],
            [
                'quantity' => $request->quantity,
            ]
        );

        return back()->with('success', 'Item added to cart');
    }

    public function update(Request $request, CartItem $cartItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // Check ownership
        if (!$this->canModifyCartItem($cartItem)) {
            return back()->withErrors(['error' => 'Unauthorized']);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return back()->with('success', 'Cart updated');
    }

    public function destroy(CartItem $cartItem)
    {
        // Check ownership
        if (!$this->canModifyCartItem($cartItem)) {
            return back()->withErrors(['error' => 'Unauthorized']);
        }

        $cartItem->delete();

        return back()->with('success', 'Item removed from cart');
    }

    private function getCartItems()
    {
        if (Auth::check()) {
            return CartItem::where('user_id', Auth::id())
                ->with(['product', 'productSize'])
                ->get();
        }

        return CartItem::where('session_id', session()->getId())
            ->with(['product', 'productSize'])
            ->get();
    }

    private function canModifyCartItem(CartItem $cartItem): bool
    {
        if (Auth::check()) {
            return $cartItem->user_id === Auth::id();
        }

        return $cartItem->session_id === session()->getId();
    }
}
