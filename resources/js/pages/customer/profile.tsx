import { useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import Navbar from '@/Components/common/Navbar';
import Footer from '@/Components/common/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, ShoppingBag, Lock, LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
    id: number;
    order_number: string;
    total_amount: number;
    status: string;
    created_at: string;
}

interface Stats {
    totalOrders: number;
    pendingOrders: number;
    totalSpent: number;
}

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
        phone?: string;
        address?: string;
        created_at: string;
    };
    recentOrders: Order[];
    stats: Stats;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function CustomerProfile({ user, recentOrders, stats, flash }: Props) {
    const [activeSection, setActiveSection] =
        useState<'profile' | 'orders' | 'password'>('profile');

    const { data: profileData, setData: setProfileData, post: updateProfile, processing: profileProcessing, errors: profileErrors } =
        useForm({
            name: user.name ?? '',
            email: user.email ?? '',
            phone: user.phone ?? '',
            address: user.address ?? '',
        });

    const { data: passwordData, setData: setPasswordData, post: updatePassword, processing: passwordProcessing, errors: passwordErrors, reset } =
        useForm({
            current_password: '',
            password: '',
            password_confirmation: '',
        });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleLogout = () => router.post('/logout');

    return (
        <>
            <Head title="My Profile" />
            <Navbar />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-10">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Sidebar */}
                        <aside className="lg:w-64">
                            <div className="bg-white rounded-2xl shadow-sm border p-5 sticky top-8">
                                <nav className="space-y-2">
                                    {[
                                        { key: 'profile', icon: User, label: 'My Profile' },
                                        { key: 'orders', icon: ShoppingBag, label: 'My Orders' },
                                        { key: 'password', icon: Lock, label: 'Password' },
                                    ].map(item => (
                                        <button
                                            key={item.key}
                                            onClick={() => setActiveSection(item.key as any)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition
                                                ${activeSection === item.key
                                                    ? 'bg-emerald-600 text-white shadow'
                                                    : 'text-gray-700 hover:bg-emerald-50'
                                                }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            {item.label}
                                        </button>
                                    ))}

                                    <div className="pt-3 border-t">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Logout
                                        </button>
                                    </div>
                                </nav>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1">
                            <div className="bg-white rounded-2xl shadow-sm border p-8">

                                {/* PROFILE */}
                                {activeSection === 'profile' && (
                                    <div className="space-y-8">
                                        <div>
                                            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
                                            <p className="text-gray-500">Manage your account information</p>
                                        </div>

                                        {/* Avatar */}
                                        <div className="flex items-center gap-6 border-b pb-6">
                                            <div className="w-24 h-24 rounded-full bg-emerald-600 flex items-center justify-center text-white text-3xl font-bold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold">{user.name}</h2>
                                                <p className="text-gray-500 text-sm">
                                                    Member since {new Date(user.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Form */}
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                updateProfile('/customer/profile/update');
                                            }}
                                            className="space-y-6 max-w-lg"
                                        >
                                            {['name', 'email', 'phone', 'address'].map(field => (
                                                <div key={field}>
                                                    <Label className="text-gray-700 capitalize">{field}</Label>
                                                    <Input
                                                        value={(profileData as Record<string, string>)[field] ?? ''}
                                                        onChange={(e) => setProfileData(field as 'name' | 'email' | 'phone' | 'address', e.target.value)}
                                                        className="mt-2"
                                                    />
                                                    {(profileErrors as any)[field] && (
                                                        <p className="text-red-500 text-sm mt-1">
                                                            {(profileErrors as any)[field]}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}

                                            <Button
                                                disabled={profileProcessing}
                                                className="bg-emerald-600 hover:bg-emerald-700 px-8"
                                            >
                                                {profileProcessing ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                        </form>

                                      
                                    </div>
                                )}

                                {/* ORDERS */}
                                {activeSection === 'orders' && (
                                    <div className="space-y-6">
                                        
                                        <h1 className="text-3xl font-bold">My Orders</h1>

                                          {/* Stats */}
                                          <div className="grid md:grid-cols-3 gap-4 pt-6 border-t">
                                            <StatCard label="Total Orders" value={stats.totalOrders} />
                                            <StatCard label="Pending Orders" value={stats.pendingOrders} />
                                            <StatCard label="Total Spent" value={`${stats.totalSpent.toLocaleString()} MMK`} />
                                        </div>
                                        {recentOrders.length === 0 ? (
                                            <p className="text-gray-500">No orders yet.</p>
                                        ) : (
                                            recentOrders.map(order => (
                                                <div
                                                    key={order.id}
                                                    onClick={() => router.visit(`/orders/${order.id}`)}
                                                    className="border rounded-xl p-5 hover:border-emerald-500 cursor-pointer transition"
                                                >
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <p className="font-semibold">#{order.order_number}</p>
                                                            <p className="text-sm text-gray-500">
                                                                {new Date(order.created_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-emerald-600">
                                                                {order.total_amount.toLocaleString()} MMK
                                                            </p>
                                                            <span className="text-xs capitalize text-gray-500">
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {/* PASSWORD */}
                                {activeSection === 'password' && (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            updatePassword('/customer/profile/password', {
                                                onSuccess: reset,
                                            });
                                        }}
                                        className="space-y-6 max-w-md"
                                    >
                                        <h1 className="text-3xl font-bold">Change Password</h1>

                                        {['current_password', 'password', 'password_confirmation'].map(field => (
                                            <div key={field}>
                                                <Label className="capitalize text-gray-700">
                                                    {field.replace('_', ' ')}
                                                </Label>
                                                <Input
                                                    type="password"
                                                    value={(passwordData as any)[field]}
                                                    onChange={(e) => setPasswordData(field as any, e.target.value)}
                                                    className="mt-2"
                                                />
                                                {(passwordErrors as any)[field] && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {(passwordErrors as any)[field]}
                                                    </p>
                                                )}
                                            </div>
                                        ))}

                                        <Button
                                            disabled={passwordProcessing}
                                            className="bg-emerald-600 hover:bg-emerald-700"
                                        >
                                            Update Password
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </div>

           
        </>
    );
}

function StatCard({ label, value }: { label: string; value: any }) {
    return (
        <div className="rounded-xl border p-5 bg-emerald-50">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-emerald-700">{value}</p>
        </div>
    );
}
