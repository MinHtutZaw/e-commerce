import Footer from "@/Components/common/Footer";
import Navbar from "@/Components/common/Navbar";
import { router } from "@inertiajs/react";
import { Trash2 } from "lucide-react";

export default function Cart() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
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
                                {/* Item 1 */}
                                <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg bg-gray-100 sm:h-28 sm:w-28">
                                            <img
                                                src="/img/slider-1.png"
                                                alt="Purple T-shirt"
                                                className="h-full w-full object-contain p-2"
                                                
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Purple T-shirt
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Size: M
                                            </p>
                                            <p className="mt-1 text-base font-semibold text-emerald-600">
                                                $12.00
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <label className="sr-only">Quantity</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    defaultValue={1}
                                                    className="w-20 rounded-md border border-gray-300 px-3 py-2 text-center text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20"
                                                />
                                            </div>

                                            <div className="w-20 text-right">
                                                <p className="text-base font-semibold text-gray-900">
                                                    $12.00
                                                </p>
                                            </div>

                                            <button 
                                                className="flex-shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Item 2 */}
                                <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg bg-gray-100 sm:h-28 sm:w-28">
                                            <img
                                                src="/img/slider-1.png"
                                                alt="White T-shirt"
                                                className="h-full w-full object-contain p-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                White T-shirt
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Size: L
                                            </p>
                                            <p className="mt-1 text-base font-semibold text-emerald-600">
                                                $15.00
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <label className="sr-only">Quantity</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    defaultValue={2}
                                                    className="w-20 rounded-md border border-gray-300 px-3 py-2 text-center text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20"
                                                />
                                            </div>

                                            <div className="w-20 text-right">
                                                <p className="text-base font-semibold text-gray-900">
                                                    $30.00
                                                </p>
                                            </div>

                                            <button 
                                                className="flex-shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
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
                                        <span className="font-medium text-gray-900">$42.00</span>
                                    </div>

                                   

                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-semibold text-gray-900">Total</span>
                                            <span className="text-lg font-bold text-emerald-600">$42.00</span>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => router.visit('/checkout')}
                                    className="mt-6 w-full rounded-md bg-purple-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                >
                                    Proceed to Checkout
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
