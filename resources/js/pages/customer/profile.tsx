import { useState, useEffect } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import Navbar from '@/Components/common/Navbar';
import Footer from '@/Components/common/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, ShoppingBag, Lock, LogOut, Camera } from 'lucide-react';
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
    const [activeSection, setActiveSection] = useState<'profile' | 'orders' | 'password'>('profile');
    
    // Profile form
    const { data: profileData, setData: setProfileData, post: updateProfile, processing: profileProcessing, errors: profileErrors } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
    });

    // Password form
    const { data: passwordData, setData: setPasswordData, post: updatePassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile('/customer/profile/update', {
            onSuccess: () => {
                toast.success('Profile updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update profile');
            },
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updatePassword('/customer/profile/password', {
            onSuccess: () => {
                toast.success('Password updated successfully!');
                resetPassword();
            },
            onError: () => {
                toast.error('Failed to update password');
            },
        });
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <>
            <Head title="My Profile" />
            <Navbar />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar */}
                        <div className="lg:w-64 flex-shrink-0">
                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 sticky top-8">
                                <nav className="space-y-2">
                                    <button
                                        onClick={() => setActiveSection('profile')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                            activeSection === 'profile'
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                                                : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
                                        }`}
                                    >
                                        <User className="w-5 h-5" />
                                        <span className="font-medium">My Profile</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveSection('orders')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                            activeSection === 'orders'
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                                                : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
                                        }`}
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        <span className="font-medium">My Orders</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveSection('password')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                            activeSection === 'password'
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                                                : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
                                        }`}
                                    >
                                        <Lock className="w-5 h-5" />
                                        <span className="font-medium">Password</span>
                                    </button>

                                    <div className="pt-4 border-t border-slate-700/50">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </div>
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
                                {/* Profile Section */}
                                {activeSection === 'profile' && (
                                    <div className="space-y-8">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h1 className="text-3xl font-bold text-white mb-2">Edit Profile</h1>
                                                <p className="text-gray-400">Manage your account information</p>
                                            </div>
                                            <div className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                                                <span className="text-lg">👑</span>
                                                Premium User
                                            </div>
                                        </div>

                                        {/* Avatar Section */}
                                        <div className="flex items-center gap-6 pb-8 border-b border-slate-700/50">
                                            <div className="relative">
                                                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors">
                                                    <Camera className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                                                <p className="text-gray-400">Member since {new Date(user.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        {/* Profile Form */}
                                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                                            <div>
                                                <Label htmlFor="name" className="text-gray-300">Name</Label>
                                                <Input
                                                    id="name"
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData('name', e.target.value)}
                                                    className="mt-2 bg-slate-700/50 border-slate-600 text-white focus:border-blue-500"
                                                    required
                                                />
                                                {profileErrors.name && <p className="text-red-400 text-sm mt-1">{profileErrors.name}</p>}
                                            </div>

                                            <div>
                                                <Label htmlFor="email" className="text-gray-300">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={profileData.email}
                                                    onChange={(e) => setProfileData('email', e.target.value)}
                                                    className="mt-2 bg-slate-700/50 border-slate-600 text-white focus:border-blue-500"
                                                    required
                                                />
                                                {profileErrors.email && <p className="text-red-400 text-sm mt-1">{profileErrors.email}</p>}
                                            </div>

                                            <div>
                                                <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                                                <Input
                                                    id="phone"
                                                    value={profileData.phone}
                                                    onChange={(e) => setProfileData('phone', e.target.value)}
                                                    className="mt-2 bg-slate-700/50 border-slate-600 text-white focus:border-blue-500"
                                                    placeholder="Optional"
                                                />
                                                {profileErrors.phone && <p className="text-red-400 text-sm mt-1">{profileErrors.phone}</p>}
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={profileProcessing}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                                            >
                                                {profileProcessing ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                        </form>

                                        {/* Stats */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-slate-700/50">
                                            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
                                                <p className="text-gray-400 text-sm mb-1">Total Orders</p>
                                                <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30">
                                                <p className="text-gray-400 text-sm mb-1">Pending Orders</p>
                                                <p className="text-3xl font-bold text-white">{stats.pendingOrders}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
                                                <p className="text-gray-400 text-sm mb-1">Total Spent</p>
                                                <p className="text-3xl font-bold text-white">{stats.totalSpent.toLocaleString()} MMK</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Orders Section */}
                                {activeSection === 'orders' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h1 className="text-3xl font-bold text-white mb-2">My Orders</h1>
                                            <p className="text-gray-400">View and track your orders</p>
                                        </div>

                                        {recentOrders.length === 0 ? (
                                            <div className="text-center py-12">
                                                <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                                <p className="text-gray-400 text-lg">No orders yet</p>
                                                <Button
                                                    onClick={() => router.visit('/products')}
                                                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                                                >
                                                    Start Shopping
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {recentOrders.map((order) => (
                                                    <div
                                                        key={order.id}
                                                        className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50 hover:border-blue-500/50 transition-colors cursor-pointer"
                                                        onClick={() => router.visit(`/orders/${order.id}`)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-white font-semibold mb-1">Order #{order.order_number}</p>
                                                                <p className="text-gray-400 text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-white font-bold text-lg">{order.total_amount.toLocaleString()} MMK</p>
                                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                                                    order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                                                                    order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                    'bg-blue-500/20 text-blue-400'
                                                                }`}>
                                                                    {order.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                <Button
                                                    onClick={() => router.visit('/customer/orders')}
                                                    className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
                                                >
                                                    View All Orders
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Password Section */}
                                {activeSection === 'password' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h1 className="text-3xl font-bold text-white mb-2">Change Password</h1>
                                            <p className="text-gray-400">Update your password to keep your account secure</p>
                                        </div>

                                        <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                                            <div>
                                                <Label htmlFor="current_password" className="text-gray-300">Current Password</Label>
                                                <Input
                                                    id="current_password"
                                                    type="password"
                                                    value={passwordData.current_password}
                                                    onChange={(e) => setPasswordData('current_password', e.target.value)}
                                                    className="mt-2 bg-slate-700/50 border-slate-600 text-white focus:border-blue-500"
                                                    required
                                                />
                                                {passwordErrors.current_password && <p className="text-red-400 text-sm mt-1">{passwordErrors.current_password}</p>}
                                            </div>

                                            <div>
                                                <Label htmlFor="password" className="text-gray-300">New Password</Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={passwordData.password}
                                                    onChange={(e) => setPasswordData('password', e.target.value)}
                                                    className="mt-2 bg-slate-700/50 border-slate-600 text-white focus:border-blue-500"
                                                    required
                                                />
                                                {passwordErrors.password && <p className="text-red-400 text-sm mt-1">{passwordErrors.password}</p>}
                                            </div>

                                            <div>
                                                <Label htmlFor="password_confirmation" className="text-gray-300">Confirm New Password</Label>
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    value={passwordData.password_confirmation}
                                                    onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                                    className="mt-2 bg-slate-700/50 border-slate-600 text-white focus:border-blue-500"
                                                    required
                                                />
                                                {passwordErrors.password_confirmation && <p className="text-red-400 text-sm mt-1">{passwordErrors.password_confirmation}</p>}
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={passwordProcessing}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                                            >
                                                {passwordProcessing ? 'Updating...' : 'Update Password'}
                                            </Button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
