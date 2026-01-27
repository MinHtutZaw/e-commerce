import Footer from "@/Components/common/Footer";
import Navbar from "@/Components/common/Navbar";
import { useState, useEffect } from "react";
import { ShoppingCart } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
    type: string;
    price: number;
    image: string;
    gender: 'male' | 'female' | 'unisex' | null;
    uniform_type: 'school' | 'college' | 'university' | null;
    sizes: Array<{ size: string; price: number; available: boolean }>;
}

interface Props {
    products: Product[];
    categories: Array<{ id: number; name: string }>;
}

export default function Products({ products: initialProducts, categories }: Props) {
    const [selectedGender, setSelectedGender] = useState("");
    const [selectedUniformType, setSelectedUniformType] = useState("");

    const [selectedType, setSelectedType] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [search, setSearch] = useState("");
    const [selectedSizeForProduct, setSelectedSizeForProduct] = useState<Record<number, string>>({});

    const handleAddToCart = (product: Product) => {
        const size = selectedSizeForProduct[product.id] || product.sizes[0]?.size;

        if (!size) {
            alert('Please select a size');
            return;
        }

        router.post('/cart', {
            product_id: product.id,
            size: size,
            quantity: 1,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                alert('Added to cart!');
            },
        });
    };

    const handleFilterChange = () => {
        router.get('/products', {
            type: selectedType || undefined,
            size: selectedSize || undefined,
            gender: selectedGender || undefined,
            uniform_type: selectedUniformType || undefined,
            search: search || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleFilterChange();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search]);

    const filteredProducts = initialProducts.filter((product) => {
        return (
            (!selectedType || product.type === selectedType) &&
            (!selectedGender || product.gender === selectedGender) &&
            (!selectedUniformType || product.uniform_type === selectedUniformType) &&
            (!selectedSize || product.sizes.some(s => s.size === selectedSize && s.available)) &&
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

                        {/* Right: Filters */}
                        <div className="flex gap-3">
                            <select
                                value={selectedType}
                                onChange={(e) => {
                                    setSelectedType(e.target.value);
                                    handleFilterChange();
                                }}
                                className="rounded-md border px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">All Types</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>

                            <select
                                value={selectedGender}
                                onChange={(e) => {
                                    setSelectedGender(e.target.value);
                                    handleFilterChange();
                                }}
                                className="rounded-md border px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">All Genders</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="unisex">Unisex</option>
                            </select>


                            <select
                                value={selectedUniformType}
                                onChange={(e) => {
                                    setSelectedUniformType(e.target.value);
                                    handleFilterChange();
                                }}
                                className="rounded-md border px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">All Uniform Types</option>
                                <option value="school">School</option>
                                <option value="college">College</option>
                                <option value="university">University</option>
                            </select>

                            <select
                                value={selectedSize}
                                onChange={(e) => {
                                    setSelectedSize(e.target.value);
                                    handleFilterChange();
                                }}
                                className="rounded-md border px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">All Sizes</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
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
                                        {product.type}
                                    </p>

                                    {/* Size Selection */}
                                    {product.sizes.length > 0 && (
                                        <select
                                            value={selectedSizeForProduct[product.id] || ''}
                                            onChange={(e) => setSelectedSizeForProduct({
                                                ...selectedSizeForProduct,
                                                [product.id]: e.target.value
                                            })}
                                            className="mt-2 w-full rounded-md border px-3 py-1 text-sm focus:ring-2 focus:ring-emerald-500"
                                        >
                                            <option value="">Select Size</option>
                                            {product.sizes.filter(s => s.available).map((size) => (
                                                <option key={size.size} value={size.size}>
                                                    {size.size} - ${size.price}
                                                </option>
                                            ))}
                                        </select>
                                    )}

                                    {/* Price */}
                                    <p className="mt-2 text-lg font-bold text-emerald-600">
                                        ${selectedSizeForProduct[product.id]
                                            ? product.sizes.find(s => s.size === selectedSizeForProduct[product.id])?.price || product.price
                                            : product.price}
                                    </p>

                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-purple-600 py-2 text-sm font-medium text-white hover:bg-purple-700"
                                    >
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
