import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, Plus, Trash2, Edit2, Check, X, User, Shirt } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pricing', href: '/admin/pricing' },
];

interface Pricing {
    id: number;
    type: 'base' | 'fabric';
    name: string;
    price: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    pricing: Pricing[];
}

export default function PricingIndex({ pricing }: Props) {
    

    //
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editPrice, setEditPrice] = useState<string>('');
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);    

    useEffect(() => {
        if (editingId !== null && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select(); // optional: selects the text automatically
        }
    }, [editingId]);

    const { data, setData, post, processing, reset } = useForm({
        type: 'fabric' as 'base' | 'fabric',
        name: '',
        price: '',
    });

    const basePricing = pricing.filter(p => p.type === 'base');
    const fabricPricing = pricing.filter(p => p.type === 'fabric');

    const handleEdit = (item: Pricing) => {
        setEditingId(item.id);
        setEditPrice(item.price.toString());
    };


    const handleSave = (id: number) => {
        router.put(`/admin/pricing/${id}`, { price: parseInt(editPrice) }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Price updated successfully!');
                setEditingId(null);
            },
            onError: () => toast.error('Failed to update price'),
        });
    };

    const handleToggleActive = (item: Pricing) => {
        router.put(`/admin/pricing/${item.id}`, { price: item.price, is_active: !item.is_active }, {
            preserveScroll: true,
            onSuccess: () => toast.success(`${item.name} ${item.is_active ? 'deactivated' : 'activated'}`),
            onError: () => toast.error('Failed to update status'),
        });
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/pricing', {
            onSuccess: () => {
                toast.success('Pricing option added!');
                reset();
                setAddDialogOpen(false);
            },
            onError: () => toast.error('Failed to add pricing option'),
        });
    };

    const handleDelete = () => {
        if (!deleteId) return;
        router.delete(`/admin/pricing/${deleteId}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Pricing option deleted!');
                setDeleteId(null);
            },
            onError: () => toast.error('Failed to delete pricing option'),
        });
    };

    const formatPrice = (price: number) => new Intl.NumberFormat('en-US').format(price) + ' MMK';

    const PricingTable = ({ items, title, icon: Icon }: { items: Pricing[], title: string, icon: any }) => (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <Icon className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-semibold">{title}</h2>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                No pricing options found
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium capitalize">{item.name}</TableCell>
                                <TableCell>
                                    {editingId === item.id ? (
                                        <Input
                                            type="number"
                                            value={editPrice}
                                            ref={inputRef}
                                            onChange={(e) => setEditPrice(e.target.value)}
                                            className="w-32"
                                        />
                                    ) : (
                                        <span className="font-semibold text-emerald-600">{formatPrice(item.price)}</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={item.is_active
                                            ? 'bg-green-100 text-green-800 border-green-300'
                                            : 'bg-gray-100 text-gray-800 border-gray-300'
                                        }
                                    >
                                        {item.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {editingId === item.id ? (
                                            <>
                                                <Button size="sm" onClick={() => handleSave(item.id)} className="bg-green-600 hover:bg-green-700">
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={item.is_active ? 'secondary' : 'default'}
                                                    onClick={() => handleToggleActive(item)}
                                                >
                                                    {item.is_active ? 'Deactivate' : 'Activate'}
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => setDeleteId(item.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pricing Management" />

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pricing Management</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage custom order pricing</p>
                    </div>
                    <Button onClick={() => setAddDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Pricing
                    </Button>
                </div>

                {/* Base Pricing */}
                <PricingTable items={basePricing} title="Base Prices (Customer Type)" icon={User} />

                {/* Fabric Pricing */}
                <PricingTable items={fabricPricing} title="Fabric Prices" icon={Shirt} />

                {/* Price Preview */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                        Price Preview (Example)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {basePricing.filter(b => b.is_active).map(base => (
                            <div key={base.id} className="border rounded-lg p-4">
                                <h3 className="font-medium capitalize mb-2">{base.name} Customer</h3>
                                <div className="space-y-1 text-sm">
                                    {fabricPricing.filter(f => f.is_active).map(fabric => (
                                        <div key={fabric.id} className="flex justify-between">
                                            <span className="text-gray-500">+ {fabric.name}:</span>
                                            <span className="font-medium">{formatPrice(base.price + fabric.price)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add Dialog */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Pricing Option</DialogTitle>
                        <DialogDescription>Add a new base or fabric pricing option</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={data.type} onValueChange={(v: 'base' | 'fabric') => setData('type', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="base">Base (Customer Type)</SelectItem>
                                    <SelectItem value="fabric">Fabric</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder={data.type === 'base' ? 'e.g., senior' : 'e.g., Silk'}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Price (MMK)</Label>
                            <Input
                                type="number"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                placeholder="0"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700">
                                Add Pricing
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Pricing Option?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the pricing option.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
