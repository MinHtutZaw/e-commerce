import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, User, Mail, Phone, MapPin, Save, Package, DollarSign, ShoppingBag, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    is_active: boolean;
    created_at: string;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    payment_status?: string;
    total_amount: number;
    items_count: number;
    created_at: string;
}

interface Stats {
    total_orders: number;
    pending_orders: number;
    completed_orders: number;
    total_spent: number;
}

interface Props {
    customer: Customer;
    orders: Order[];
    stats: Stats;
}

export default function CustomerEdit({ customer, orders, stats }: Props) {
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Customers', href: '/admin/customers' },
        { title: customer.name, href: `/admin/customers/${customer.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        address: customer.address || '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/customers/${customer.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowPasswordFields(false);
                setData('password', '');
                setData('password_confirmation', '');
            },
        });
    };

    const statusConfig: Record<string, { color: string; label: string }> = {
        pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
        confirmed: { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
        processing: { color: 'bg-purple-100 text-purple-800', label: 'Processing' },
        shipped: { color: 'bg-indigo-100 text-indigo-800', label: 'Shipped' },
        delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
        cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Customer - ${customer.name}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.visit('/admin/customers')}
                            className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white shadow-sm transition-colors hover:bg-gray-50"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Customer Details</h1>
                            <p className="text-gray-600">View and edit customer information</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_orders}</p>
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
                                <p className="text-2xl font-bold text-yellow-600">{stats.pending_orders}</p>
                            </div>
                            <div className="rounded-full bg-yellow-100 p-3">
                                <ShoppingBag className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-green-600">{stats.completed_orders}</p>
                            </div>
                            <div className="rounded-full bg-green-100 p-3">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Spent</p>
                                <p className="text-2xl font-bold text-emerald-600">{stats.total_spent.toLocaleString()} MMK</p>
                            </div>
                            <div className="rounded-full bg-emerald-100 p-3">
                                <DollarSign className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Customer Info Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="rounded-lg border bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-2">
                                <User className="h-5 w-5 text-emerald-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Customer Information</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <textarea
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            rows={3}
                                            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                </div>

                                {/* Password Section */}
                                <div className="border-t pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordFields(!showPasswordFields)}
                                        className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                                    >
                                        {showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
                                    </button>

                                    {showPasswordFields && (
                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700">New Password</label>
                                                <input
                                                    type="password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    placeholder="Enter new password (min 8 characters)"
                                                />
                                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Sidebar - Account Info */}
                    <div className="lg:col-span-1">
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Account Information</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500">Customer ID</p>
                                    <p className="font-mono text-sm font-medium text-gray-900">#{customer.id}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Status</p>
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                        customer.is_active 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-amber-100 text-amber-800'
                                    }`}>
                                        {customer.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Joined Date</p>
                                    <p className="text-sm font-medium text-gray-900">{customer.created_at}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order History */}
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">Recent Orders</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b">
                                <tr>
                                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase">Order Number</th>
                                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="pb-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="py-3 text-sm font-medium text-gray-900">{order.order_number}</td>
                                        <td className="py-3 text-sm text-gray-600">{order.items_count} items</td>
                                        <td className="py-3">
                                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusConfig[order.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                                                {statusConfig[order.status]?.label || order.status}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {order.payment_status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="py-3 text-sm font-semibold text-emerald-600">{order.total_amount.toLocaleString()} MMK</td>
                                        <td className="py-3 text-sm text-gray-600">{order.created_at}</td>
                                        <td className="py-3 text-right">
                                            <button
                                                onClick={() => router.visit(`/orders/${order.id}`)}
                                                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {orders.length === 0 && (
                            <div className="py-12 text-center">
                                <Package className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">No orders yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
