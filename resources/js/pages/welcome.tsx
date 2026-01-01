import AppLogo from '@/components/app-logo';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Home() {
    const { auth } = usePage<SharedData>().props;

    return (
        <><Head title="Home">
            <link rel="preconnect" href="https://fonts.bunny.net" />
            <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
        </Head>

            <div className="min-h-screen bg-white text-[#1b1b18]">
                {/* Header */}
                <header className="w-full bg-gradient-to-r from-emerald-600 to-teal-700">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                        {/* Left Logo */}
                        <div className="flex items-center gap-2">
                           {/* Replace with actual logo */}
                            <div className="h-8 w-8 rounded  flex items-center justify-center text-white font-bold">
                                <AppLogo />
                            </div>
                            <span className="text-lg font-semibold ">
                                Bloom
                            </span>
                        </div>

                        {/* Center Menu */}
                        <nav className="hidden md:flex items-center gap-10 text-white font-medium">
                            <Link href="/" className="hover:text-emerald-200">Home</Link>
                            <Link href="/about" className="hover:text-emerald-200">About</Link>
                            <Link href="/products" className="hover:text-emerald-200">Products</Link>
                            <Link href="/contact" className="hover:text-emerald-200">Contact</Link>
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
                                            className="text-sm font-medium text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
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

                {/* Hero */}
                <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-20 md:grid-cols-2">

                    {/* Left Content */}
                    <div>
                        <p className="mb-2 text-sm uppercase tracking-wide text-gray-500">
                            UNIFORMS YOU LOVE
                        </p>

                        <h1 className="mb-6 text-4xl font-semibold leading-tight text-emerald-700">
                            We are a good fit to have a better day
                        </h1>

                        <Link
                            href="/products"
                            className="inline-block rounded-md bg-emerald-600 px-6 py-3 text-white font-medium hover:bg-emerald-700 transition"
                        >
                            SEE DETAIL
                        </Link>
                    </div>

                    {/* Right Image */}
                    <div className="relative flex justify-center">
                        <img
                            src="/img/slider-1.png"
                            alt="School Uniform"
                            className="max-w-md w-full"
                        />

                        {/* Decorative dots (optional) */}
                        <div className="absolute -left-10 top-10 h-32 w-32 bg-blue-100 rounded-full opacity-40"></div>
                        <div className="absolute -right-6 bottom-10 h-20 w-20 border-4 border-pink-400 rounded-lg"></div>
                    </div>

                </section>

            </div>

        </>
    );
}
