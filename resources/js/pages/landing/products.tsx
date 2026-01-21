import Footer from "@/Components/common/Footer";
import Navbar from "@/Components/common/Navbar";
import { useState } from "react";
import { ShoppingCart } from 'lucide-react';

const PRODUCTS = [
    {
        id: 1,
        name: "School Shirt",
        type: "Shirt",
        size: "M",
        price: 12,
        image: "/img/slider-1.png",
    },
    {
        id: 2,
        name: "School Pant",
        type: "Pant",
        size: "L",
        price: 18,
        image: "/img/slider-1.png",
    },
    {
        id: 3,
        name: "School Blouse",
        type: "Blouse",
        size: "S",
        price: 14,
        image: "/img/slider-1.png",
    },
    {
        id: 4,
        name: "Sports T-Shirt",
        type: "Shirt",
        size: "L",
        price: 15,
        image: "/img/slider-1.png",
    },
];

export default function Products() {
    const [selectedType, setSelectedType] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [search, setSearch] = useState("");


    const filteredProducts = PRODUCTS.filter((product) => {
        return (
            (!selectedType || product.type === selectedType) &&
            (!selectedSize || product.size === selectedSize) &&
            (!search || product.name.toLowerCase().includes(search.toLowerCase()))
        );
    });


    return (
        <>
            <Navbar />
            <div className="bg-gray-50">
                <div className=" mx-auto max-w-7xl bg-gray-50 px-6 py-12 text-gray-800">


                    {/* Page Title */}
                    <h1 className="mb-8 text-3xl font-bold text-emerald-700">Products</h1>


                    {/* Filters + Search */}
                    <div className="mb-8 flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

                        {/* Left: Filters */}
                        <div className="w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-md border px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        {/* Right: Search */}
                        <div className="flex gap-3">
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="rounded-md border px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">All Types</option>
                                <option value="Shirt">Shirt</option>
                                <option value="Pant">Pant</option>
                                <option value="Blouse">Blouse</option>
                            </select>

                            <select
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="rounded-md border px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">All Sizes</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                            </select>
                        </div>
                    </div>


                    {/* Product Grid */}

                    {filteredProducts.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
                                >
                                    {/* Image */}
                                    <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-gray-100">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-28 object-contain"
                                        />
                                    </div>

                                    {/* Name */}
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {product.name}
                                    </h3>

                                    {/* Meta */}
                                    <p className="mt-1 text-sm text-gray-500">
                                        {product.type} • Size {product.size}
                                    </p>

                                    {/* Price */}
                                    <p className="mt-2 text-lg font-bold text-emerald-600">
                                        ${product.price}
                                    </p>

                                    <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-purple-600 py-2 text-sm font-medium text-white hover:bg-purple-700">
                                        <ShoppingCart className="h-4 w-4" />
                                        Add to Cart
                                    </button>

                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No products found.</p>
                    )}

                </div>
            </div>
            <Footer />
        </>

    );
}
