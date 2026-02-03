import Footer from "@/Components/common/Footer";
import Navbar from "@/Components/common/Navbar";
import { router } from "@inertiajs/react";
import { Trash2, Plus, Minus } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";

interface CartItem {
    id: number;
    product_id: number;
    product_size_id: number;
    name: string;
    size: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    image: string;
    gender?: string;
    uniform_type?: string;
}

interface Props {
    items: CartItem[];
    subtotal: number;
    total: number;
}

interface OrderResponse {
    order: {
        id: number;
    };
}

export default function Cart({ items: initialItems, subtotal: initialSubtotal, total: initialTotal }: Props) {
    const [items, setItems] = useState(initialItems);
    const [subtotal, setSubtotal] = useState(initialSubtotal);
    const [total, setTotal] = useState(initialTotal);
    const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
    const debounceTimers = useRef<Map<number, NodeJS.Timeout>>(new Map());

    // Optimistic update for immediate UI feedback
    const updateLocalQuantity = (itemId: number, quantity: number) => {
        setItems(prevItems => {
            const updatedItems = prevItems.map(item => {
                if (item.id === itemId) {
                    const newTotalPrice = item.unit_price * quantity;
                    return { ...item, quantity, total_price: newTotalPrice };
                }
                return item;
            });

            // Recalculate totals locally
            const newSubtotal = updatedItems.reduce((sum, item) => sum + item.total_price, 0);
            setSubtotal(newSubtotal);
            setTotal(newSubtotal);

            return updatedItems;
        });
    };

    // Debounced server update
    const handleQuantityChange = useCallback((itemId: number, quantity: number) => {
        if (quantity < 1) return;

        // Update UI immediately
        updateLocalQuantity(itemId, quantity);

        // Clear existing timer for this item
        const existingTimer = debounceTimers.current.get(itemId);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }

        // Set new timer for server update
        const timer = setTimeout(() => {
            setUpdatingItems(prev => new Set(prev).add(itemId));
            
            router.put(`/cart/${itemId}`, { quantity }, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page: any) => {
                    setItems(page.props.items as CartItem[]);
                    setSubtotal(page.props.subtotal as number);
                    setTotal(page.props.total as number);
                    setUpdatingItems(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(itemId);
                        return newSet;
                    });
                },
                onError: () => {
                    toast.error('Failed to update quantity');
                    // Revert on error
                    setItems(initialItems);
                    setSubtotal(initialSubtotal);
                    setTotal(initialTotal);
                    setUpdatingItems(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(itemId);
                        return newSet;
                    });
                },
            });
        }, 800); // Wait 800ms after user stops typing

        debounceTimers.current.set(itemId, timer);
    }, [initialItems, initialSubtotal, initialTotal]);

    const handleRemove = (itemId: number) => {
        router.delete(`/cart/${itemId}`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page: any) => {
                setItems(page.props.items as CartItem[]);
                setSubtotal(page.props.subtotal as number);
                setTotal(page.props.total as number);
                toast.success('Item removed from cart');
            },
        });
    };

    // Button-based quantity change (no debounce needed)
    const handleQuantityButton = (itemId: number, delta: number) => {
        const item = items.find(i => i.id === itemId);
        if (!item) return;
        
        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) return;

        handleQuantityChange(itemId, newQuantity);
    };

    if (items.length === 0) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 dark:bg-black">
                    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                        <div className="text-center py-12">
                            <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 sm:text-4xl mb-4">
                                Your Cart is Empty
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">Add some products to get started!</p>
                            <button 
                                onClick={() => router.visit('/products')}
                                className="inline-block rounded-md bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-emerald-700 sm:text-4xl">
                            Your Cart
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Review your items before checkout
                        </p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Cart Items Section */}
                        <div className="lg:col-span-2">
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center">
                                        <div className="flex-shrink-0">
                                            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg bg-gray-100 sm:h-28 sm:w-28">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full object-contain p-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {item.name}
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Size: {item.size}
                                                </p>
                                                <p className="mt-1 text-base font-semibold text-emerald-600">
                                                    {item.unit_price.toLocaleString()} MMK
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <label className="text-sm font-medium text-gray-700 mr-2">Qty:</label>
                                                    <div className="flex items-center gap-1 border border-gray-300 rounded-md bg-white">
                                                        <button
                                                            onClick={() => handleQuantityButton(item.id, -1)}
                                                            disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                                                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-md"
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus size={16} className="text-gray-600" />
                                                        </button>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => {
                                                                const val = parseInt(e.target.value) || 1;
                                                                handleQuantityChange(item.id, val);
                                                            }}
                                                            disabled={updatingItems.has(item.id)}
                                                            className="w-14 text-center text-sm text-gray-900 font-medium border-x border-gray-300 focus:outline-none focus:ring-0 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                                        />
                                                        <button
                                                            onClick={() => handleQuantityButton(item.id, 1)}
                                                            disabled={updatingItems.has(item.id)}
                                                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-md"
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus size={16} className="text-gray-600" />
                                                        </button>
                                                    </div>
                                                    {updatingItems.has(item.id) && (
                                                        <span className="text-xs text-gray-500 animate-pulse">Updating...</span>
                                                    )}
                                                </div>

                                                <div className="w-24 text-right">
                                                    <p className="text-base font-semibold text-gray-900">
                                                        {item.total_price.toLocaleString()} MMK
                                                    </p>
                                                </div>

                                                <button 
                                                    onClick={() => handleRemove(item.id)}
                                                    className="flex-shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-8 rounded-xl border bg-white p-6 shadow-sm">
                                <h2 className="mb-6 text-xl font-semibold text-gray-900">
                                    Order Summary
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-gray-900">{subtotal.toLocaleString()} MMK</span>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-semibold text-gray-900">Total</span>
                                            <span className="text-lg font-bold text-emerald-600">{total.toLocaleString()} MMK</span>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                   onClick={() => {
                                       // Create order from cart, backend will redirect to checkout
                                       router.post('/orders', {
                                           notes: '',
                                       }, {
                                           onError: (errors) => {
                                               console.error('Order creation error:', errors);
                                               toast.error('Failed to create order', {
                                                   description: 'Please try again or contact support',
                                               });
                                           },
                                       });
                                   }}
                                   className="mt-6 w-full rounded-md bg-purple-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                               >
                                   Proceed to Payment
                               </button>

                                <button onClick={() => router.visit('/products')} className="mt-3 w-full rounded-md border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
