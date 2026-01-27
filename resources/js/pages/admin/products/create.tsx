import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
}

interface Form {
    name: string;
    slug: string;
    category_id: string;
    description: string;
    base_price: string;
    stock_quantity: string;
    min_order_quantity: number;
    gender: string;
    uniform_type: string;
    is_active: boolean;
}

export default function Create({ categories }: { categories: Category[] }) {
    const [form, setForm] = useState({
        name: '',
        slug: '',
        category_id: '',
        description: '',
        base_price: '',
        stock_quantity: '',
        min_order_quantity: 1,
        gender: '',
        uniform_type: '',
        is_active: true,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        router.post('/admin/products', form);
    };

    return (
        <AppLayout>
            <Head title="Create Product" />

            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

                <form onSubmit={submit} className="space-y-5">

                    {/* Product Name */}
                    <div>
                        <Label>Product Name</Label>
                        <Input
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <Label>Category</Label>
                        <Select
                            value={form.category_id}
                            onValueChange={(value) =>
                                setForm({ ...form, category_id: value })
                            }
                        >
                            <SelectTrigger>
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
                    <div>
                        <Label>Gender</Label>
                        <Select
                            value={form.gender}
                            onValueChange={(value) =>
                                setForm({ ...form, gender: value })
                            }
                        >
                            <SelectTrigger>
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
                    <div>
                        <Label>Uniform Type</Label>
                        <Select
                            value={form.uniform_type}
                            onValueChange={(value) =>
                                setForm({ ...form, uniform_type: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select uniform type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="school">School</SelectItem>
                                <SelectItem value="college">College</SelectItem>
                                <SelectItem value="university">University</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Price */}
                    <div>
                        <Label>Base Price (MMK)</Label>
                        <Input
                            type="number"
                            value={form.base_price}
                            onChange={(e) => setForm({ ...form, base_price: e.target.value })}
                            required
                        />
                    </div>

                    {/* Stock */}
                    <div>
                        <Label>Stock Quantity</Label>
                        <Input
                            type="number"
                            value={form.stock_quantity}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setForm({ ...form, stock_quantity: e.target.value })
                            }
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <Label>Description</Label>
                        <Textarea
                            value={form.description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                setForm({ ...form, description: e.target.value })
                            }
                        />
                    </div>

                    <Button type="submit">Create Product</Button>
                </form>
            </div>
        </AppLayout>
    );
}
