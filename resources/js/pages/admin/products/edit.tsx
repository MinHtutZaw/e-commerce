import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BadgeAlert } from 'lucide-react';
import { useState, useEffect } from 'react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Products', href: '/admin/products' },
    { title: 'Edit Product', href: '#' },
];

interface Category {
    id: number;
    name: string;
}

interface ProductSize {
    id?: number;
    size: string;
    price: string;
    stock_quantity: string;
    is_available: boolean;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    category_id: number;
    description: string | null;
    gender: string | null;
    uniform_type: string | null;
    image: string | null;
    is_active: boolean;
    sizes: Array<{
        id: number;
        size: string;
        price: number;
        stock_quantity: number;
        is_available: boolean;
    }>;
}

interface PageProps {
    product: Product;
    categories: Category[];
    errors: Record<string, string>;
    [key: string]: unknown;
}

export default function Edit() {
    const { product, categories, errors } = usePage<PageProps>().props;
    const [processing, setProcessing] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(product.image || null);

    const [form, setForm] = useState({
        name: product.name || '',
        slug: product.slug || '',
        category_id: String(product.category_id) || '',
        description: product.description || '',

        gender: product.gender || '',
        uniform_type: product.uniform_type || '',
        image: null as File | null,
        is_active: product.is_active ?? true,
        sizes: product.sizes.map(size => ({
            id: size.id,
            size: size.size,
            price: String(size.price),
            stock_quantity: String(size.stock_quantity),
            is_available: size.is_available,
        })) as ProductSize[],
    });

    const [initialForm] = useState(() =>
        JSON.stringify({
            name: product.name || '',
            slug: product.slug || '',
            category_id: String(product.category_id) || '',
            description: product.description || '',
            gender: product.gender || '',
            uniform_type: product.uniform_type || '',
            is_active: product.is_active ?? true,
            sizes: product.sizes.map(size => ({
                id: size.id,
                size: size.size,
                price: String(size.price),
                stock_quantity: String(size.stock_quantity),
                is_available: size.is_available,
            })),
        })
    );
    const isChanged =
        JSON.stringify({
            name: form.name,
            slug: form.slug,
            category_id: form.category_id,
            description: form.description,
            gender: form.gender,
            uniform_type: form.uniform_type,
            is_active: form.is_active,
            sizes: form.sizes,
        }) !== initialForm || !!form.image;





    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm({ ...form, image: file });

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setForm({ ...form, image: null });
        setImagePreview(product.image || null);
    };

    const addSize = () => {
        setForm({
            ...form,
            sizes: [...form.sizes, { size: '', price: '', stock_quantity: '0', is_available: true }],
        });
    };

    const removeSize = (index: number) => {
        const newSizes = form.sizes.filter((_, i) => i !== index);
        setForm({ ...form, sizes: newSizes });
    };

    const updateSize = (index: number, field: keyof ProductSize, value: string | boolean) => {
        const newSizes = [...form.sizes];
        newSizes[index] = { ...newSizes[index], [field]: value };
        setForm({ ...form, sizes: newSizes });
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', form.name);
        formData.append('category_id', form.category_id);
        formData.append('description', form.description);

        formData.append('gender', form.gender);
        formData.append('uniform_type', form.uniform_type);
        if (form.image) formData.append('image', form.image);
        formData.append('is_active', form.is_active ? '1' : '0');

        // Append sizes
        form.sizes.forEach((size, index) => {
            if (size.id) formData.append(`sizes[${index}][id]`, String(size.id));
            formData.append(`sizes[${index}][size]`, size.size);
            formData.append(`sizes[${index}][price]`, size.price);
            formData.append(`sizes[${index}][stock_quantity]`, size.stock_quantity);
            formData.append(`sizes[${index}][is_available]`, size.is_available ? '1' : '0');
        });

        router.post(`/admin/products/${product.id}`, formData, {
            onFinish: () => setProcessing(false),
        });
    };

    const hasErrors = Object.keys(errors || {}).length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Product" />

            <div className="m-4 p-4">
                <h1 className="text-xl font-semibold mb-6 flex justify-center text-gray-900 dark:text-gray-100">
                    Edit Product
                </h1>

                <div className="flex justify-center">
                    <form onSubmit={submit} className="space-y-6 max-w-2xl w-full">
                        {/* Error Alert */}
                        {hasErrors && (
                            <Alert variant="destructive" className="border-2 border-red-500 bg-red-50 dark:bg-red-950">
                                <BadgeAlert className="h-5 w-5 text-red-600 dark:text-red-400" />
                                <AlertTitle className="text-red-800 dark:text-red-200 font-bold">
                                    Please fix the following errors:
                                </AlertTitle>
                                <AlertDescription>
                                    <ul className="list-disc list-inside space-y-1 mt-2">
                                        {Object.entries(errors || {}).map(([key, message]) => (
                                            <li key={key} className="text-red-700 dark:text-red-300 font-medium">
                                                {message}
                                            </li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Product Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Product Name</Label>
                                <Input
                                    id="name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">Category</Label>
                                <Select
                                    value={form.category_id}
                                    onValueChange={(value) =>
                                        setForm({ ...form, category_id: value })
                                    }
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Gender */}
                            <div className="space-y-2">
                                <Label htmlFor="gender" className="text-gray-700 dark:text-gray-300">Gender</Label>
                                <Select
                                    value={form.gender}
                                    onValueChange={(value) =>
                                        setForm({ ...form, gender: value })
                                    }
                                >
                                    <SelectTrigger id="gender">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="unisex">Unisex</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Uniform Type */}
                            <div className="space-y-2">
                                <Label htmlFor="uniform_type" className="text-gray-700 dark:text-gray-300">Uniform Type</Label>
                                <Select
                                    value={form.uniform_type}
                                    onValueChange={(value) =>
                                        setForm({ ...form, uniform_type: value })
                                    }
                                >
                                    <SelectTrigger id="uniform_type">
                                        <SelectValue placeholder="Select uniform type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="school">School</SelectItem>
                                        <SelectItem value="college">College</SelectItem>
                                        <SelectItem value="university">University</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>


                        </div>

                        {/* Product Sizes Section */}
                        <div className="space-y-4 border-t pt-6">
                            <div className="flex items-center justify-between">
                                <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">Product Sizes & Pricing</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addSize}
                                    className="text-emerald-600 hover:text-emerald-700"
                                >
                                    + Add Size
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {form.sizes.map((size, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                                        <div className="space-y-1">
                                            <Label className="text-xs">Size</Label>
                                            <Input
                                                value={size.size}
                                                onChange={(e) => updateSize(index, 'size', e.target.value)}
                                                placeholder="e.g. S, M, L"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Price (MMK)</Label>
                                            <Input
                                                type="number"
                                                value={size.price}
                                                onChange={(e) => updateSize(index, 'price', e.target.value)}
                                                placeholder="Price"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Stock</Label>
                                            <Input
                                                type="number"
                                                value={size.stock_quantity}
                                                onChange={(e) => updateSize(index, 'stock_quantity', e.target.value)}
                                                placeholder="Stock"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1 flex items-end">
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={size.is_available}
                                                    onChange={(e) => updateSize(index, 'is_available', e.target.checked)}
                                                    className="rounded border-gray-300"
                                                />
                                                <span className="text-xs text-gray-700 dark:text-gray-300">Available</span>
                                            </label>
                                        </div>
                                        <div className="flex items-end">
                                            {form.sizes.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeSize(index)}
                                                    className="w-full text-red-600 hover:text-red-700"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description - Full Width */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Description</Label>
                            <Textarea
                                id="description"
                                value={form.description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    setForm({ ...form, description: e.target.value })
                                }
                                placeholder="Enter product description"
                                rows={4}
                                
                            />
                        </div>

                        {/* Image Upload - Full Width */}
                        <div className="space-y-2">
                            <Label htmlFor="image" className="text-gray-700 dark:text-gray-300">Product Image</Label>
                            <div className="flex flex-col gap-4">
                                {/* File Input */}
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="flex-1"
                                    />
                                    {imagePreview && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={removeImage}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>

                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="relative w-full max-w-xs">
                                        <div className="rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                                            <img
                                                src={imagePreview}
                                                alt="Product preview"
                                                className="w-full h-48 object-cover"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {form.image ? 'New image preview' : 'Current product image'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                            
                        {!isChanged && !processing && (
                            <p className="text-sm text-red-500 text-center">
                                Make a change to enable update
                            </p>
                        )}
                        {/* Submit Button */}
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit('/admin/products')}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || !isChanged}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Updating...
                                    </span>
                                ) : (
                                    'Update Product'
                                )}
                            </Button>

                        </div>
                        
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
