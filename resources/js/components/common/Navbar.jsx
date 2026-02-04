
import AppLogo from '@/components/app-logo';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react'
import CustomOrderModal from '@/components/common/CustomOrderModal'
import AppearanceToggleDropdown from '@/components/appearance-dropdown'
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

                        
                        <button onClick={() => router.visit("/cart")} className="px-4 py-2 rounded-full text-black hover:text-emerald-600 transition-colors duration-200">
                            <div className="relative">
                                <ShoppingCart className="h-6 w-6" />

                                {cartCount > 0 && (
                                   <span className="absolute -top-2 -right-2 flex items-center justify-center bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 shadow-md">
                                   {cartCount > 99 ? "99+" : cartCount}
                                 </span>
                                 
                                )}
                            </div>
                        </button>

                    </nav>

                    {/* Theme Toggle & Auth Buttons */}
                    <div className="flex items-center gap-3">
                        {/* Dark/Light Mode Toggle */}
                     
                        {auth.user ? (
                            <>
                                {/* User Avatar with Name */}
                                <Link
                                    href="/customer/profile"
                                    className="flex items-center gap-3 px-3 py-2 bg-white  transition-all duration-300 "
                                >
                                    {/* Avatar Circle */}
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-shadow">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    {/* User Name */}
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                            {auth.user.name}
                                        </span>
                                    </div>
                                </Link>

                                {/* Dashboard button - only visible for admin */}
                                {auth.user.role === 'admin' && (
                                    <Link
                                        href="/dashboard"
                                        className="rounded-full bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700 transition-all duration-300 hover:shadow-lg"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-black hover:text-emerald-600 transition-colors duration-300"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-all duration-300 hover:shadow-lg"
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
