import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import { Users, Search, Edit, Trash2, UserCheck, UserX, DollarSign, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedCustomers {
    data: Customer[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

type StatusModal = {
    open: boolean;
    customerId: number | null;
    customerName: string;
    currentStatus: string;
};

interface Props {
    customers: PaginatedCustomers;
    filters: Filters;
}

export default function CustomersIndex({ customers, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [sortBy, setSortBy] = useState(filters.sort_by);
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'desc');
    const [statusModal, setStatusModal] = useState<StatusModal>({
        open: false,
        customerId: null,
        customerName: '',
        currentStatus: '',
    });

    const { processing, delete: destroy } = useForm();
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const handleSearch = () => {
        router.get(
            '/admin/customers',
            {
                search: searchTerm,
                sort_by: sortBy,
                sort_order: sortOrder,
                page: 1,
            },
            { preserveState: true }
        );
    };
    

    const handleDelete = (id: number) => {
        destroy(`/admin/customers/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Customer deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete customer');
            },
        });
    };

    const openStatusModal = (id: number, name: string, currentStatus: string) => {
        setStatusModal({ open: true, customerId: id, customerName: name, currentStatus });
    };

    const handleConfirmToggleStatus = () => {
        if (statusModal.customerId === null) return;
        const newStatus = statusModal.currentStatus === 'Active' ? 'Inactive' : 'Active';
        router.post(`/admin/customers/${statusModal.customerId}/toggle-status`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Customer set to ${newStatus}`);
                setStatusModal(prev => ({ ...prev, open: false, customerId: null }));
            },
            onError: () => {
                toast.error('Failed to update status');
                setStatusModal(prev => ({ ...prev, open: false }));
            },
        });
    };

    const data = customers.data || [];
    const stats = {
        total: customers.total ?? data.length,
        totalRevenue: data.reduce((sum, c) => sum + c.total_spent, 0),
        totalOrders: data.reduce((sum, c) => sum + c.orders_count, 0),
        activeCustomers: data.filter(c => c.status === 'Active').length,
    };
    const from = (customers.current_page - 1) * customers.per_page;

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
                                <p className="text-sm text-gray-600">Active</p>
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
                        value={`${sortBy}:${sortOrder}`}
                        onChange={(e) => {
                            const [by, order] = e.target.value.split(':');
                            setSortBy(by);
                            setSortOrder(order);

                            router.get(
                                '/admin/customers',
                                {
                                    search: searchTerm,
                                    sort_by: by,
                                    sort_order: order,
                                    page: 1,
                                },
                                { preserveState: true }
                            );
                        }}
                        className="rounded-md border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="id:desc">Newest First</option>
                        <option value="id:asc">Oldest First</option>
                        <option value="name:asc">Name A–Z</option>
                        <option value="orders_count:desc">Orders: High to Low</option>
                        <option value="orders_count:asc">Orders: Low to High</option>
                    </select>

                </div>

                {/* Customers Table */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                <TableHead className="font-semibold w-14">No.</TableHead>
                                <TableHead className="font-semibold">Customer</TableHead>
                                <TableHead className="font-semibold">Contact</TableHead>
                                <TableHead className="font-semibold">Orders</TableHead>
                                <TableHead className="font-semibold">Total Spent</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold">Joined</TableHead>
                                <TableHead className="font-semibold text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                            <Users className="w-12 h-12 mb-2 opacity-50" />
                                            <p className="text-sm font-medium">No customers found</p>
                                            <p className="text-xs mt-1">
                                                {searchTerm ? 'Try adjusting your search' : 'No customers registered yet'}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((customer) => (
                                    <TableRow key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <TableCell className="text-gray-500 dark:text-gray-400">
                                            {customer.id}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                                                        {customer.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{customer.name}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-gray-900 dark:text-gray-100">{customer.email}</div>
                                            {customer.phone && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{customer.phone}</div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <ShoppingBag className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{customer.orders_count}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                                {customer.total_spent.toLocaleString()} MMK
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${customer.status === 'Active'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                                }`}>
                                                {customer.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                                            {customer.created_at}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => router.visit(`/admin/customers/${customer.id}/edit`)}
                                                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openStatusModal(customer.id, customer.name, customer.status)}
                                                    className={customer.status === 'Active' ? 'hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-400' : 'hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400'}
                                                    title={customer.status === 'Active' ? 'Set Inactive' : 'Set Active'}
                                                >
                                                    {customer.status === 'Active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                                                            title="Delete Customer"
                                                            disabled={processing}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete{" "}
                                                                <span className="font-semibold">{customer.name}</span>?
                                                                This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(customer.id)}
                                                                className="bg-red-600 text-white hover:bg-red-700"
                                                                disabled={processing}
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {customers.last_page > 1 && (
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {from + 1} to {Math.min(from + data.length, customers.total)} of {customers.total} customers
                        </p>
                        <div className="flex items-center gap-1">
                            {customers.links.map((link, i) => (
                                <span key={i}>
                                    {link.url ? (
                                        <a
                                            href={link.url}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.get(link.url!);
                                            }}
                                            className={`inline-flex items-center justify-center min-w-[2.25rem] px-2 py-1.5 text-sm rounded-md ${link.active
                                                    ? 'bg-emerald-600 text-white font-medium'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                                                }`}
                                        >
                                            {link.label.replace('&laquo; Previous', 'Prev').replace('Next &raquo;', 'Next')}
                                        </a>
                                    ) : (
                                        <span className="inline-flex items-center justify-center min-w-[2.25rem] px-2 py-1.5 text-sm text-gray-400 dark:text-gray-500">
                                            {link.label.replace('&laquo; Previous', 'Prev').replace('Next &raquo;', 'Next')}
                                        </span>
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Set Active / Inactive confirmation modal */}
            <Dialog open={statusModal.open} onOpenChange={(open) => !open && setStatusModal(prev => ({ ...prev, open: false }))}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {statusModal.currentStatus === 'Active' ? 'Set to Inactive' : 'Set to Active'}
                        </DialogTitle>
                        <DialogDescription>
                            {statusModal.currentStatus === 'Active'
                                ? `Set "${statusModal.customerName}" to Inactive? They will be marked as inactive.`
                                : `Set "${statusModal.customerName}" to Active? They will be marked as active.`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setStatusModal(prev => ({ ...prev, open: false }))}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmToggleStatus}
                            className={statusModal.currentStatus === 'Active' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'}
                        >
                            {statusModal.currentStatus === 'Active' ? 'Set Inactive' : 'Set Active'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
