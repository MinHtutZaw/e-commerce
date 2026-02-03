import AppLogo from '@/components/app-logo';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import Navbar from '@/Components/common/Navbar';
import Footer from '@/Components/common/Footer';

export default function Home() {
    const { auth } = usePage<SharedData>().props;
    

    return (
        <><Head title="Home">
            <link rel="preconnect" href="https://fonts.bunny.net" />
            <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            <style>{`
                html, body {
                    background-color: white !important;
                }
            `}</style>
        </Head>

            <div className="min-h-screen bg-white dark:bg-black text-[#1b1b18] dark:text-white">

                <Navbar />

                {/* Hero */}
                <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-20 md:grid-cols-2">

                    {/* Left Content */}
                    <div>
                        <p className="text-sm uppercase text-gray-500 mb-2">
                            SCHOOL & UNIVERSITY UNIFORMS
                        </p>

                        <h1 className="text-4xl font-semibold text-emerald-700 mb-4">
                            Quality Uniforms Made Simple
                        </h1>

                        <p className="text-gray-600 mb-6">
                            EduFit provides school and university uniforms with easy online ordering
                            and custom uniform options for bulk orders.
                        </p>

                        <Link
                            href="/products"
                            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700"
                        >
                            View Products
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


                <section className="bg-emerald-600 py-16">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h2 className="text-3xl font-semibold mb-10 text-white">
                            Why Choose EduFit
                        </h2>

                        <div className="grid md:grid-cols-4 gap-6">
                            <div className="p-6 bg-white rounded shadow">
                                <h3 className="font-semibold mb-2">Quality Materials</h3>
                                <p className="text-sm text-gray-600">
                                    Durable and comfortable fabrics for daily use.
                                </p>
                            </div>

                            <div className="p-6 bg-white rounded shadow">
                                <h3 className="font-semibold mb-2">Custom Orders</h3>
                                <p className="text-sm text-gray-600">
                                    Customized uniforms available for bulk orders of 10 or more.
                                </p>
                            </div>

                            <div className="p-6 bg-white rounded shadow">
                                <h3 className="font-semibold mb-2">Easy Ordering</h3>
                                <p className="text-sm text-gray-600">
                                    Simple online ordering without paperwork.
                                </p>
                            </div>

                            <div className="p-6 bg-white rounded shadow">
                                <h3 className="font-semibold mb-2">Wide Delivery</h3>
                                <p className="text-sm text-gray-600">
                                    Delivery available to multiple cities across Myanmar.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>


              

               


                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h2 className="text-3xl font-semibold mb-10">
                            How It Works
                        </h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <h3 className="font-semibold mb-2">1. Browse</h3>
                                <p className="text-gray-600">
                                    Browse available uniforms online.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">2. Order</h3>
                                <p className="text-gray-600">
                                    Place standard or custom uniform orders.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">3. Track</h3>
                                <p className="text-gray-600">
                                    Track your order status easily.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* footer */}
               <Footer/>



            </div>

        </>
    );
}
