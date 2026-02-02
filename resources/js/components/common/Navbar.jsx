
import AppLogo from '@/components/app-logo';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react'
import CustomOrderModal from '@/components/common/CustomOrderModal'
import { ShoppingCart, User } from 'lucide-react';




export default function Navbar() {
    const { auth, cartCount } = usePage().props;

    const [openOrder, setOpenOrder] = useState(false);

    // Use window.location.pathname to get current route
    const pathname = typeof window !== "undefined" ? window.location.pathname : "";

    const isActive = (path) => pathname === path;

    return (

        <>
            {/* Header */}
            <header className="w-full bg-white sticky top-0 z-50 shadow-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    {/* Left Logo */}
                    <div className="flex items-center gap-2">
                        <AppLogo />
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-4 font-medium">
                        {[
                            { href: "/", label: "Home" },
                            { href: "/about", label: "About" },
                            { href: "/products", label: "Products" },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-4 py-2 rounded-full transition-colors duration-200 ${isActive(item.href)
                                        ? "text-emerald-600 bg-white"
                                        : "text-black hover:text-emerald-600"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {/* Custom Order Button */}
                        <button
                            onClick={() => {
                                if (!auth.user) {
                                    router.visit("/login");
                                } else {
                                    setOpenOrder(true);
                                }
                            }}
                            className="px-4 py-2 rounded-full text-black hover:text-emerald-600 transition-colors duration-200  "
                        >
                            Custom Order
                        </button>

                        {/* Cart Button */}
                        <button
                            onClick={() => {
                                if (!auth.user) {
                                    router.visit("/login");
                                } else {
                                    router.visit("/cart");
                                }
                            }}
                            className="px-4 py-2 rounded-full text-black hover:text-emerald-600 transition-colors duration-200 relative"
                        >
                            <ShoppingCart className="h-6 w-6 inline-block" />
                            {auth.user && cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount > 99 ? "99+" : cartCount}
                                </span>
                            )}
                        </button>
                    </nav>

                    {/* Right Auth Buttons */}
                    <div className="flex items-center gap-3">
                        {auth.user ? (
                            <>
                                <Link
                                    href="/customer/profile"
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 flex items-center gap-2"
                                >
                                    <User className="h-4 w-4" />
                                    Profile
                                </Link>
                                {/* Dashboard button - only visible for admin */}
                                {auth.user.role === 'admin' && (
                                    <Link
                                        href="/dashboard"
                                        className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-black hover:text-emerald-600"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                </div>

                {/* Custom Order Modal */}
                {auth.user && (
                    <CustomOrderModal
                        isOpen={openOrder}
                        onClose={() => setOpenOrder(false)}
                        auth={auth}
                    />
                )}
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
