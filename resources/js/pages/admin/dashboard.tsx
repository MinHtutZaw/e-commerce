import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Package, Users, ShoppingBag, Clock, DollarSign, CreditCard } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Props {
    userRole: 'customer' | 'admin';
    stats: {
        totalOrders?: number;
        pendingOrders?: number;
        totalUsers?: number;
        totalProducts?: number;
        pendingPayments?: number;
        totalRevenue?: number;
        totalSpent?: number;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: any;
}

export default function Dashboard({ userRole, stats }: Props) {
    const { flash } = usePage<Props>().props;

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, {
                duration: 3000,
            });
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);
    const getDashboardContent = () => {
        if (userRole === 'admin') {
            // Admin Dashboard
            return (
                <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalOrders || 0}</p>
                            </div>
                            <div className="rounded-full bg-emerald-100 p-3">
                                <Package className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.pendingOrders || 0}</p>
                            </div>
                            <div className="rounded-full bg-yellow-100 p-3">
                                <Clock className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Products</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalProducts || 0}</p>
                            </div>
                            <div className="rounded-full bg-purple-100 p-3">
                                <ShoppingBag className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.pendingPayments || 0}</p>
                            </div>
                            <div className="rounded-full bg-orange-100 p-3">
                                <CreditCard className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="mt-2 text-2xl font-bold text-gray-900">{(stats.totalRevenue || 0).toLocaleString()} MMK</p>
                            </div>
                            <div className="rounded-full bg-green-100 p-3">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } 
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-600">Welcome back! Here's what's happening.</p>
                </div>

                {getDashboardContent()}
            </div>
        </AppLayout>
    );
}
