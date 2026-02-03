import { Head, router } from '@inertiajs/react';
import Navbar from '@/Components/common/Navbar';
import Footer from '@/Components/common/Footer';
import { ArrowLeft, Package, MapPin, CreditCard, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductSize {
    id: number;
    size: string;
    price: number;
}

interface Product {
    id: number;
    name: string;
    image: string;
}

interface OrderItem {
    id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
    product: Product;
    product_size: ProductSize;
}

interface Payment {
    id: number;
    bank: string;
    transaction_id: string;
    amount: number;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    created_at: string;
}

interface Order {
    id: number;
    order_number: string;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment_status: 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded';
    total_amount: number;
    notes?: string;
    created_at: string;
    items: OrderItem[];
    payments: Payment[];
}

interface Props {
    order: Order;
}

const paymentStatusLabel: Record<string, string> = {
    unpaid: 'Unpaid',
    pending: 'Submitted',
    paid: 'Verified',
    failed: 'Rejected',
    refunded: 'Refunded',
};

export default function CustomerOrderDetails({ order }: Props) {
    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            unpaid: 'bg-gray-100 text-gray-800 border-gray-300',
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
            processing: 'bg-purple-100 text-purple-800 border-purple-300',
            paid: 'bg-green-100 text-green-800 border-green-300',
            failed: 'bg-red-100 text-red-800 border-red-300',
            refunded: 'bg-gray-100 text-gray-800 border-gray-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered':
            case 'paid':
                return <CheckCircle className="w-5 h-5" />;
            case 'processing':
           
            default:
                return <Clock className="w-5 h-5" />;
        }
    };

    return (
        <>
            <Head title={`Order #${order.order_number}`} />
            <Navbar />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <button
                        onClick={() => router.visit('/customer/profile')}
                        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-all duration-300 group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Profile</span>
                    </button>

                    {/* Order Header */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Order #{order.order_number}
                                </h1>
                                <p className="text-gray-600">
                                    Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    <span className="font-semibold capitalize">{order.status}</span>
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${getStatusColor(order.payment_status)}`}>
                                    <CreditCard className="w-5 h-5" />
                                    <span className="font-semibold">{paymentStatusLabel[order.payment_status] ?? order.payment_status}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
                        {/* Order Items */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Package className="w-6 h-6 text-emerald-600" />
                                    Order Items
                                </h2>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                        >
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                                                <p className="text-sm text-gray-600">Size: {item.product_size.size}</p>
                                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">{item.total_price.toLocaleString()} MMK</p>
                                                <p className="text-sm text-gray-600">{item.unit_price.toLocaleString()} MMK each</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Information */}
                            {order.payments && order.payments.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 shadow-lg">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <CreditCard className="w-6 h-6 text-emerald-600" />
                                        Payment Information
                                    </h2>
                                    <div className="space-y-4">
                                        {order.payments.map((payment) => (
                                            <div
                                                key={payment.id}
                                                className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200"
                                            >
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm text-gray-600 mb-1">Bank</p>
                                                        <p className="font-semibold text-gray-900">{payment.bank}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600 mb-1"> Last 4 digits of Transaction ID</p>
                                                        <p className="font-semibold text-gray-900">{payment.transaction_id}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600 mb-1">Amount</p>
                                                        <p className="font-semibold text-gray-900">{payment.amount.toLocaleString()} MMK</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600 mb-1">Status</p>
                                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(payment.status)}`}>
                                                            {getStatusIcon(payment.status)}
                                                            {payment.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            {order.notes && (
                                <div className="bg-white rounded-2xl p-6 shadow-lg">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Order Notes</h2>
                                    <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{order.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Order Summary Sidebar - single sticky wrapper so both cards stay together on scroll */}
                        <div className="lg:self-start sticky top-8 space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto">
                            {/* Order Summary */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium">{order.total_amount.toLocaleString()} MMK</span>
                                    </div>
                                  
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between text-lg font-bold text-gray-900">
                                            <span>Total</span>
                                            <span className="text-emerald-600">{order.total_amount.toLocaleString()} MMK</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 space-y-3">
                                    {(order.payment_status === 'unpaid' || order.payment_status === 'failed') && (
                                        <Button
                                            onClick={() => router.visit(`/checkout?order=${order.id}`)}
                                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                                        >
                                            Complete Payment
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => router.visit('/products')}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Continue Shopping
                                    </Button>
                                </div>
                            </div>

                            {/* Order Status: pending → processing → delivered */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Status</h2>
                                <div className="space-y-4">
                                    <div className={`flex items-center gap-3 ${order.status !== 'cancelled' ? 'text-green-600' : 'text-gray-400'}`}>
                                        <CheckCircle className="w-6 h-6 flex-shrink-0" />
                                        <span className="font-medium">Order Placed</span>
                                    </div>
                                    <div className={`flex items-center gap-3 ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'text-green-600' : 'text-gray-400'}`}>
                                        <CheckCircle className="w-6 h-6 flex-shrink-0" />
                                        <span className="font-medium">Processing</span>
                                    </div>
                                    <div className={`flex items-center gap-3 ${order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                                        <CheckCircle className="w-6 h-6 flex-shrink-0" />
                                        <span className="font-medium">Delivered</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

                                    
        </>
    );
}
