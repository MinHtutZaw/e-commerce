import Footer from "@/Components/common/Footer";
import Navbar from "@/Components/common/Navbar";
import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { router, usePage } from "@inertiajs/react";

interface PaymentMethod {
    id: number;
    name: string;
    bank: string;
    accountName: string;
    accountNumber: string;
    qrCodeImage?: string;
}

interface Props {
    order?: {
        id: number;
        order_number: string;
        total_amount: number;
    };
}

export default function Checkout({ order }: Props) {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
    const [paymentType, setPaymentType] = useState<"bank" | "qr">("bank");
    const [transactionId, setTransactionId] = useState<string>("");
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch payment methods from backend
        fetch('/api/payment-methods')
            .then(response => response.json())
            .then(data => {
                setPaymentMethods(data);
                if (data.length > 0) {
                    setSelectedMethod(data[0].id);
                }
            })
            .catch(error => {
                console.error('Error fetching payment methods:', error);
            });
    }, []);

    const selectedPaymentMethod = paymentMethods.find((m) => m.id === selectedMethod);

    const handleCopy = () => {
        if (selectedPaymentMethod) {
            navigator.clipboard.writeText(selectedPaymentMethod.accountNumber);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!order || !selectedMethod || transactionId.length !== 4) {
            return;
        }

        setLoading(true);

        router.post('/payments', {
            order_id: order.id,
            payment_method_id: selectedMethod,
            transaction_id: transactionId,
            payment_type: paymentType,
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
                        <div className="grid gap-8 lg:grid-cols-2">
                            {/* Left Column - Payment Method Selection */}
                            <div className="space-y-6">
                                <div className="rounded-xl border bg-white p-6 shadow-sm">
                                    <h2 className="mb-2 text-xl font-semibold text-emerald-700">
                                        Payment method
                                    </h2>
                                    <p className="mb-6 text-sm text-gray-600">
                                        Choose a bank you transferred to. You'll see QR or account details on the right.
                                    </p>

                                    <div className="space-y-3">
                                        {paymentMethods.map((method) => (
                                            <label
                                                key={method.id}
                                                className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors ${
                                                    selectedMethod === method.id
                                                        ? "border-emerald-500 bg-emerald-50"
                                                        : "border-gray-200 bg-white hover:border-gray-300"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={method.id}
                                                    checked={selectedMethod === method.id}
                                                    onChange={(e) => setSelectedMethod(Number(e.target.value))}
                                                    className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <span className="flex-1 font-medium text-gray-900">
                                                    {method.name}
                                                </span>
                                                {selectedMethod === method.id && (
                                                    <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Payment Details */}
                            <div className="space-y-6">
                                {/* Payment Type Selection */}
                                <div className="rounded-xl border bg-white p-6 shadow-sm">
                                    <div className="mb-4 flex gap-2 rounded-lg bg-gray-100 p-1">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentType("bank")}
                                            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                                                paymentType === "bank"
                                                    ? "bg-emerald-600 text-white shadow-sm"
                                                    : "text-gray-700 hover:text-gray-900"
                                            }`}
                                        >
                                            Bank Account
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPaymentType("qr")}
                                            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                                                paymentType === "qr"
                                                    ? "bg-emerald-600 text-white shadow-sm"
                                                    : "text-gray-700 hover:text-gray-900"
                                            }`}
                                        >
                                            Pay With QR
                                        </button>
                                    </div>

                                    {/* Account Details */}
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
                                                        value={selectedPaymentMethod?.bank || ''}
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
                                                        value={selectedPaymentMethod?.accountName || ''}
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
                                                            value={selectedPaymentMethod?.accountNumber || ''}
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

                                        {/* QR Code (if QR selected) */}
                                        {paymentType === "qr" && selectedPaymentMethod?.qrCodeImage && (
                                            <div className="mt-4 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8">
                                                <div className="text-center">
                                                    <img 
                                                        src={selectedPaymentMethod.qrCodeImage} 
                                                        alt="QR Code" 
                                                        className="mx-auto mb-2 h-32 w-32 rounded-lg"
                                                    />
                                                    <p className="text-xs text-gray-500">QR Code</p>
                                                </div>
                                            </div>
                                        )}
                                        {paymentType === "qr" && !selectedPaymentMethod?.qrCodeImage && (
                                            <div className="mt-4 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8">
                                                <div className="text-center">
                                                    <div className="mx-auto mb-2 h-32 w-32 rounded-lg bg-gray-200"></div>
                                                    <p className="text-xs text-gray-500">QR Code not available</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
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
                                        This helps us match your payment with your wallet.
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={!selectedMethod || transactionId.length !== 4 || loading}
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
