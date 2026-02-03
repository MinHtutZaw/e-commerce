import Footer from "@/Components/common/Footer";
import Navbar from "@/Components/common/Navbar";
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { router } from "@inertiajs/react";

interface ProductSize {
    id: number;
    size: string;
    price: number;
    stock_quantity: number;
    available: boolean;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    category: string;
    category_id: number;
    description?: string;
    price: number;
    image: string;
    gender: "male" | "female" | "unisex";
    uniform_type: "school" | "college" | "university" | "other";
    min_order_quantity: number;
    sizes: ProductSize[];
}

interface Category {
    id: number;
    name: string;
}

interface Props {
    products: Product[];
    categories: Category[];
    filters?: {
        category?: string;
        gender?: string;
        uniform_type?: string;
        search?: string;
    };
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function Products({ products: initialProducts, categories, filters, auth }: Props) {
    const [filtersState, setFiltersState] = useState({
        category: filters?.category || "",
        gender: filters?.gender || "",
        uniform_type: filters?.uniform_type || "",
        search: filters?.search || "",
    });

    const [loading, setLoading] = useState(false);

    // Debounced filter update
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleFilterChange();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [filtersState]);

    const handleFilterChange = () => {
        setLoading(true);
        router.get(
            "/products",
            {
                category: filtersState.category || undefined,
                gender: filtersState.gender || undefined,
                uniform_type: filtersState.uniform_type || undefined,
                search: filtersState.search || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setLoading(false),
            }
        );
    };


    return (
        <>
            <Navbar />
            <div className="bg-gray-50 dark:bg-black min-h-screen">
                <div className="mx-auto max-w-7xl px-6 py-12 text-gray-800">
                    <h1 className="mb-8 text-3xl font-bold text-emerald-700">Products</h1>

                    {/* Filters + Search */}
                    <div className="mb-8 flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={filtersState.search}
                            onChange={(e) => setFiltersState({ ...filtersState, search: e.target.value })}
                            className="w-full sm:w-64 rounded-md border px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                        />

                        {/* Filter selects */}
                        <div className="flex gap-3 flex-wrap">
                            <select
                                value={filtersState.category}
                                onChange={(e) => setFiltersState({ ...filtersState, category: e.target.value })}
                                className="rounded-md border px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={filtersState.gender}
                                onChange={(e) => setFiltersState({ ...filtersState, gender: e.target.value })}
                                className="rounded-md border px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">All Genders</option>
                                <option value="male">Male Only</option>
                                <option value="female">Female Only</option>
                                <option value="unisex">Male, Female & Unisex</option>
                            </select>

                            <select
                                value={filtersState.uniform_type}
                                onChange={(e) => setFiltersState({ ...filtersState, uniform_type: e.target.value })}
                                className="rounded-md border px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">All Uniform Types</option>
                                <option value="school">School</option>
                                <option value="college">College</option>
                                <option value="university">University</option>
                                <option value="other">Other</option>
                            </select>

                           
                        </div>
                    </div>

                    {/* Loading */}
                    {loading && <p className="text-gray-500 mb-4">Loading products...</p>}

                    {/* Product Grid */}
                    {initialProducts.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {initialProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md cursor-pointer"
                                    onClick={() => router.visit(`/products/${product.slug}`)}
                                >
                                    {/* Image */}
                                    <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-gray-100 overflow-hidden">
                                        <img src={product.image} alt={product.name} className="h-full object-contain" />
                                    </div>

                                    {/* Name */}
                                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>

                                    {/* Meta */}
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                                            {product.category}
                                        </span>
                                        <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-600 capitalize">
                                            {product.gender}
                                        </span>
                                        <span className="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-600 capitalize">
                                            {product.uniform_type}
                                        </span>
                                    </div>

                                    {/* Available Sizes */}
                                    <p className="mt-2 text-sm text-gray-600">
                                        {product.sizes.length} size{product.sizes.length !== 1 ? 's' : ''} available
                                    </p>

                                    {/* View Details Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.visit(`/products/${product.slug}`);
                                        }}
                                        className="mt-4 w-full rounded-md py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition"
                                    >
                                        View Details
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
