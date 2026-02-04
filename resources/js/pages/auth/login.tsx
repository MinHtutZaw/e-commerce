import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { flash } = usePage<LoginProps>().props;

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, {
                duration: 4000,
            });
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);
    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in"  >
            <Head title="Log in" />

            <Form {...AuthenticatedSessionController.store.form()} resetOnSuccess={['password']} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email" >Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    className="bg-white/10 text-white placeholder:text-white/50"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center text-white/80">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <TextLink href={request()} className="ml-auto text-sm text-white/80" tabIndex={5}>
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    className="bg-white/10 text-white placeholder:text-white/50"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox id="remember" name="remember" tabIndex={3} />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>

                            <Button type="submit" className="mt-4 w-full bg-white text-emerald-700 hover:bg-white/90 hover:text-emerald-700" tabIndex={4} disabled={processing} data-test="login-button">
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Log in
                            </Button>
                        </div>

                        <div className="text-center text-sm  text-white/80">
                            Don't have an account?{' '}
                            <TextLink href={register()} tabIndex={5} className="text-white/80">
                                Sign up
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
