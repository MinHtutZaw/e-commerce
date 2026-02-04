import { Head, router } from '@inertiajs/react';
import Navbar from '@/Components/common/Navbar';
import Footer from '@/Components/common/Footer';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, DollarSign, ShirtIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CustomOrderSize {
    id: number;
    size: string;
    quantity: number;
}

interface CustomOrder {
    id: number;
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
    customOrders: CustomOrder[];
}

export default function CustomerCustomOrders({ customOrders }: Props) {
    const getStatusBadge = (status: string) => {
        const variants: Record<string, { className: string; icon: React.ReactNode; label: string }> = {
            pending: { 
                className: 'bg-yellow-100 text-yellow-800 border-yellow-300', 
                icon: <Clock className="h-3 w-3" />,
                label: 'Pending Review'
            },
            quoted: { 
                className: 'bg-blue-100 text-blue-800 border-blue-300', 
                icon: <DollarSign className="h-3 w-3" />,
                label: 'Quote Received'
            },
            confirmed: { 
                className: 'bg-purple-100 text-purple-800 border-purple-300', 
                icon: <CheckCircle className="h-3 w-3" />,
                label: 'Confirmed'
            },
            processing: { 
                className: 'bg-orange-100 text-orange-800 border-orange-300', 
                icon: <Package className="h-3 w-3" />,
                label: 'Processing'
            },
            completed: { 
                className: 'bg-green-100 text-green-800 border-green-300', 
                icon: <CheckCircle className="h-3 w-3" />,
                label: 'Completed'
            },
            cancelled: { 
                className: 'bg-red-100 text-red-800 border-red-300', 
                icon: <XCircle className="h-3 w-3" />,
                label: 'Cancelled'
            },
        };

        const config = variants[status] || variants.pending;

        return (
            <Badge variant="outline" className={`flex items-center gap-1 ${config.className}`}>
                {config.icon}
                {config.label}
            </Badge>
        );
    };

    const getTotalQuantity = (order: CustomOrder) => {
        if (order.total_quantity !== undefined) return order.total_quantity;
        return order.sizes?.reduce((sum, s) => sum + s.quantity, 0) || 0;
    };

    const getSizesSummary = (order: CustomOrder) => {
        if (!order.sizes || order.sizes.length === 0) return 'No sizes';
        return order.sizes.map(s => `${s.size}: ${s.quantity}`).join(', ');
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US').format(price) + ' MMK';
    };

    return (
        <>
            <Head title="My Custom Orders" />
            <Navbar />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <button
                        onClick={() => router.visit('/customer/profile')}
                        className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Profile</span>
                    </button>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Custom Orders</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Track and manage your bulk uniform orders
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{customOrders.length}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">
                                {customOrders.filter(o => o.status === 'pending').length}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Quoted</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {customOrders.filter(o => o.status === 'quoted').length}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                            <p className="text-2xl font-bold text-green-600">
                                {customOrders.filter(o => o.status === 'completed').length}
                            </p>
                        </div>
                    </div>

                    {/* Orders List */}
                    {customOrders.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 text-center border border-gray-100 dark:border-gray-700">
                            <ShirtIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                No Custom Orders Yet
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                You haven't placed any bulk custom orders. Click "Custom Order" in the navigation to get started!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {customOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    {/* Order Header */}
                                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        Custom Order #{order.id}
                                                    </h3>
                                                    {getStatusBadge(order.status)}
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            {order.quoted_price && (
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Quoted Price</p>
                                                    <p className="text-xl font-bold text-emerald-600">
                                                        {formatPrice(order.quoted_price)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Order Details */}
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {/* Specifications */}
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                                                    Specifications
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500 dark:text-gray-400">Type:</span>
                                                        <span className="font-medium text-gray-900 dark:text-white capitalize">
                                                            {order.customer_type}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500 dark:text-gray-400">Gender:</span>
                                                        <span className="font-medium text-gray-900 dark:text-white capitalize">
                                                            {order.gender}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500 dark:text-gray-400">Uniform:</span>
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {order.uniform_type || 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Sizes */}
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                                                    Sizes & Quantities
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {order.sizes && order.sizes.map((size) => (
                                                        <div
                                                            key={size.id}
                                                            className="bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg text-sm"
                                                        >
                                                            <span className="font-medium text-gray-900 dark:text-white">{size.size}</span>
                                                            <span className="text-gray-500 dark:text-gray-400 ml-1">× {size.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500 dark:text-gray-400">Total Pieces:</span>
                                                        <span className="font-bold text-emerald-600">{getTotalQuantity(order)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Notes */}
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                                                    Notes
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                                    {order.notes || 'No additional notes'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status Message */}
                                        {order.status === 'pending' && (
                                            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                                    <strong>Pending Review:</strong> Our team is reviewing your order. You will receive a quote within 24-48 hours.
                                                </p>
                                            </div>
                                        )}
                                        {order.status === 'quoted' && (
                                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                                    <strong>Quote Received:</strong> Please review the quoted price of <strong>{formatPrice(order.quoted_price || 0)}</strong>. 
                                                    Contact us to confirm your order.
                                                </p>
                                            </div>
                                        )}
                                        {order.status === 'processing' && (
                                            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                                                <p className="text-sm text-orange-800 dark:text-orange-200">
                                                    <strong>In Production:</strong> Your uniforms are being manufactured. We'll notify you when they're ready.
                                                </p>
                                            </div>
                                        )}
                                        {order.status === 'completed' && (
                                            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                                <p className="text-sm text-green-800 dark:text-green-200">
                                                    <strong>Completed:</strong> Your order has been delivered. Thank you for your business!
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}
