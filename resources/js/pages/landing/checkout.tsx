import Footer from "@/Components/common/Footer";
import Navbar from "@/Components/common/Navbar";
import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { router, usePage } from "@inertiajs/react";
import { toast } from "sonner";

interface PaymentMethod {
    bank_name: string;
    account_name: string;
    account_number: string;
}

interface PaymentInfo {
    KBZ: PaymentMethod;
    AYA: PaymentMethod;
}

interface Props {
    order?: {
        id: number;
        order_number: string;
        total_amount: number;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Checkout({ order, flash }: Props) {
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
    const [bank, setBank] = useState<"KBZ" | "AYA">("KBZ");
    const [transactionId, setTransactionId] = useState<string>("");
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Show flash messages
        if (flash?.success) {
            toast.success(flash.success, {
                duration: 5000,
                position: 'top-right',
            });
        }
        if (flash?.error) {
            toast.error(flash.error, {
                duration: 5000,
                position: 'top-right',
            });
        }
    }, [flash]);

    useEffect(() => {
        // Fetch payment info from backend
        fetch('/payment-info')
            .then(response => response.json())
            .then(data => {
                setPaymentInfo(data);
            })
            .catch(error => {
                console.error('Error fetching payment info:', error);
            });
    }, []);

    const currentPaymentMethod = paymentInfo ? paymentInfo[bank] : null;

    const handleCopy = () => {
        if (currentPaymentMethod) {
            navigator.clipboard.writeText(currentPaymentMethod.account_number);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!order || !bank || transactionId.length !== 4) {
            return;
        }

        setLoading(true);

        router.post('/payments', {
            order_id: order.id,
            bank: bank,
            transaction_id: transactionId,
            amount: order.total_amount,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Payment submitted successfully!', {
                    description: 'Admin will verify your payment shortly',
                });
                if (order) {
                    router.visit(`/orders/${order.id}`);
                } else {
                    router.visit('/customer/orders');
                }
            },
            onError: (errors) => {
                console.error('Payment submission error:', errors);
                const errorMessage = typeof errors === 'object' ? Object.values(errors).flat().join(', ') : 'Failed to submit payment';
                toast.error('Payment submission failed', {
                    description: errorMessage,
                });
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    // If no order, redirect to cart
    if (!order) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">No Order Found</h1>
                        <p className="text-gray-600 mb-6">Please add items to your cart first.</p>
                        <button
                            onClick={() => router.visit('/cart')}
                            className="rounded-md bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700"
                        >
                            Go to Cart
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="mt-6 max-w-2xl mx-auto rounded-2xl border border-emerald-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md overflow-hidden">

                        {/* Header strip */}
                        <div className="bg-emerald-600 text-white px-6 py-3 text-sm font-semibold tracking-wide">
                            PAYMENT SUMMARY
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-5">
                            <div className="flex justify-between items-center">
                                <div className="text-left">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Order Number
                                    </p>
                                    <p className="text-xl font-semibold text-gray-900 dark:text-white tracking-wide">
                                        #{order.order_number}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Total Amount
                                    </p>
                                    <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                                        {order.total_amount.toLocaleString()} MMK
                                    </p>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-emerald-100 dark:border-gray-700"></div>

                            {/* Info Text */}
                            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                                Transfer the amount to our bank account and submit your transaction
                                details below to complete your order.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mx-auto max-w-2xl">
                            <div className="space-y-6">
                                {/* Payment Details */}
                                <div className="rounded-xl border bg-white p-6 shadow-sm">
                                    <h2 className="mb-4 text-xl font-semibold text-emerald-700">
                                        Payment Information
                                    </h2>

                                    {/* Bank Selection First */}
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-semibold text-gray-900">
                                            Select Payment Method
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setBank('KBZ')}
                                                className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${bank === 'KBZ'
                                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                                    }`}
                                            >
                                                KBZ Pay
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setBank('AYA')}
                                                className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${bank === 'AYA'
                                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                                    }`}
                                            >
                                                AYA Pay
                                            </button>
                                        </div>
                                    </div>

                                    {/* Show selected payment method details */}
                                    {currentPaymentMethod && (
                                        <div className="space-y-4 mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                                            <div>
                                                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                                                    Transfer to this account:
                                                </h3>

                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="mb-1 block text-xs font-medium text-gray-600">
                                                            Payment Method
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={currentPaymentMethod.bank_name}
                                                            readOnly
                                                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 font-medium"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="mb-1 block text-xs font-medium text-gray-600">
                                                            Account Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={currentPaymentMethod.account_name}
                                                            readOnly
                                                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 font-medium"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="mb-1 block text-xs font-medium text-gray-600">
                                                            Account Number / Phone
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={currentPaymentMethod.account_number}
                                                                readOnly
                                                                className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 font-medium"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={handleCopy}
                                                                className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                                            >
                                                                {copied ? (
                                                                    <>
                                                                        <Check size={16} className="text-emerald-600" />
                                                                        <span className="text-emerald-600">Copied!</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Copy size={16} />
                                                                        <span>Copy</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>


                                {/* Transaction ID */}
                                <div className="rounded-xl border bg-white p-6 shadow-sm">
                                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                                        <span className="text-gray-900">ငွေလွဲပြေစာမှ Transaction ID နောက်ဆုံးနံပါတ် 4 လုံးထည့်ပါ</span>{" "}
                                        <span className="text-gray-500">(Last 4 digits of your transaction ID)</span>
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={4}
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value.replace(/\D/g, ""))}
                                        placeholder="1234"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20"
                                    />
                                    <p className="mt-2 text-xs text-gray-500">
                                        This helps us match your payment with your order.
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={!bank || transactionId.length !== 4 || loading}
                                    className="w-full rounded-md bg-purple-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400"
                                >
                                    {loading ? 'Submitting...' : 'Submit Payment'}
                                </button>

                                <p className="text-center text-xs text-gray-500">
                                    After submission, admin will verify your payment and update your order status.
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}
