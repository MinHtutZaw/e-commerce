import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, SquarePen, Plus, Package, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

interface Category {
    id: number;
    name: string;
}

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
    category?: Category;
    description: string | null;
    image: string | null;
    is_active: boolean;
    min_order_quantity: number;
    gender: 'male' | 'female' | 'unisex';
    uniform_type: 'school' | 'college' | 'university' | 'other';
    sizes: ProductSize[];
}

interface PageProps {
    products: {
        data: Product[];
    };
    flash?: {
        message?: string;
        error?: string;
    };
    [key: string]: unknown;
}

export default function Index() {
    const { products, flash } = usePage<PageProps>().props;
    // Drawer state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [categoryForm, setCategoryForm] = useState({
        name: '',
        description: '',
        image: null as File | null,
        is_active: true,
    });

    // Show flash messages
    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            router.delete(`/admin/products/${id}`, {
                preserveScroll: true,
            });
        }
    };
    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', categoryForm.name);
        formData.append('description', categoryForm.description);
        if (categoryForm.image) formData.append('image', categoryForm.image);
        formData.append('is_active', categoryForm.is_active ? '1' : '0');

        router.post('/admin/categories', formData, {
            onSuccess: () => {
                setIsDrawerOpen(false);
                setCategoryForm({ name: '', description: '', image: null, is_active: true });
            }
        });
    };
    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
    };
    

    return (
        <AppLayout>
            <Head title="Products Management" />

            {/* Header */}
            <div className="m-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Products</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Manage your product catalog
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/admin/products/create">
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add Product
                            </Button>
                        </Link>
                        <Button onClick={() => setIsDrawerOpen(true)} className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Category
                        </Button>
                    </div>

                    {/* Drawer for Adding Category */}
                    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                        {/* Optional: DrawerTrigger if you want a button inside Drawer itself */}
                        <DrawerContent className="h-screen w-full max-w-full sm:max-w-full">

                            <DrawerHeader>
                                <DrawerTitle>Add New Category</DrawerTitle>
                                <DrawerDescription>
                                    Fill out the form below to create a new category.
                                </DrawerDescription>
                            </DrawerHeader>

                            <form onSubmit={handleCategorySubmit}>
                                <div className="space-y-4 px-4">
                                    {/* Name Field */}
                                    <div>
                                        <label
                                            htmlFor="category-name"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                            Name
                                        </label>
                                        <input
                                            id="category-name"
                                            type="text"
                                            name="name"
                                            value={categoryForm.name}
                                            onChange={handleCategoryChange}
                                            required
                                            className="block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 sm:text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:bg-gray-900 dark:text-gray-100"
                                        />
                                    </div>

                                    {/* Description Field */}
                                    <div>
                                        <label
                                            htmlFor="category-description"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                            Description
                                        </label>
                                        <textarea
                                            id="category-description"
                                            name="description"
                                            value={categoryForm.description}
                                            onChange={handleCategoryChange}
                                            className="block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 sm:text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:bg-gray-900 dark:text-gray-100"
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                <DrawerFooter className="flex justify-end px-4 py-3">
                                    <Button type="submit">Save Category</Button>
                                </DrawerFooter>
                            </form>
                        </DrawerContent>
                    </Drawer>

                </div>
            </div>

            {/* Products Table */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                            <TableHead className="font-semibold">Product</TableHead>
                            <TableHead className="font-semibold">Category</TableHead>
                            <TableHead className="font-semibold">Price</TableHead>
                            <TableHead className="font-semibold">Stock</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Attributes</TableHead>

                            <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                        <Package className="w-12 h-12 mb-2 opacity-50" />
                                        <p className="text-sm font-medium">No products found</p>
                                        <p className="text-xs mt-1">Get started by adding your first product</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.data.map((product) => (
                                <TableRow key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <ImageIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                    {product.name}
                                                </p>
                                                {product.description && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                        {product.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            {product.category?.name || 'Uncategorized'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {product.sizes && product.sizes.length > 0 ? (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    From {Math.min(...product.sizes.map(s => s.price)).toLocaleString()} MMK
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {product.sizes.length} size{product.sizes.length !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-500 dark:text-gray-400">No sizes</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {product.sizes && product.sizes.length > 0 ? (
                                            <div className="flex items-center gap-1">
                                                {(() => {
                                                    const totalStock = product.sizes.reduce((sum, size) => sum + size.stock_quantity, 0);
                                                    return (
                                                        <>
                                                            <span className={`text-sm font-medium ${totalStock > 10
                                                                ? 'text-green-600 dark:text-green-400'
                                                                : totalStock > 0
                                                                    ? 'text-amber-600 dark:text-amber-400'
                                                                    : 'text-red-600 dark:text-red-400'
                                                                }`}>
                                                                {totalStock}
                                                            </span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">units</span>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-500 dark:text-gray-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={product.is_active ? "default" : "secondary"}
                                                className={product.is_active
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                                }
                                            >
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </Badge>

                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {product.gender && (
                                                <Badge variant="outline" className="text-xs capitalize">
                                                    {product.gender}
                                                </Badge>
                                            )}

                                            {product.uniform_type && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs capitalize border-emerald-300 text-emerald-700
                           dark:border-emerald-700 dark:text-emerald-400"
                                                >
                                                    {product.uniform_type}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/products/${product.id}/edit`}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                                                >
                                                    <SquarePen className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(product.id)}
                                                className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
