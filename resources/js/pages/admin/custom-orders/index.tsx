import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Mail, Phone, User, ShirtIcon, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Custom Orders', href: '/admin/custom-orders' },
];

interface CustomOrderSize {
    id: number;
    size: string;
    quantity: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
}

interface CustomOrder {
    id: number;
    user_id?: number;
    user?: User;
    customer_type: string;
    gender: string;
    uniform_type: string;
    notes?: string;
    status: 'pending' | 'quoted' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
    quoted_price?: number;
    sizes: CustomOrderSize[];
    total_quantity?: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    customOrders: {
        data: CustomOrder[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function Index({ customOrders }: Props) {
    const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [quotePrice, setQuotePrice] = useState('');
    const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { className: string; icon: any }> = {
            pending: { className: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Clock },
            quoted: { className: 'bg-blue-100 text-blue-800 border-blue-300', icon: DollarSign },
            confirmed: { className: 'bg-purple-100 text-purple-800 border-purple-300', icon: CheckCircle },
            processing: { className: 'bg-orange-100 text-orange-800 border-orange-300', icon: Clock },
            completed: { className: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle },
            cancelled: { className: 'bg-red-100 text-red-800 border-red-300', icon: XCircle },
        };

        const config = variants[status] || variants.pending;
        const Icon = config.icon;

        return (
            <Badge variant="outline" className={`flex items-center gap-1 w-fit ${config.className}`}>
                <Icon className="h-3 w-3" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const handleStatusChange = (orderId: number, newStatus: string) => {
        router.put(`/admin/custom-orders/${orderId}/status`, {
            status: newStatus,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Status updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update status');
            },
        });
    };

    const handleQuoteSubmit = () => {
        if (!selectedOrder || !quotePrice) return;
        
        setIsSubmittingQuote(true);
        router.put(`/admin/custom-orders/${selectedOrder.id}/quote`, {
            quoted_price: parseFloat(quotePrice),
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Quote submitted successfully!');
                setQuotePrice('');
                setDialogOpen(false);
                setIsSubmittingQuote(false);
            },
            onError: () => {
                toast.error('Failed to submit quote');
                setIsSubmittingQuote(false);
            },
        });
    };

    const handleViewDetails = (order: CustomOrder) => {
        setSelectedOrder(order);
        setQuotePrice(order.quoted_price?.toString() || '');
        setDialogOpen(true);
    };

    const getTotalQuantity = (order: CustomOrder) => {
        if (order.total_quantity !== undefined) return order.total_quantity;
        return order.sizes?.reduce((sum, s) => sum + s.quantity, 0) || 0;
    };

    const getSizesSummary = (order: CustomOrder) => {
        if (!order.sizes || order.sizes.length === 0) return 'No sizes';
        return order.sizes.map(s => `${s.size}:${s.quantity}`).join(' ');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Custom Orders" />

            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Custom Orders
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Manage bulk uniform custom orders
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {customOrders.total}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">
                            {customOrders.data.filter(o => o.status === 'pending').length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Quoted</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {customOrders.data.filter(o => o.status === 'quoted').length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Processing</p>
                        <p className="text-2xl font-bold text-orange-600">
                            {customOrders.data.filter(o => o.status === 'processing').length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                        <p className="text-2xl font-bold text-green-600">
                            {customOrders.data.filter(o => o.status === 'completed').length}
                        </p>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 dark:bg-gray-900/50">
                                <TableHead className="font-semibold">ID</TableHead>
                                <TableHead className="font-semibold">Customer</TableHead>
                                <TableHead className="font-semibold">Contact</TableHead>
                                <TableHead className="font-semibold">Type</TableHead>
                                <TableHead className="font-semibold">Sizes</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold">Quote</TableHead>
                                <TableHead className="font-semibold">Date</TableHead>
                                <TableHead className="font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customOrders.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                                        No custom orders found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                customOrders.data.map((order) => (
                                    <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <TableCell className="font-medium">#{order.id}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{order.user?.name || 'N/A'}</p>
                                                <p className="text-xs text-gray-500 capitalize">
                                                    {order.customer_type}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm space-y-1">
                                                <p className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3 text-gray-400" />
                                                    <span className="truncate max-w-32">{order.user?.email || 'N/A'}</span>
                                                </p>
                                                <p className="flex items-center gap-1">
                                                    <Phone className="h-3 w-3 text-gray-400" />
                                                    {order.user?.phone || 'N/A'}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <Badge variant="outline" className="mb-1 capitalize">
                                                    {order.gender}
                                                </Badge>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {order.uniform_type || 'N/A'}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <p className="font-bold text-emerald-600">{getTotalQuantity(order)} pcs</p>
                                                <p className="text-xs text-gray-500">
                                                    {getSizesSummary(order)}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={order.status}
                                                onValueChange={(value) => handleStatusChange(order.id, value)}
                                            >
                                                <SelectTrigger className="w-32 h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="quoted">Quoted</SelectItem>
                                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                                    <SelectItem value="processing">Processing</SelectItem>
                                                    <SelectItem value="completed">Completed</SelectItem>
                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            {order.quoted_price ? (
                                                <span className="font-medium text-emerald-600">
                                                    {Number(order.quoted_price).toLocaleString()} MMK
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-sm">Not set</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleViewDetails(order)}
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {customOrders.last_page > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        {Array.from({ length: customOrders.last_page }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={page === customOrders.current_page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => router.get(`/admin/custom-orders?page=${page}`)}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Details Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Custom Order #{selectedOrder?.id}</DialogTitle>
                        <DialogDescription>
                            Complete information about this custom order
                        </DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* Status */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Current Status</p>
                                    {getStatusBadge(selectedOrder.status)}
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Order Date</p>
                                    <p className="font-medium">
                                        {new Date(selectedOrder.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Customer Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Name</p>
                                        <p className="font-medium">{selectedOrder.user?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Type</p>
                                        <p className="font-medium capitalize">{selectedOrder.customer_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Email</p>
                                        <p className="font-medium">{selectedOrder.user?.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Phone</p>
                                        <p className="font-medium">{selectedOrder.user?.phone || 'N/A'}</p>
                                    </div>
                                    {selectedOrder.user?.address && (
                                        <div className="col-span-2">
                                            <p className="text-gray-500">Address</p>
                                            <p className="font-medium">{selectedOrder.user.address}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Uniform Specs */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <ShirtIcon className="h-4 w-4" />
                                    Uniform Specifications
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Gender</p>
                                        <Badge variant="outline" className="capitalize">{selectedOrder.gender}</Badge>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Uniform Type</p>
                                        <Badge variant="outline">{selectedOrder.uniform_type || 'N/A'}</Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Sizes */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold mb-3">Order Quantities</h3>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {selectedOrder.sizes && selectedOrder.sizes.map((size) => (
                                        <div key={size.id} className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-center">
                                            <p className="text-gray-500 text-xs">{size.size}</p>
                                            <p className="text-xl font-bold">{size.quantity}</p>
                                        </div>
                                    ))}
                                    <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded text-center border-2 border-emerald-500">
                                        <p className="text-emerald-700 dark:text-emerald-300 text-xs">Total</p>
                                        <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                                            {getTotalQuantity(selectedOrder)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedOrder.notes && (
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-semibold mb-3">Additional Notes</h3>
                                    <p className="text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded">
                                        {selectedOrder.notes}
                                    </p>
                                </div>
                            )}

                            {/* Quote Section */}
                            <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950/30">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    Price Quote
                                </h3>
                                <div className="flex gap-3 items-end">
                                    <div className="flex-1">
                                        <Label htmlFor="quote">Quote Amount (MMK)</Label>
                                        <Input
                                            id="quote"
                                            type="number"
                                            value={quotePrice}
                                            onChange={(e) => setQuotePrice(e.target.value)}
                                            placeholder="Enter price quote"
                                            className="mt-1"
                                        />
                                    </div>
                                    <Button 
                                        onClick={handleQuoteSubmit}
                                        disabled={!quotePrice || isSubmittingQuote}
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        {isSubmittingQuote ? 'Saving...' : 'Save Quote'}
                                    </Button>
                                </div>
                                {selectedOrder.quoted_price && (
                                    <p className="mt-2 text-sm text-gray-600">
                                        Current quote: <span className="font-bold text-emerald-600">{Number(selectedOrder.quoted_price).toLocaleString()} MMK</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
