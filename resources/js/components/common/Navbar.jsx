
import AppLogo from '@/components/app-logo';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react'
import CustomOrderModal from '@/components/common/CustomOrderModal'
import { ShoppingCart } from 'lucide-react';




export default function Navbar() {
    const { auth, cartCount } = usePage().props;

    const [openOrder, setOpenOrder] = useState(false);

    // Use window.location.pathname to get current route
    const pathname = typeof window !== "undefined" ? window.location.pathname : "";

    const isActive = (path) => pathname === path;

    return (

        <>
            {/* Header */}
            <header className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 sticky top-0 z-50">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    {/* Left Logo */}
                    <div className="flex items-center gap-2">
                        
                        <div className="flex items-center">
                            <AppLogo />
                        </div>


                    </div>

                    <nav className="hidden md:flex items-center gap-4 font-medium">
                        <Link
                            href="/"
                            className={`px-4 py-2 rounded-full transition-colors duration-200 ${isActive("/") ? "bg-emerald-500 text-white" : "text-white hover:bg-emerald-700"
                                }`}
                        >
                            Home
                        </Link>

                        <Link
                            href="/about"
                            className={`px-4 py-2 rounded-full transition-colors duration-200 ${isActive("/about") ? "bg-emerald-500 text-white" : "text-white hover:bg-emerald-700"
                                }`}
                        >
                            About
                        </Link>

                        <Link
                            href="/products"
                            className={`px-4 py-2 rounded-full transition-colors duration-200 ${isActive("/products") ? "bg-emerald-500 text-white" : "text-white hover:bg-emerald-700"
                                }`}
                        >
                            Products
                        </Link>

                        <button
                            onClick={() => {
                                if (!auth.user) {
                                    window.location.href = '/register';
                                } else {
                                    setOpenOrder(true);
                                }
                            }}
                            className="px-4 py-2 rounded-full text-white hover:bg-emerald-600 transition-colors duration-200"
                        >
                            Custom Order
                        </button>

                        <button
                            onClick={() => {
                                if (!auth.user) {
                                    window.location.href = '/register';
                                } else {
                                    window.location.href = '/cart';
                                }
                            }}
                            className="px-4 py-2 rounded-full text-white hover:bg-emerald-700 transition-colors duration-200 relative"
                        >
                            <ShoppingCart className="h-6 w-6 inline-block" />
                            {auth.user && cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </button>
                    </nav>



                    {/* Right Logo */}
                    <div>
                        {/* Auth Buttons */}
                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href="/dashboard"
                                    className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-sm font-medium text-white  hover:text-emerald-200 dark:text-gray-300 dark:hover:text-purple-400"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </header>
            {auth.user && (
                <CustomOrderModal
                    isOpen={openOrder}
                    onClose={() => setOpenOrder(false)}
                    auth={auth}
                />
            )}


        </>
    )
}
