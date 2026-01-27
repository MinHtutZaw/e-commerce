import { useState } from "react";
import { router } from "@inertiajs/react";
import { Save } from "lucide-react";

interface Props {
    payment_account_name: string;
    payment_account_number: string;
    payment_bank_name: string;
}

export default function AdminSettings({ 
    payment_account_name, 
    payment_account_number,
    payment_bank_name 
}: Props) {
    const [accountName, setAccountName] = useState(payment_account_name);
    const [accountNumber, setAccountNumber] = useState(payment_account_number);
    const [bankName, setBankName] = useState(payment_bank_name);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        router.put('/admin/settings', {
            payment_account_name: accountName,
            payment_account_number: accountNumber,
            payment_bank_name: bankName,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                alert('Settings updated successfully!');
            },
            onError: (errors) => {
                console.error('Error updating settings:', errors);
                alert('Failed to update settings. Please try again.');
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Payment Settings</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Configure the default payment account details that customers will see during checkout.
                    </p>
                </div>

                {/* Settings Form */}
                <form onSubmit={handleSubmit}>
                    <div className="rounded-lg border bg-white p-6 shadow-sm">
                        <div className="space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Bank Name
                                </label>
                                <input
                                    type="text"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    placeholder="KBZ Bank"
                                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20"
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    The name of the bank (e.g., KBZ Bank, AYA Bank)
                                </p>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Account Name
                                </label>
                                <input
                                    type="text"
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    placeholder="EduFit"
                                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20"
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    The name on the payment account
                                </p>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Account Number
                                </label>
                                <input
                                    type="text"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    placeholder="09876543210"
                                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20"
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    The payment account number or phone number
                                </p>
                            </div>

                            <div className="flex justify-end border-t pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 rounded-md bg-purple-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
                                >
                                    <Save size={16} />
                                    {loading ? 'Saving...' : 'Save Settings'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
