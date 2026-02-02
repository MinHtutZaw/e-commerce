import Footer from "@/Components/common/Footer";
import Navbar from "@/Components/common/Navbar";
import { useState } from "react";
import { ShoppingCart, Info, ArrowLeft } from "lucide-react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

interface ProductSize {
    id: number;
    size: string;
    price: number;
    stock_quantity: number;
    is_available: boolean;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    category: string;
    category_id: number;
    description?: string;
    image: string;
    gender: "male" | "female" | "unisex";
    uniform_type: "school" | "college" | "university" | "other";
    min_order_quantity: number;
    is_active: boolean;
    sizes: ProductSize[];
}

interface Props {
    product: Product;
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function ProductDetails({ product, auth }: Props) {
    const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);

    const selectedSize = product.sizes.find((s) => s.id === selectedSizeId);
    const currentPrice = selectedSize?.price || product.sizes[0]?.price || 0;
    const currentStock = selectedSize?.stock_quantity || 0;

    const handleAddToCart = () => {
        if (!auth?.user) {
            toast.error("Please login to add items to cart", {
                description: "You need an account to shop with us",
                action: {
                    label: "Register",
                    onClick: () => router.visit("/register"),
                },
            });
            return;
        }

        if (!selectedSizeId) {
            toast.warning("Please select a size", {
                description: "Choose a size before adding to cart",
            });
            return;
        }

        router.post(
            "/cart",
            {
                product_id: product.id,
                product_size_id: selectedSizeId,
                quantity: 1,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Added to cart!", {
                        description: `${product.name} - ${selectedSize?.size}`,
                    });
                },
                onError: (errors) => {
                    console.error("Add to cart error:", errors);
                    toast.error("Failed to add to cart", {
                        description: "Please try again or contact support",
                    });
                },
            }
        );
    };

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <button
                        onClick={() => router.visit("/products")}
                        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Products</span>
                    </button>

                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Product Image */}
                        <div className="bg-white rounded-xl p-8 shadow-sm">
                            <div className="aspect-square flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-6">
                            {/* Category & Gender */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-emerald-600">
                                    {product.category}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm text-gray-600 capitalize">
                                    {product.gender}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm text-gray-600 capitalize">
                                    {product.uniform_type}
                                </span>
                            </div>

                            {/* Product Name */}
                            <h1 className="text-3xl font-bold text-gray-900">
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-emerald-600">
                                    {currentPrice.toLocaleString()} MMK
                                </span>
                            </div>

                            {/* Description */}
                            {product.description && (
                                <p className="text-gray-600 leading-relaxed">
                                    {product.description}
                                </p>
                            )}

                            {/* Sizes */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Sizes
                                    </h3>
                                    
                                </div>

                                {/* Size Buttons */}
                                <div className="grid grid-cols-5 gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size.id}
                                            onClick={() =>
                                                size.is_available &&
                                                setSelectedSizeId(size.id)
                                            }
                                            disabled={!size.is_available}
                                            className={`
                                                py-3 px-4 rounded-lg border-2 font-medium text-sm transition-all
                                                ${
                                                    selectedSizeId === size.id
                                                        ? "border-black bg-black text-white"
                                                        : size.is_available
                                                        ? "border-gray-300 bg-white text-gray-900 hover:border-gray-900"
                                                        : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                                                }
                                            `}
                                        >
                                            {size.size}
                                        </button>
                                    ))}
                                </div>

                                {/* Stock Warning - Only show when selected size has < 10 stock */}
                                {selectedSize &&
                                    selectedSize.stock_quantity > 0 &&
                                    selectedSize.stock_quantity < 10 && (
                                        <div className="text-sm text-amber-600 font-medium">
                                            Only {selectedSize.stock_quantity} left in
                                            stock
                                        </div>
                                    )}

                                {/* True to size info */}
                                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                                    <Info className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            True to size.
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            We recommend ordering your usual size.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={
                                        !selectedSizeId ||
                                        !auth?.user ||
                                        !selectedSize?.is_available
                                    }
                                    className={`
                                        flex-1 flex items-center justify-center gap-2 py-4 rounded-lg text-base font-semibold transition-all
                                        ${
                                            selectedSizeId &&
                                            auth?.user &&
                                            selectedSize?.is_available
                                                ? "bg-black text-white hover:bg-gray-800"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }
                                    `}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {!auth?.user
                                        ? "Register to Add to Cart"
                                        : !selectedSizeId
                                        ? "Select a Size"
                                        : "Add to Cart"}
                                </button>

                              
                            </div>

                            {/* Product Details */}
                            <div className="border-t pt-6 space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Product Details
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">
                                            Category:
                                        </span>
                                        {product.category}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">
                                            Gender:
                                        </span>
                                        <span className="capitalize">{product.gender}</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">
                                            Type:
                                        </span>
                                        <span className="capitalize">
                                            {product.uniform_type}
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">
                                            Min Order:
                                        </span>
                                        {product.min_order_quantity} piece(s)
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
