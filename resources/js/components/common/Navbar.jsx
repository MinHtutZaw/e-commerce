import AppLogo from '@/components/app-logo'
import { Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import CustomOrderModal from '@/components/common/CustomOrderModal'
import { ShoppingCart, Menu, X } from 'lucide-react'

export default function Navbar() {
    const { auth, cartCount, customOrderPricing } = usePage().props

    const [openOrder, setOpenOrder] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    const pathname =
        typeof window !== 'undefined' ? window.location.pathname : ''

    const isActive = (path) => pathname === path

    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/products', label: 'Products' },
    ]

    return (
        <>
            {/* HEADER */}
            <header className="sticky top-0 z-50 bg-white shadow-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    {/* Logo */}
                    <AppLogo />

                    {/* DESKTOP NAV */}
                    <nav className="hidden md:flex items-center gap-4 font-medium">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-4 py-2 rounded-full transition
                                    ${
                                        isActive(item.href)
                                            ? 'text-emerald-600'
                                            : 'text-black hover:text-emerald-600'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {/* Custom Order */}
                        <button
                            onClick={() =>
                                auth.user
                                    ? setOpenOrder(true)
                                    : router.visit('/login')
                            }
                            className="px-4 py-2 rounded-full text-black hover:text-emerald-600"
                        >
                            Custom Order
                        </button>

                        {/* Cart */}
                        <button
                            onClick={() => router.visit('/cart')}
                            className="relative px-4 py-2 text-black hover:text-emerald-600"
                        >
                            <ShoppingCart className="h-6 w-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </button>
                    </nav>

                    {/* DESKTOP AUTH */}
                    <div className="hidden md:flex items-center gap-3">
                        {auth.user ? (
                            <>
                                <Link
                                    href="/customer/profile"
                                    className="flex items-center gap-2"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white font-bold">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-semibold">
                                        {auth.user.name}
                                    </span>
                                </Link>

                                {auth.user.role === 'admin' && (
                                    <Link
                                        href="/dashboard"
                                        className="rounded-full bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-sm text-black hover:text-emerald-600"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-full bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* MOBILE HAMBURGER */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden text-black"
                    >
                        {mobileOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </header>

            {/* MOBILE MENU */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t shadow-lg">
                    <div className="flex flex-col gap-4 px-6 py-4">

                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="text-black hover:text-emerald-600"
                            >
                                {item.label}
                            </Link>
                        ))}

                        <button
                            onClick={() => {
                                setMobileOpen(false)
                                auth.user
                                    ? setOpenOrder(true)
                                    : router.visit('/login')
                            }}
                            className="text-left text-black hover:text-emerald-600"
                        >
                            Custom Order
                        </button>

                        <button
                            onClick={() => {
                                setMobileOpen(false)
                                router.visit('/cart')
                            }}
                            className="flex items-center gap-2 text-black hover:text-emerald-600"
                        >
                            <ShoppingCart size={18} />
                           
                            {cartCount > 0 ? `Cart (${cartCount})` : 'Cart'}

                        </button>

                        <hr />

                        {auth.user ? (
                            <>
                                <Link
                                    href="/customer/profile"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Profile
                                </Link>

                                {auth.user.role === 'admin' && (
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setMobileOpen(false)}
                                        className="text-purple-600 font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                <Link href="/login">Log in</Link>
                                <Link
                                    href="/register"
                                    className="rounded-md bg-emerald-600 py-2 text-center text-white"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* CUSTOM ORDER MODAL */}
            {auth.user && (
                <CustomOrderModal
                    isOpen={openOrder}
                    onClose={() => setOpenOrder(false)}
                    auth={auth}
                    pricing={customOrderPricing}
                />
            )}
        </>
    )
}
