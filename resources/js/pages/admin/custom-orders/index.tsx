import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Mail, Phone, MapPin, User, ShirtIcon, CheckCircle, XCircle, Clock } from 'lucide-react';
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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Custom Orders', href: '/admin/custom-orders' },
];

interface CustomOrder {
    id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    delivery_address: string;
    customer_type: string;
    gender: string;
    uniform_type: string;
    size_small_quantity: number;
    size_medium_quantity: number;
    size_large_quantity: number;
    notes?: string;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
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

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: any }> = {
            pending: { variant: 'outline', icon: Clock },
            processing: { variant: 'default', icon: Clock },
            completed: { variant: 'default', icon: CheckCircle },
            cancelled: { variant: 'destructive', icon: XCircle },
        };

        const config = variants[status] || variants.pending;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
                <Icon className="h-3 w-3" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            await fetch(`/admin/custom-orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            toast.success('Status updated successfully!');
            router.reload();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleViewDetails = (order: CustomOrder) => {
        setSelectedOrder(order);
        setDialogOpen(true);
    };

    const totalQuantity = (order: CustomOrder) =>
        order.size_small_quantity + order.size_medium_quantity + order.size_large_quantity;

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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {customOrders.total}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                        <p className="text-2xl font-bold text-orange-600">
                            {customOrders.data.filter(o => o.status === 'pending').length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Processing</p>
                        <p className="text-2xl font-bold text-blue-600">
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
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customOrders.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                        No custom orders found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                customOrders.data.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">#{order.id}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{order.customer_name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {order.customer_type === 'child' ? 'Student' : 'Institution'}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <p className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {order.customer_email}
                                                </p>
                                                <p className="flex items-center gap-1 mt-1">
                                                    <Phone className="h-3 w-3" />
                                                    {order.customer_phone}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <Badge variant="outline" className="mb-1">
                                                    {order.gender}
                                                </Badge>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {order.uniform_type || 'N/A'}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <p className="font-bold">{totalQuantity(order)} pcs</p>
                                                <p className="text-xs text-gray-500">
                                                    S:{order.size_small_quantity} M:{order.size_medium_quantity} L:{order.size_large_quantity}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={order.status}
                                                onValueChange={(value) => handleStatusChange(order.id, value)}
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="processing">Processing</SelectItem>
                                                    <SelectItem value="completed">Completed</SelectItem>
                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
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
                        <DialogTitle>Custom Order Details - #{selectedOrder?.id}</DialogTitle>
                        <DialogDescription>
                            Complete information about this custom order
                        </DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* Customer Info */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Customer Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Name</p>
                                        <p className="font-medium">{selectedOrder.customer_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Type</p>
                                        <p className="font-medium">
                                            {selectedOrder.customer_type === 'child' ? 'Student' : 'Institution'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Email</p>
                                        <p className="font-medium">{selectedOrder.customer_email}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Phone</p>
                                        <p className="font-medium">{selectedOrder.customer_phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Delivery Address
                                </h3>
                                <p className="text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded">
                                    {selectedOrder.delivery_address}
                                </p>
                            </div>

                            {/* Uniform Specs */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <ShirtIcon className="h-4 w-4" />
                                    Uniform Specifications
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Gender</p>
                                        <Badge variant="outline">{selectedOrder.gender}</Badge>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Uniform Type</p>
                                        <Badge variant="outline">{selectedOrder.uniform_type || 'N/A'}</Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Quantities */}
                            <div>
                                <h3 className="font-semibold mb-3">Order Quantities</h3>
                                <div className="grid grid-cols-4 gap-4 text-sm">
                                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-center">
                                        <p className="text-gray-500 text-xs">Small</p>
                                        <p className="text-xl font-bold">{selectedOrder.size_small_quantity}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-center">
                                        <p className="text-gray-500 text-xs">Medium</p>
                                        <p className="text-xl font-bold">{selectedOrder.size_medium_quantity}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-center">
                                        <p className="text-gray-500 text-xs">Large</p>
                                        <p className="text-xl font-bold">{selectedOrder.size_large_quantity}</p>
                                    </div>
                                    <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded text-center border-2 border-emerald-500">
                                        <p className="text-emerald-700 dark:text-emerald-300 text-xs">Total</p>
                                        <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                                            {totalQuantity(selectedOrder)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedOrder.notes && (
                                <div>
                                    <h3 className="font-semibold mb-3">Additional Notes</h3>
                                    <p className="text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded">
                                        {selectedOrder.notes}
                                    </p>
                                </div>
                            )}

                            {/* Status & Dates */}
                            <div className="border-t pt-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Status</p>
                                        {getStatusBadge(selectedOrder.status)}
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Order Date</p>
                                        <p className="font-medium">
                                            {new Date(selectedOrder.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
