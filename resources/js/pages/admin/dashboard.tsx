import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Package, Users, ShoppingBag, Clock, DollarSign, TrendingUp, CheckCircle, Truck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, YAxis } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const revenueChartConfig = {
    revenue: {
        label: 'Revenue',
        color: 'hsl(142, 76%, 36%)',
    },
} satisfies ChartConfig;

const productChartConfig = {
    total_amount: {
        label: 'Sales',
        color: 'hsl(262, 83%, 58%)',
    },
} satisfies ChartConfig;


const COLORS = [
    'hsl(262, 83%, 70%)',
    'hsl(199, 89%, 60%)',
    'hsl(142, 76%, 50%)',
    'hsl(38, 92%, 60%)',
    'hsl(340, 82%, 65%)',
    'hsl(180, 70%, 50%)',
];

interface ChartDataItem {
    date: string;
    revenue: number;
}

interface ProductSalesItem {
    product: string;
    quantity: number;
    total_amount: number;
    fill?: string;
}

interface RecentOrder {
    id: number;
    order_number: string;
    customer: string;
    total: number;
    status: string;
    date: string;
}

interface Props {
    userRole: 'customer' | 'admin';
    stats: {
        totalOrders?: number;
        pendingOrders?: number;
        processingOrders?: number;
        deliveredOrders?: number;
        totalUsers?: number;
        totalProducts?: number;
        pendingPayments?: number;
        totalRevenue?: number;
        totalSpent?: number;
        totalCustomOrders?: number;
        pendingCustomOrders?: number;
    };
    chartData?: ChartDataItem[];
    productSales?: ProductSalesItem[];
    recentOrders?: RecentOrder[];
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: any;
}

export default function Dashboard({ userRole, stats, chartData = [], productSales = [], recentOrders = [] }: Props) {
    const { flash } = usePage<Props>().props;
    const [timeRange, setTimeRange] = useState('90d');

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, { duration: 3000 });
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Filter chart data based on time range
    const filteredChartData = chartData.filter((item) => {
        const date = new Date(item.date);
        const referenceDate = new Date();
        let daysToSubtract = 90;
        if (timeRange === '30d') daysToSubtract = 30;
        else if (timeRange === '7d') daysToSubtract = 7;

        const startDate = new Date(referenceDate);
        startDate.setDate(referenceDate.getDate() - daysToSubtract);
        return date >= startDate;
    });

    // Add colors to product sales
    const productSalesWithColors = productSales.map((item, index) => ({
        ...item,
        fill: COLORS[index % COLORS.length],
    }));

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (userRole === 'admin') {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <div className="flex h-full flex-1 flex-col gap-4 p-4">
                    {/* Header */}
                    <div className="mb-2">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your store.</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {(stats.totalRevenue || 0).toLocaleString()} MMK
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">From paid orders</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</CardTitle>
                                <Package className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalOrders || 0}</div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {stats.pendingOrders || 0} pending
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Customers</CardTitle>
                                <Users className="h-4 w-4 text-purple-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalUsers || 0}</div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Registered users</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Products</CardTitle>
                                <ShoppingBag className="h-4 w-4 text-orange-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalProducts || 0}</div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">In catalog</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Status Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="border-l-4 border-l-yellow-500">
                            <CardContent className="flex items-center justify-between p-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                                    <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders || 0}</p>
                                </div>
                                <Clock className="h-8 w-8 text-yellow-500" />
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-500">
                            <CardContent className="flex items-center justify-between p-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Processing</p>
                                    <p className="text-2xl font-bold text-purple-600">{stats.processingOrders || 0}</p>
                                </div>
                                <Truck className="h-8 w-8 text-purple-500" />
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                            <CardContent className="flex items-center justify-between p-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Delivered</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.deliveredOrders || 0}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-500" />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Revenue Chart */}
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2">
                            <div>
                                <CardTitle>Revenue Overview</CardTitle>
                                <CardDescription>
                                    Daily revenue for the last {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '3 months'}
                                </CardDescription>
                            </div>
                            <Select value={timeRange} onValueChange={setTimeRange}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Select range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7d">Last 7 days</SelectItem>
                                    <SelectItem value="30d">Last 30 days</SelectItem>
                                    <SelectItem value="90d">Last 3 months</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent>
                            {filteredChartData.length > 0 ? (
                                <ChartContainer config={revenueChartConfig} className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={filteredChartData}>
                                            <defs>
                                                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.1} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis
                                                dataKey="date"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                tickFormatter={(value) => {
                                                    const date = new Date(value);
                                                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                                }}
                                            />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                                            />
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent
                                                        labelFormatter={(value) =>
                                                            new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                        }
                                                    />
                                                }
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="hsl(142, 76%, 36%)"
                                                fill="url(#fillRevenue)"
                                                strokeWidth={2}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            ) : (
                                <div className="flex h-[300px] items-center justify-center text-gray-500">
                                    <div className="text-center">
                                        <TrendingUp className="mx-auto h-12 w-12 text-gray-300" />
                                        <p className="mt-2">No revenue data yet</p>
                                        <p className="text-sm">Complete some orders to see the chart</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Bottom Section: Product Sales & Recent Orders */}
                    <div className="grid gap-4 md:grid-cols-2">


                        {/* Product Sales List */}
                        {productSalesWithColors.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Product Sales Breakdown</CardTitle>
                                    <CardDescription>Detailed view of product performance</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                                        {productSalesWithColors.map((product, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="h-3 w-3 rounded-sm"
                                                        style={{ backgroundColor: product.fill }}
                                                    />
                                                    <span className="font-medium text-sm truncate max-w-[120px]">{product.product}</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-sm">{product.total_amount.toLocaleString()} MMK</p>
                                                    <p className="text-xs text-gray-500">{product.quantity} sold</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Recent Orders */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Orders</CardTitle>
                                <CardDescription>Latest orders from your store</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {recentOrders.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentOrders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium">{order.order_number}</p>
                                                    <p className="text-sm text-gray-500">{order.customer}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">{order.total.toLocaleString()} MMK</p>
                                                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex h-[200px] items-center justify-center text-gray-500">
                                        <div className="text-center">
                                            <Package className="mx-auto h-12 w-12 text-gray-300" />
                                            <p className="mt-2">No orders yet</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>


                </div>
            </AppLayout>
        );
    }

    // Customer Dashboard
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's your order summary.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">My Orders</CardTitle>
                            <Package className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalOrders || 0}</div>
                            <p className="text-xs text-gray-500">{stats.pendingOrders || 0} pending</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Pending Orders</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders || 0}</div>
                            <p className="text-xs text-gray-500">Awaiting processing</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
                            <DollarSign className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {(stats.totalSpent || 0).toLocaleString()} MMK
                            </div>
                            <p className="text-xs text-gray-500">Lifetime purchases</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
