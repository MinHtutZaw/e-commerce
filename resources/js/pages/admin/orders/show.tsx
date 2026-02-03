import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Package, CreditCard, Clock, CheckCircle, XCircle, Truck, User, Edit2 } from 'lucide-react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
        id: number;
        name: string;
        email: string;
        phone?: string;
    };
}

interface Props {
    order: Order;
    userRole: 'customer' | 'admin';
}

type PaymentModalPayload = { paymentId: number; status: 'paid' | 'failed'; label: string } | null;

export default function OrderShow({ order, userRole }: Props) {
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(order.status);
    const [paymentModal, setPaymentModal] = useState<PaymentModalPayload>(null);
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Orders', href: '/customer/orders' },
        { title: order.order_number, href: `/orders/${order.id}` },
    ];

    const handleUpdateOrderStatus = () => {
        if (selectedStatus === order.status) {
            setIsUpdatingStatus(false);
            return;
        }
        
        router.put(`/orders/${order.id}/status`, {
            status: selectedStatus,
        }, {
            onSuccess: () => {
                setIsUpdatingStatus(false);
            },
            preserveScroll: true,
        });
    };

    const openPaymentModal = (paymentId: number, status: 'paid' | 'failed') => {
        setPaymentModal({
            paymentId,
            status,
            label: status === 'paid' ? 'Verify payment' : 'Reject payment',
        });
    };

    const handleConfirmPaymentAction = () => {
        if (!paymentModal) return;
        router.put(`/payments/${paymentModal.paymentId}/status`, {
            status: paymentModal.status,
        }, {
            preserveScroll: true,
            onSuccess: () => setPaymentModal(null),
        });
    };

    const statusConfig = {
        pending: { 
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
            icon: Clock,
            label: 'Pending'
        },
        confirmed: { 
            color: 'bg-blue-100 text-blue-800 border-blue-200', 
            icon: CheckCircle,
            label: 'Confirmed'
        },
        processing: { 
            color: 'bg-purple-100 text-purple-800 border-purple-200', 
            icon: Package,
            label: 'Processing'
        },
        shipped: { 
            color: 'bg-indigo-100 text-indigo-800 border-indigo-200', 
            icon: Truck,
            label: 'Shipped'
        },
        delivered: { 
            color: 'bg-green-100 text-green-800 border-green-200', 
            icon: CheckCircle,
            label: 'Delivered'
        },
        cancelled: { 
            color: 'bg-red-100 text-red-800 border-red-200', 
            icon: XCircle,
            label: 'Cancelled'
        },
    };

    const paymentStatusConfig = {
        unpaid: {
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: Clock,
            label: 'Unpaid'
        },
        pending: { 
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
            icon: Clock,
            label: 'Submitted'
        },
        paid: { 
            color: 'bg-green-100 text-green-800 border-green-200', 
            icon: CheckCircle,
            label: 'Verified'
        },
        failed: { 
            color: 'bg-red-100 text-red-800 border-red-200', 
            icon: XCircle,
            label: 'Rejected'
        },
        refunded: {
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: Clock,
            label: 'Refunded'
        }
    };

    const orderPaymentStatus = (order.payment_status || 'unpaid') as keyof typeof paymentStatusConfig;
    const currentOrderPaymentConfig = paymentStatusConfig[orderPaymentStatus] || paymentStatusConfig.unpaid;

    const currentStatus = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
    const StatusIcon = currentStatus.icon;

    const latestPayment = order.payments && order.payments.length > 0 
        ? order.payments[order.payments.length - 1] 
        : null;

    const currentPaymentStatus = latestPayment 
        ? paymentStatusConfig[latestPayment.status as keyof typeof paymentStatusConfig] || paymentStatusConfig.pending
        : (order.payment_status ? paymentStatusConfig[order.payment_status as keyof typeof paymentStatusConfig] : paymentStatusConfig.unpaid);
    const PaymentIcon = currentPaymentStatus?.icon;

    const canPay = !latestPayment || latestPayment.status === 'failed' || latestPayment.status === 'pending';

    // Admin: order flow is pending → processing → delivered
    const paymentVerified = order.payment_status === 'paid';
    const hasPendingPayment = latestPayment?.status === 'pending';
    const adminOrderNextAction = userRole === 'admin' && order.status !== 'cancelled'
        ? (order.status === 'pending' && paymentVerified ? 'processing'
            : order.status === 'processing' ? 'delivered'
            : null)
        : null;

    const handleOrderAction = (nextStatus: string) => {
        router.put(`/orders/${order.id}/status`, { status: nextStatus }, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order ${order.order_number}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.visit('/customer/orders')}
                            className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white shadow-sm transition-colors hover:bg-gray-50"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                            <p className="text-gray-600">Order #{order.order_number}</p>
                        </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 shadow-sm">
                        <StatusIcon className="h-5 w-5" />
                        <span className={`rounded-full border px-3 py-1 text-sm font-medium ${currentStatus.color}`}>
                            {currentStatus.label}
                        </span>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <Package className="h-5 w-5 text-emerald-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
                            </div>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border bg-gray-50">
                                            <img
                                                src={item.product.image || '/img/slider-1.png'}
                                                alt={item.product.name}
                                                className="h-full w-full object-contain p-2"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {item.product.name}
                                                </h3>
                                                <div className="mt-2 flex gap-4">
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium">Size:</span> {item.product_size.size}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium">Quantity:</span> {item.quantity}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium">Unit Price:</span> {item.unit_price.toLocaleString()} MMK
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <p className="text-lg font-bold text-emerald-600">
                                                    {item.total_price.toLocaleString()} MMK
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Order Total */}
                            <div className="mt-6 border-t pt-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                                    <span className="text-2xl font-bold text-emerald-600">
                                        {order.total_amount.toLocaleString()} MMK
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Payment History */}
                        {order.payments && order.payments.length > 0 && (
                            <div className="rounded-lg border bg-white p-6 shadow-sm">
                                <div className="mb-4 flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-emerald-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
                                </div>
                                <div className="space-y-3">
                                    {order.payments.map((payment) => {
                                        const paymentConfig = paymentStatusConfig[payment.status as keyof typeof paymentStatusConfig] || paymentStatusConfig.pending;
                                        const PaymentStatusIcon = paymentConfig.icon;
                                        
                                        return (
                                            <div key={payment.id} className="rounded-lg border bg-gray-50 p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-4">
                                                        <div className="rounded-full bg-white p-3 shadow-sm">
                                                            <PaymentStatusIcon className="h-5 w-5 text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                {payment.bank} Pay
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                Transaction ID: ***{payment.transaction_id}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {new Date(payment.created_at).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-900">
                                                            {payment.amount.toLocaleString()} MMK
                                                        </p>
                                                        <span className={`mt-2 inline-block rounded-full border px-3 py-1 text-xs font-medium ${paymentConfig.color}`}>
                                                            {paymentConfig.label}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {/* Admin Payment Actions */}
                                                {userRole === 'admin' && payment.status === 'pending' && (
                                                    <div className="flex gap-2 border-t pt-3">
                                                        <button
                                                            onClick={() => openPaymentModal(payment.id, 'paid')}
                                                            className="flex-1 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                                                        >
                                                            Verify payment
                                                        </button>
                                                        <button
                                                            onClick={() => openPaymentModal(payment.id, 'failed')}
                                                            className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                                                        >
                                                            Reject payment
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        {order.notes && (
                            <div className="rounded-lg border bg-white p-6 shadow-sm">
                                <h2 className="mb-2 text-lg font-semibold text-gray-900">Order Notes</h2>
                                <p className="text-gray-700">{order.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 space-y-6">
                            {/* Customer Info (Admin Only) */}
                            {userRole === 'admin' && order.user && (
                                <div className="rounded-lg border bg-white p-6 shadow-sm">
                                    <div className="mb-4 flex items-center gap-2">
                                        <User className="h-5 w-5 text-emerald-600" />
                                        <h2 className="text-lg font-semibold text-gray-900">Customer Info</h2>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Name</p>
                                            <p className="font-medium text-gray-900">{order.user.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Email</p>
                                            <p className="font-medium text-gray-900">{order.user.email}</p>
                                        </div>
                                        {order.user.phone && (
                                            <div>
                                                <p className="text-xs text-gray-500">Phone</p>
                                                <p className="font-medium text-gray-900">{order.user.phone}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Order Info */}
                            <div className="rounded-lg border bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Information</h2>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500">Order Number</p>
                                        <p className="font-mono text-sm font-medium text-gray-900">{order.order_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Order Date</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {new Date(order.created_at).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-2">Order Status</p>
                                        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${currentStatus.color}`}>
                                            <StatusIcon className="h-4 w-4" />
                                            {currentStatus.label}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-2">Payment Status</p>
                                        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${currentOrderPaymentConfig.color}`}>
                                            {(() => {
                                                const Icon = currentOrderPaymentConfig.icon;
                                                return Icon ? <Icon className="h-4 w-4" /> : null;
                                            })()}
                                            {currentOrderPaymentConfig.label}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Admin: Order next-step actions (buttons only, no dropdown) */}
                            {userRole === 'admin' && order.status !== 'cancelled' && (
                                <div className="rounded-lg border bg-white p-6 shadow-sm">
                                    <h2 className="mb-3 text-lg font-semibold text-gray-900">Order Actions</h2>
                                    {hasPendingPayment ? (
                                        <p className="text-sm text-amber-700 mb-3">
                                            Verify or reject the submitted payment first. Order status can advance only after payment is verified.
                                        </p>
                                    ) : adminOrderNextAction ? (
                                        <div className="space-y-2">
                                            {adminOrderNextAction === 'processing' && (
                                                <button
                                                    onClick={() => handleOrderAction('processing')}
                                                    className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                                                >
                                                    Start processing
                                                </button>
                                            )}
                                            {adminOrderNextAction === 'delivered' && (
                                                <button
                                                    onClick={() => handleOrderAction('delivered')}
                                                    className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white hover:bg-green-700"
                                                >
                                                    Mark delivered
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">No next action. Order is {order.status}.</p>
                                    )}
                                </div>
                            )}

                            {/* Order Summary */}
                            <div className="rounded-lg border bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>
                                <div className="space-y-2 border-b pb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Items ({order.items.length})</span>
                                        <span className="font-medium text-gray-900">
                                            {order.items.reduce((sum, item) => sum + item.total_price, 0).toLocaleString()} MMK
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-semibold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-emerald-600">
                                            {order.total_amount.toLocaleString()} MMK
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                {canPay && userRole === 'customer' && (
                                    <button
                                        onClick={() => router.visit(`/checkout?order=${order.id}`)}
                                        className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
                                    >
                                        {latestPayment?.status === 'failed' ? 'Retry Payment' : 'Make Payment'}
                                    </button>
                                )}

                                <button
                                    onClick={() => router.visit('/customer/orders')}
                                    className="w-full rounded-lg border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                                >
                                    Back to Orders
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment verify/reject confirmation modal */}
            <Dialog open={!!paymentModal} onOpenChange={(open) => !open && setPaymentModal(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{paymentModal?.label ?? 'Confirm action'}</DialogTitle>
                        <DialogDescription>
                            {paymentModal?.status === 'paid'
                                ? 'This will mark the payment as verified. The order can then be confirmed and processed.'
                                : 'This will reject the payment. The customer may submit a new payment.'}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setPaymentModal(null)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmPaymentAction}
                            className={paymentModal?.status === 'paid' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                        >
                            {paymentModal?.status === 'paid' ? 'Verify payment' : 'Reject payment'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
