import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import {  register } from '@/routes';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { LoaderCircle, LogIn } from 'lucide-react';

import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/Components/common/Navbar';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface LoginProps {
    canResetPassword: boolean;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Login({ canResetPassword, flash }: LoginProps) {
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <>
            <Navbar />
            <div className="flex min-h-svh">
                <Head title="Log in" />

                {/* Left: branding */}
                <div className="hidden w-full flex-col justify-between bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-800 p-8 text-white lg:flex lg:max-w-[480px] xl:max-w-[520px]">
                    <div />
                    <div className="space-y-6">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                            <LogIn className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight xl:text-3xl">
                            Welcome back
                        </h2>
                        <p className="max-w-sm text-emerald-50/90 text-sm leading-relaxed">
                            Log in to your EduFit account to manage orders and track your purchases.
                        </p>
                    </div>
                    <p className="text-xs text-emerald-100/80">
                        © {new Date().getFullYear()} EduFit. All rights reserved.
                    </p>
                </div>

                {/* Right: form */}
                <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">
                    <div className="mx-auto w-full max-w-sm lg:max-w-md">
                        {/* Mobile logo */}
                        <div className="mb-8 flex justify-center lg:hidden">
                            <Link href={"/"} className="inline-flex items-center gap-2">
                                <AppLogoIcon className="size-10" />
                                <span className="font-semibold">EduFit</span>
                            </Link>
                        </div>

                        <div className="mb-8">
                            <h1 className="text-xl font-semibold lg:text-2xl">
                                Log in to your account
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Enter your email and password below.
                            </p>
                        </div>

                        <Form
                            {...AuthenticatedSessionController.store.form()}
                            resetOnSuccess={['password']}
                            className="flex flex-col gap-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-5">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                autoComplete="email"
                                                placeholder="email@example.com"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="grid gap-2">
                                            <div className="flex items-center">
                                                <Label htmlFor="password">Password</Label>
                                                {canResetPassword && (
                                                    <TextLink href="/forgot-password" className="ml-auto text-sm">
                                                        Forgot password?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                autoComplete="current-password"
                                                placeholder="Password"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Checkbox id="remember" name="remember" />
                                            <Label htmlFor="remember">Remember me</Label>
                                        </div>
                                    </div>

                                    <Button type="submit" className="mt-2 w-full">
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Log in
                                    </Button>

                                    <p className="text-center text-sm text-muted-foreground">
                                        Don’t have an account?{' '}
                                        <TextLink href={register()}>
                                            Sign up
                                        </TextLink>
                                    </p>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}
