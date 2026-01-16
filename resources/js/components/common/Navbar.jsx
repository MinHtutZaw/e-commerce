
import AppLogo from '@/components/app-logo';
import { dashboard, login, register } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react'
import CustomOrderModal from '@/components/common/CustomOrderModal'




export default function Navbar() {
    const { auth } = usePage().props;

    const [openOrder, setOpenOrder] = useState(false)

    return (

        <>
            {/* Header */}
            <header className="w-full bg-gradient-to-r from-emerald-600 to-teal-700">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    {/* Left Logo */}
                    <div className="flex items-center gap-2">
                        {/* Replace with actual logo */}
                        <div className="h-8 w-8 rounded  flex items-center justify-center text-white font-bold">
                            <AppLogo />
                        </div>
                        <span className="text-lg font-semibold text-emerald-200 ">
                            EduFit
                        </span>
                    </div>

                    {/* Center Menu */}
                    <nav className="hidden md:flex items-center gap-10 text-white font-medium">
                        <Link href="/" className="hover:text-emerald-200">Home</Link>
                        <Link href="/about" className="hover:text-emerald-200">About</Link>
                        <Link href="/products" className="hover:text-emerald-200">Products</Link>
                        <button
                            onClick={() => setOpenOrder(true)}
                            className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium hover:bg-purple-700"
                        >
                            Custom Order
                        </button>
                    </nav>

                    {/* Right Logo */}
                    <div>
                        {/* Auth Buttons */}
                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="text-sm font-medium text-white  hover:text-emerald-200 dark:text-gray-300 dark:hover:text-purple-400"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
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
            <CustomOrderModal
                isOpen={openOrder}
                onClose={() => setOpenOrder(false)}
            />


        </>
    )
}
