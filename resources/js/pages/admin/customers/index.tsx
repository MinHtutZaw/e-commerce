import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Users, Search, Edit, Trash2, UserCheck, UserX, DollarSign, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Customers', href: '/admin/customers' },
];

interface Customer {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    orders_count: number;
    total_spent: number;
    created_at: string;
    status: string;
}

interface Filters {
    search?: string;
    sort_by: string;
    sort_order: string;
}

interface Props {
    customers: Customer[];
    filters: Filters;
}

export default function CustomersIndex({ customers, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [sortBy, setSortBy] = useState(filters.sort_by);

    const handleSearch = () => {
        router.get('/admin/customers', { search: searchTerm, sort_by: sortBy }, { preserveState: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete customer "${name}"? This action cannot be undone.`)) {
            router.delete(`/admin/customers/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const handleToggleStatus = (id: number, currentStatus: string) => {
        const action = currentStatus === 'Active' ? 'deactivate' : 'activate';
        if (confirm(`Are you sure you want to ${action} this customer?`)) {
            router.post(`/admin/customers/${id}/toggle-status`, {}, {
                preserveScroll: true,
            });
        }
    };

    const stats = {
        total: customers.length,
        totalRevenue: customers.reduce((sum, c) => sum + c.total_spent, 0),
        totalOrders: customers.reduce((sum, c) => sum + c.orders_count, 0),
        activeCustomers: customers.filter(c => c.status === 'Active').length,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />
            
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
                        <p className="text-gray-600">Manage all customers and their information</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Customers</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Customers</p>
                                <p className="text-2xl font-bold text-green-600">{stats.activeCustomers}</p>
                            </div>
                            <div className="rounded-full bg-green-100 p-3">
                                <UserCheck className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Orders</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.totalOrders}</p>
                            </div>
                            <div className="rounded-full bg-purple-100 p-3">
                                <ShoppingBag className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-emerald-600">{stats.totalRevenue.toLocaleString()} MMK</p>
                            </div>
                            <div className="rounded-full bg-emerald-100 p-3">
                                <DollarSign className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4 rounded-lg border bg-white p-4 shadow-sm">
                    <div className="flex flex-1 gap-2">
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                            onClick={handleSearch}
                            className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 flex items-center gap-2"
                        >
                            <Search className="h-4 w-4" />
                            Search
                        </button>
                    </div>
                    <select
                        value={sortBy}
                        onChange={(e) => {
                            setSortBy(e.target.value);
                            router.get('/admin/customers', { search: searchTerm, sort_by: e.target.value }, { preserveState: true });
                        }}
                        className="rounded-md border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="created_at">Newest First</option>
                        <option value="name">Name A-Z</option>
                        <option value="orders_count">Most Orders</option>
                    </select>
                </div>

                {/* Customers Table */}
                <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                    <span className="text-emerald-600 font-semibold text-sm">
                                                        {customer.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{customer.email}</div>
                                        {customer.phone && (
                                            <div className="text-sm text-gray-500">{customer.phone}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1">
                                            <ShoppingBag className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-900">{customer.orders_count}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-emerald-600">
                                            {customer.total_spent.toLocaleString()} MMK
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                            customer.status === 'Active' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {customer.created_at}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => router.visit(`/admin/customers/${customer.id}/edit`)}
                                                className="text-emerald-600 hover:text-emerald-900"
                                                title="Edit Customer"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(customer.id, customer.status)}
                                                className={customer.status === 'Active' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}
                                                title={customer.status === 'Active' ? 'Deactivate' : 'Activate'}
                                            >
                                                {customer.status === 'Active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(customer.id, customer.name)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Delete Customer"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State */}
                    {customers.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Users className="h-16 w-16 text-gray-400" />
                            <h3 className="mt-4 text-lg font-semibold text-gray-900">No customers found</h3>
                            <p className="mt-2 text-gray-600">
                                {searchTerm ? 'Try adjusting your search' : 'No customers registered yet'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
