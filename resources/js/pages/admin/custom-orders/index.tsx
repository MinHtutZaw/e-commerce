import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Mail, Phone, User, ShirtIcon, CheckCircle, XCircle, Clock, Ruler } from 'lucide-react';
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
    customer_type: 'child' | 'adult';
    fabric_type: string;
    uniform_type?: string;
    notes?: string;
    waist: string;
    hip: string;
    height: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
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
        const variants: Record<string, { className: string; icon: any }> = {
            pending: { className: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Clock },
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
        router.put(`/admin/custom-orders/${orderId}/status`, { status: newStatus }, {
            preserveScroll: true,
            onSuccess: () => toast.success('Status updated successfully!'),
            onError: () => toast.error('Failed to update status'),
        });
    };

    const handleViewDetails = (order: CustomOrder) => {
        setSelectedOrder(order);
        setDialogOpen(true);
    };

    const formatPrice = (price: number) => new Intl.NumberFormat('en-US').format(price) + ' MMK';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Custom Orders" />

            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Custom Orders</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage custom uniform orders</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    {['Total', 'Pending', 'Confirmed', 'Processing', 'Completed'].map((status, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">{status}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {status === 'Total' ? customOrders.total : customOrders.data.filter(o => o.status.toLowerCase() === status.toLowerCase()).length}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Orders Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 dark:bg-gray-900/50">
                                {['ID', 'Customer', 'Contact', 'Type', 'Fabric', 'Qty', 'Total', 'Status', 'Date', 'Actions'].map(head => (
                                    <TableHead key={head} className="font-semibold">{head}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customOrders.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">No custom orders found</TableCell>
                                </TableRow>
                            ) : (
                                customOrders.data.map((order) => (
                                    <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <TableCell className="font-medium">#{order.id}</TableCell>
                                        <TableCell>
                                            <p className="font-medium">{order.user?.name || 'N/A'}</p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm space-y-1">
                                                <p className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3 text-gray-400" />
                                                    <span className="truncate max-w-24">{order.user?.email || 'N/A'}</span>
                                                </p>
                                                <p className="flex items-center gap-1">
                                                    <Phone className="h-3 w-3 text-gray-400" />
                                                    {order.user?.phone || 'N/A'}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">{order.customer_type}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">{order.fabric_type}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-emerald-600">{order.quantity}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium text-emerald-600">{formatPrice(order.total_price)}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                            order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                                                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button size="sm" variant="outline" onClick={() => handleViewDetails(order)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                {order.status === 'pending' && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-purple-600 hover:bg-purple-700 text-white"
                                                        onClick={() => handleStatusChange(order.id, 'confirmed')}
                                                    >
                                                        Confirm
                                                    </Button>
                                                )}
                                                {order.status === 'confirmed' && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-orange-600 hover:bg-orange-700 text-white"
                                                        onClick={() => handleStatusChange(order.id, 'processing')}
                                                    >
                                                        Process
                                                    </Button>
                                                )}
                                                {order.status === 'processing' && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                        onClick={() => handleStatusChange(order.id, 'completed')}
                                                    >
                                                        Complete
                                                    </Button>
                                                )}
                                            </div>
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
                        <DialogDescription>Complete information about this custom order</DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* Status & Date */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Current Status</p>
                                    {getStatusBadge(selectedOrder.status)}
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Order Date</p>
                                    <p className="font-medium">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <User className="h-4 w-4" /> Customer Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><p className="text-gray-500">Name</p><p className="font-medium">{selectedOrder.user?.name || 'N/A'}</p></div>
                                    <div><p className="text-gray-500">Email</p><p className="font-medium">{selectedOrder.user?.email || 'N/A'}</p></div>
                                    <div><p className="text-gray-500">Phone</p><p className="font-medium">{selectedOrder.user?.phone || 'N/A'}</p></div>
                                    {selectedOrder.user?.address && <div><p className="text-gray-500">Address</p><p className="font-medium">{selectedOrder.user.address}</p></div>}
                                </div>
                            </div>

                            {/* Order Specifications */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <ShirtIcon className="h-4 w-4" /> Order Specifications
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Customer Type</p>
                                        <Badge variant="outline" className="capitalize">{selectedOrder.customer_type}</Badge>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Fabric Type</p>
                                        <p className="font-medium">{selectedOrder.fabric_type}</p>
                                    </div>
                                    {selectedOrder.uniform_type && (
                                        <div>
                                            <p className="text-gray-500">Uniform Type</p>
                                            <p className="font-medium">{selectedOrder.uniform_type}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-gray-500">Quantity</p>
                                        <p className="font-bold text-emerald-600">{selectedOrder.quantity} pcs</p>
                                    </div>
                                </div>
                            </div>

                            {/* Measurements */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Ruler className="h-4 w-4" /> Measurements (cm)
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-center">
                                        <p className="text-gray-500 text-xs">Waist</p>
                                        <p className="text-xl font-bold">{selectedOrder.waist || '—'}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-center">
                                        <p className="text-gray-500 text-xs">Hip</p>
                                        <p className="text-xl font-bold">{selectedOrder.hip || '—'}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-center">
                                        <p className="text-gray-500 text-xs">Height</p>
                                        <p className="text-xl font-bold">{selectedOrder.height || '—'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Price Info */}
                            <div className="border rounded-lg p-4 bg-emerald-50 dark:bg-emerald-950/30">
                                <h3 className="font-semibold mb-3">Price Details</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Unit Price:</span>
                                        <span>{formatPrice(selectedOrder.unit_price)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Quantity:</span>
                                        <span>x {selectedOrder.quantity}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 font-semibold text-lg">
                                        <span>Total:</span>
                                        <span className="text-emerald-600">{formatPrice(selectedOrder.total_price)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedOrder.notes && (
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-semibold mb-2">Notes</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedOrder.notes}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-3">Actions</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedOrder.status === 'pending' && (
                                        <Button
                                            onClick={() => {
                                                handleStatusChange(selectedOrder.id, 'confirmed');
                                                setDialogOpen(false);
                                            }}
                                            className="bg-purple-600 hover:bg-purple-700"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Confirm Order
                                        </Button>
                                    )}
                                    {selectedOrder.status === 'confirmed' && (
                                        <Button
                                            onClick={() => {
                                                handleStatusChange(selectedOrder.id, 'processing');
                                                setDialogOpen(false);
                                            }}
                                            className="bg-orange-600 hover:bg-orange-700"
                                        >
                                            <Clock className="h-4 w-4 mr-2" />
                                            Start Processing
                                        </Button>
                                    )}
                                    {selectedOrder.status === 'processing' && (
                                        <Button
                                            onClick={() => {
                                                handleStatusChange(selectedOrder.id, 'completed');
                                                setDialogOpen(false);
                                            }}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Mark Completed
                                        </Button>
                                    )}
                                    {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'completed' && (
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                handleStatusChange(selectedOrder.id, 'cancelled');
                                                setDialogOpen(false);
                                            }}
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Cancel Order
                                        </Button>
                                    )}
                                    {(selectedOrder.status === 'completed' || selectedOrder.status === 'cancelled') && (
                                        <p className="text-sm text-gray-500 italic">
                                            This order is {selectedOrder.status}. No further actions available.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
