import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { home, login } from '@/routes';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle, UserPlus } from 'lucide-react';

import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Register() {
    return (
        <div className="flex min-h-svh">
            <Head title="Register" />

            {/* Left: branding */}
            <div className="hidden w-full flex-col justify-between bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-800 p-8 text-white lg:flex lg:max-w-[480px] xl:max-w-[520px]">
                <Link href={home()} className="inline-flex items-center gap-2">
                    <AppLogoIcon className="size-20 fill-white " />
                    <span className="font-semibold text-white">EduFit</span>
                </Link>
                <div className="space-y-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                        <UserPlus className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight xl:text-3xl">
                        Create your account
                    </h2>
                    <p className="max-w-sm text-emerald-50/90 text-sm leading-relaxed">
                        Join EduFit to order quality school and university uniforms. Enter your details on the right to get started.
                    </p>
                </div>
                <p className="text-xs text-emerald-100/80">
                    © {new Date().getFullYear()} EduFit. All rights reserved.
                </p>
            </div>

            {/* Right: form */}
            <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">
                <div className="mx-auto w-full max-w-sm lg:max-w-md">
                    <div className="lg:hidden mb-8 flex justify-center">
                        <Link href={home()} className="inline-flex items-center gap-2">
                            <AppLogoIcon className="size-10 fill-current text-[var(--foreground)]" />
                            <span className="font-semibold">EduFit</span>
                        </Link>
                    </div>
                    <div className="mb-8">
                        <h1 className="text-xl font-semibold text-foreground lg:text-2xl">Create an account</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Enter your details below to register.</p>
                    </div>

                    <Form
                        {...RegisteredUserController.store.form()}
                        resetOnSuccess={['password', 'password_confirmation']}
                        disableWhileProcessing
                        className="flex flex-col gap-5"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            name="name"
                                            placeholder="Full name"
                                        />
                                        <InputError message={errors.name} className="mt-1" />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="email">Email address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            name="email"
                                            placeholder="email@example.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            tabIndex={3}
                                            autoComplete="tel"
                                            name="phone"
                                            placeholder="e.g. 09 123 456 789"
                                        />
                                        <InputError message={errors.phone} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            type="text"
                                            tabIndex={4}
                                            autoComplete="street-address"
                                            name="address"
                                            placeholder="Address"
                                        />
                                        <InputError message={errors.address} />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            tabIndex={5}
                                            autoComplete="new-password"
                                            name="password"
                                            placeholder="Password"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="password_confirmation">Confirm password</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            required
                                            tabIndex={6}
                                            autoComplete="new-password"
                                            name="password_confirmation"
                                            placeholder="Confirm password"
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                </div>

                                <Button type="submit" className="mt-2 w-full" tabIndex={7} data-test="register-user-button">
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Create account
                                </Button>

                                <p className="text-center text-sm text-muted-foreground">
                                    Already have an account?{' '}
                                    <TextLink href={login()} tabIndex={8}>
                                        Log in
                                    </TextLink>
                                </p>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </div>
    );
}
