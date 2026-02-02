import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye, CreditCard } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Orders', href: '/customer/orders' },
];

interface ProductSize {
    id: number;
    size: string;
    price: number;
}

interface Product {
    id: number;
    name: string;
    image?: string;
}

interface OrderItem {
    id: number;
    product: Product;
    product_size: ProductSize;
    quantity: number;
    unit_price: number;
    total_price: number;
}

interface Payment {
    id: number;
    bank: string;
    transaction_id: string;
    status: string;
    amount: number;
    created_at: string;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    payment_status?: string;
    total_amount: number;
    notes?: string;
    created_at: string;
    items: OrderItem[];
    payments: Payment[];
    user?: {
        name: string;
        email: string;
    };
}

interface Props {
    orders: Order[];
    userRole: 'customer' | 'admin';
}

export default function POSOrdersIndex({ orders, userRole }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const statusConfig = {
        pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
        confirmed: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
        processing: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Package },
        shipped: { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Truck },
        delivered: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
        cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
    };

    const paymentStatusConfig = {
        pending: { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock },
        paid: { color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle },
        failed: { color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
    };

    // Filter orders
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Calculate stats
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders - POS" />
            
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
                        <p className="text-gray-600">Track and manage all orders</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                            </div>
                            <div className="rounded-full bg-yellow-100 p-3">
                                <Clock className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Processing</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.processing}</p>
                            </div>
                            <div className="rounded-full bg-purple-100 p-3">
                                <Package className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Delivered</p>
                                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                            </div>
                            <div className="rounded-full bg-green-100 p-3">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-4 rounded-lg border bg-white p-4 shadow-sm">
                    <input
                        type="text"
                        placeholder="Search by order number or customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="rounded-md border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Orders Grid  */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredOrders.map((order) => {
                        const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Package;
                        const latestPayment = order.payments?.[order.payments.length - 1];
                        
                        return (
                            <div
                                key={order.id}
                                className="group rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md cursor-pointer"
                                onClick={() => router.visit(`/orders/${order.id}`)}
                            >
                                {/* Header */}
                                <div className="mb-3 flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <StatusIcon className="h-4 w-4 text-gray-500" />
                                            <span className="font-bold text-gray-900">{order.order_number}</span>
                                        </div>
                                        {userRole === 'admin' && order.user && (
                                            <p className="text-xs text-gray-600">{order.user.name}</p>
                                        )}
                                        <p className="text-xs text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <span className={`rounded-full border px-2 py-1 text-xs font-medium ${statusConfig[order.status as keyof typeof statusConfig]?.color}`}>
                                        {order.status}
                                    </span>
                                </div>

                                {/* Items Summary */}
                                <div className="mb-3 border-t border-gray-100 pt-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Package className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{order.items.length} item(s)</span>
                                    </div>
                                    <div className="space-y-1">
                                        {order.items.slice(0, 2).map((item) => (
                                            <div key={item.id} className="flex justify-between text-xs">
                                                <span className="text-gray-700 truncate flex-1">{item.product.name} ({item.product_size.size})</span>
                                                <span className="text-gray-500 ml-2">x{item.quantity}</span>
                                            </div>
                                        ))}
                                        {order.items.length > 2 && (
                                            <p className="text-xs text-gray-500 italic">+{order.items.length - 2} more...</p>
                                        )}
                                    </div>
                                </div>

                                {/* Payment Status */}
                                {latestPayment && (
                                    <div className="mb-3 flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-gray-400" />
                                        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${paymentStatusConfig[latestPayment.status as keyof typeof paymentStatusConfig]?.color}`}>
                                            Payment: {latestPayment.status}
                                        </span>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                                    <div className="text-lg font-bold text-emerald-600">
                                        {order.total_amount.toLocaleString()} MMK
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.visit(`/orders/${order.id}`);
                                        }}
                                        className="flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
                                    >
                                        <Eye className="h-3 w-3" />
                                        View
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredOrders.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-12">
                        <Package className="h-16 w-16 text-gray-400" />
                        <h3 className="mt-4 text-lg font-semibold text-gray-900">No orders found</h3>
                        <p className="mt-2 text-gray-600">
                            {searchTerm || filterStatus !== 'all' 
                                ? 'Try adjusting your search or filters' 
                                : 'No orders yet'}
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
