// Components
import PasswordResetLinkController from '@/actions/App/Http/Controllers/Auth/PasswordResetLinkController'
import { login } from '@/routes'
import { Form, Head } from '@inertiajs/react'
import { LoaderCircle, Mail } from 'lucide-react'

import InputError from '@/components/input-error'
import TextLink from '@/components/text-link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AuthLayout from '@/layouts/auth-layout'
import Navbar from '@/Components/common/Navbar'

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Navbar />

            <AuthLayout
                title="Forgot your password?"
                description="No worries. Enter your email and we’ll send you a reset link."
            >
                <Head title="Forgot Password" />

                {/* Success message */}
                {status && (
                    <div className="mb-6 rounded-md bg-emerald-100 px-4 py-3 text-center text-sm font-medium text-emerald-700">
                        {status}
                    </div>
                )}

                <Form {...PasswordResetLinkController.store.form()}>
                    {({ processing, errors }) => (
                        <div className="space-y-6">
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white">
                                    Email address
                                </Label>

                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="email@example.com"
                                        autoFocus
                                        autoComplete="off"
                                        className="pl-10 bg-white/10 text-white placeholder:text-white/50 border-white/20 focus:border-emerald-400 focus:ring-emerald-400"
                                    />
                                </div>

                                <InputError message={errors.email} />
                            </div>

                            {/* Submit */}
                            <Button
                                className="w-full bg-white text-emerald-700 hover:bg-white/90"
                                disabled={processing}
                            >
                                {processing && (
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Send reset link
                            </Button>

                            {/* Back to login */}
                            <div className="border-t border-white/10 pt-4 text-center text-sm">
                                <span className="text-white/70">Remembered your password?</span>{' '}
                                <TextLink href={login()} className="text-white hover:underline">
                                    Log in
                                </TextLink>
                            </div>
                        </div>
                    )}
                </Form>
            </AuthLayout>
        </>
    )
}
