import Footer from "@/Components/common/Footer";
import Navbar from "@/Components/common/Navbar";
import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { router, usePage } from "@inertiajs/react";

interface PaymentInfo {
    account_name: string;
    account_number: string;
    bank_name: string;
}

interface Props {
    order?: {
        id: number;
        order_number: string;
        total_amount: number;
    };
}

export default function Checkout({ order }: Props) {
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
    const [accountName, setAccountName] = useState<string>("");
    const [transactionId, setTransactionId] = useState<string>("");
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch payment info from backend
        fetch('/api/payment-info')
            .then(response => response.json())
            .then(data => {
                setPaymentInfo(data);
                setAccountName(data.account_name);
            })
            .catch(error => {
                console.error('Error fetching payment info:', error);
            });
    }, []);

    const handleCopy = () => {
        if (paymentInfo) {
            navigator.clipboard.writeText(paymentInfo.account_number);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!order || !accountName || transactionId.length !== 4) {
            return;
        }

        setLoading(true);

        router.post('/payments', {
            order_id: order.id,
            account_name: accountName,
            transaction_id: transactionId,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                alert('Payment submitted successfully! We will verify and confirm your payment shortly.');
                router.visit('/');
            },
            onError: (errors) => {
                console.error('Payment submission error:', errors);
                alert('Failed to submit payment. Please try again.');
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
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-emerald-700 sm:text-4xl">
                            Checkout
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 max-w-2xl mx-auto">
                            Choose a payment method and submit your transaction details. We'll verify and add funds shortly.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mx-auto max-w-2xl">
                            <div className="space-y-6">
                                {/* Payment Details */}
                                <div className="rounded-xl border bg-white p-6 shadow-sm">
                                    <h2 className="mb-4 text-xl font-semibold text-emerald-700">
                                        Payment Information
                                    </h2>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="mb-3 text-sm font-semibold text-gray-900">
                                                Transfer to the account below:
                                            </h3>

                                            <div className="space-y-3">
                                                <div>
                                                    <label className="mb-1 block text-xs font-medium text-gray-600">
                                                        Bank
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={paymentInfo?.bank_name || ''}
                                                        readOnly
                                                        className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-xs font-medium text-gray-600">
                                                        Account name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={paymentInfo?.account_name || ''}
                                                        readOnly
                                                        className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-xs font-medium text-gray-600">
                                                        Account number
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={paymentInfo?.account_number || ''}
                                                            readOnly
                                                            className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
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
                                </div>

                                {/* Account Name Used for Transfer */}
                                <div className="rounded-xl border bg-white p-6 shadow-sm">
                                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                                        <span className="text-gray-900">သင်သုံးသော အကောင့်အမည်</span>{" "}
                                        <span className="text-gray-500">(Account name you used for transfer)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value)}
                                        placeholder="Enter your account name"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20"
                                    />
                                    <p className="mt-2 text-xs text-gray-500">
                                        Enter the account name you used to transfer money
                                    </p>
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
                                    disabled={!accountName || transactionId.length !== 4 || loading}
                                    className="w-full rounded-md bg-purple-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400"
                                >
                                    {loading ? 'Submitting...' : 'Submit Payment'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}
