import { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import { toast } from 'sonner'

export default function CustomOrderModal({ isOpen, onClose, auth }) {
    const [step, setStep] = useState(1)
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    const [form, setForm] = useState({
        customerType: '',
        gender: '',
        uniformType: '',
        notes: '',
        name: auth?.user?.name || '',
        email: auth?.user?.email || '',
        phone: '',
        address: '',
        sizes: {
            small: '',
            medium: '',
            large: ''
        }
    })

    // Update form when auth changes
    useEffect(() => {
        if (auth?.user) {
            setForm(prev => ({
                ...prev,
                name: auth.user.name || '',
                email: auth.user.email || '',
            }))
        }
    }, [auth])

    if (!isOpen) return null

    const validateStep1 = () => {
        const newErrors = {}
        if (!form.name.trim()) newErrors.name = 'Full name is required'
        if (!form.email.trim()) newErrors.email = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email format'
        if (!form.phone.trim()) newErrors.phone = 'Phone number is required'
        if (!form.address.trim()) newErrors.address = 'Delivery address is required'
        return newErrors
    }

    const validateStep2 = () => {
        const newErrors = {}
        if (!form.customerType) newErrors.customerType = 'Customer type is required'
        if (!form.gender) newErrors.gender = 'Gender is required'
        return newErrors
    }

    const nextStep = () => {
        if (step === 1) {
            const stepErrors = validateStep1()
            if (Object.keys(stepErrors).length > 0) {
                setErrors(stepErrors)
                return
            }
            setErrors({})
        } else if (step === 2) {
            const stepErrors = validateStep2()
            if (Object.keys(stepErrors).length > 0) {
                setErrors(stepErrors)
                return
            }
            setErrors({})
        }
        setStep((prev) => Math.min(prev + 1, 3))
    }

    const prevStep = () => {
        setErrors({})
        setStep((prev) => Math.max(prev - 1, 1))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // Validate all steps before submission
        const step1Errors = validateStep1()
        const step2Errors = validateStep2()
        const allErrors = { ...step1Errors, ...step2Errors }

        if (Object.keys(allErrors).length > 0) {
            setErrors(allErrors)
            setStep(1) // Go back to first step with errors
            return
        }

        setSubmitting(true)

        // Submit form data to backend
        router.post('/custom-orders', {
            customer_name: form.name,
            customer_email: form.email,
            customer_phone: form.phone,
            delivery_address: form.address,
            customer_type: form.customerType,
            gender: form.gender,
            uniform_type: form.uniformType,
            size_small_quantity: parseInt(form.sizes.small) || 0,
            size_medium_quantity: parseInt(form.sizes.medium) || 0,
            size_large_quantity: parseInt(form.sizes.large) || 0,
            notes: form.notes,
        }, {
            onSuccess: () => {
                toast.success('Custom order submitted successfully!', {
                    description: 'We will contact you soon with a quote.',
                    duration: 4000,
                })
                onClose()
                // Reset form (keep user name and email)
                setForm({
                    customerType: '',
                    gender: '',
                    uniformType: '',
                    notes: '',
                    name: auth?.user?.name || '',
                    email: auth?.user?.email || '',
                    phone: '',
                    address: '',
                    sizes: {
                        small: '',
                        medium: '',
                        large: ''
                    }
                })
                setStep(1)
                setSubmitting(false)
            },
            onError: (errors) => {
                console.error('Submission error:', errors)
                toast.error('Failed to submit order', {
                    description: 'Please check the form and try again.',
                })
                setSubmitting(false)
            },
        })
    }

    const updateForm = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        }
    }

    const updateSizes = (size, value) => {
        setForm(prev => ({
            ...prev,
            sizes: { ...prev.sizes, [size]: value }
        }))
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-3xl max-h-[90vh] rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl border border-gray-700 flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Fixed */}
                <div className="px-8 pt-8 pb-6 border-b border-gray-700 bg-gray-900/50">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Custom Order</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
                            aria-label="Close"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Step Indicator */}
                    <div className="relative flex justify-between">
                        <div className="absolute left-0 top-5 h-0.5 w-full bg-gray-700" />
                        <div
                            className="absolute left-0 top-5 h-0.5 bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"
                            style={{ width: `${((step - 1) / 2) * 100}%` }}
                        />

                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className="relative z-10 flex flex-col items-center"
                            >
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold text-sm transition-all duration-300 ${step >= s
                                            ? 'border-purple-500 bg-purple-500 text-white shadow-lg shadow-purple-500/50'
                                            : 'border-gray-600 bg-gray-800 text-gray-400'
                                        }`}
                                >
                                    {s}
                                </div>
                                <span
                                    className={`mt-2 text-xs font-medium transition-colors ${step >= s ? 'text-white' : 'text-gray-500'
                                        }`}
                                >
                                    {s === 1 && 'Customer'}
                                    {s === 2 && 'Order Info'}
                                    {s === 3 && 'Confirm'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-6">
                    {/* STEP 1 */}
                    {step === 1 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Customer Details</h3>
                                <p className="text-sm text-gray-400">Please provide your contact information</p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">
                                        Full Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        placeholder="Enter your full name"
                                        className={`w-full rounded-lg bg-gray-800 border px-4 py-3 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 ${errors.name
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500'
                                            }`}
                                        onChange={(e) => updateForm('name', e.target.value)}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">
                                        Email <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        placeholder="your.email@example.com"
                                        className={`w-full rounded-lg bg-gray-800 border px-4 py-3 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 ${errors.email
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500'
                                            }`}
                                        onChange={(e) => updateForm('email', e.target.value)}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">
                                        Phone <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        placeholder="Enter your phone number"
                                        className={`w-full rounded-lg bg-gray-800 border px-4 py-3 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 ${errors.phone
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500'
                                            }`}
                                        onChange={(e) => updateForm('phone', e.target.value)}
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">
                                        Delivery Address <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        value={form.address}
                                        placeholder="Enter your complete delivery address"
                                        rows="3"
                                        className={`w-full rounded-lg bg-gray-800 border px-4 py-3 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 resize-none ${errors.address
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500'
                                            }`}
                                        onChange={(e) => updateForm('address', e.target.value)}
                                    />
                                    {errors.address && (
                                        <p className="mt-1 text-sm text-red-400">{errors.address}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Order Information</h3>
                                <p className="text-sm text-gray-400">Tell us about your uniform requirements</p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">
                                        Customer Type <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        value={form.customerType}
                                        className={`w-full rounded-lg bg-gray-800 border px-4 py-3 text-white transition-all focus:outline-none focus:ring-2 ${errors.customerType
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500'
                                            }`}
                                        onChange={(e) => updateForm('customerType', e.target.value)}
                                    >
                                        <option value="" className="bg-gray-800">Select Customer Type</option>
                                        <option value="child" className="bg-gray-800">Child</option>
                                        <option value="adult" className="bg-gray-800">Adult</option>
                                    </select>
                                    {errors.customerType && (
                                        <p className="mt-1 text-sm text-red-400">{errors.customerType}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">
                                        Gender <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        value={form.gender}
                                        className={`w-full rounded-lg bg-gray-800 border px-4 py-3 text-white transition-all focus:outline-none focus:ring-2 ${errors.gender
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500'
                                            }`}
                                        onChange={(e) => updateForm('gender', e.target.value)}
                                    >
                                        <option value="" className="bg-gray-800">Select Gender</option>
                                        <option value="male" className="bg-gray-800">Male</option>
                                        <option value="female" className="bg-gray-800">Female</option>
                                        <option value="unisex" className="bg-gray-800">Unisex</option>
                                    </select>
                                    {errors.gender && (
                                        <p className="mt-1 text-sm text-red-400">{errors.gender}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">
                                        Uniform Type
                                    </label>
                                    <input
                                        type="text"
                                        value={form.uniformType}
                                        placeholder="e.g. School Shirt, Pant, Blouse"
                                        className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:border-purple-500 focus:ring-purple-500"
                                        onChange={(e) => updateForm('uniformType', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">
                                        Quantities by Size
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['small', 'medium', 'large'].map((size) => (
                                            <div key={size}>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder={size.charAt(0).toUpperCase() + size.slice(1)}
                                                    value={form.sizes[size] || ''}
                                                    className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:border-purple-500 focus:ring-purple-500"
                                                    onChange={(e) => updateSizes(size, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">
                                        Additional Notes <span className="text-gray-500 text-xs">(Optional)</span>
                                    </label>
                                    <textarea
                                        value={form.notes}
                                        placeholder="Any special requirements or notes..."
                                        rows="4"
                                        className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:border-purple-500 focus:ring-purple-500 resize-none"
                                        onChange={(e) => updateForm('notes', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Confirm Order</h3>
                                <p className="text-sm text-gray-400">Please review your order details before submitting</p>
                            </div>

                            <div className="space-y-4">
                                {/* Customer Info */}
                                {/* <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-5">
                                    <h4 className="text-sm font-semibold text-purple-400 mb-4 uppercase tracking-wide">Customer Information</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Name:</span>
                                            <span className="text-white font-medium">{form.name || 'Not provided'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Email:</span>
                                            <span className="text-white font-medium">{form.email || 'Not provided'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Phone:</span>
                                            <span className="text-white font-medium">{form.phone || 'Not provided'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Address:</span>
                                            <span className="text-white font-medium text-right max-w-xs">{form.address || 'Not provided'}</span>
                                        </div>
                                    </div>
                                </div> */}

                                {/* Order Info */}
                                <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-5">
                                    <h4 className="text-sm font-semibold text-purple-400 mb-4 uppercase tracking-wide">Order Details</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Customer Type:</span>
                                            <span className="text-white font-medium capitalize">{form.customerType || 'Not specified'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Gender:</span>
                                            <span className="text-white font-medium capitalize">{form.gender || 'Not specified'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Uniform Type:</span>
                                            <span className="text-white font-medium">{form.uniformType || 'Not specified'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Quantities:</span>
                                            <span className="text-white font-medium">
                                                {form.sizes?.small || form.sizes?.medium || form.sizes?.large
                                                    ? `S: ${form.sizes.small || 0}, M: ${form.sizes.medium || 0}, L: ${form.sizes.large || 0}`
                                                    : 'Not specified'
                                                }
                                            </span>
                                        </div>
                                        {form.notes && (
                                            <div className="pt-2 border-t border-gray-700">
                                                <span className="text-gray-400 block mb-1">Notes:</span>
                                                <span className="text-white">{form.notes}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer - Fixed */}
                <div className="px-8 py-6 border-t border-gray-700 bg-gray-900/50 flex justify-between gap-4">
                    <button
                        type="button"
                        onClick={step === 1 ? onClose : prevStep}
                        className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 font-medium transition-all hover:bg-gray-800 hover:border-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium transition-all hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg shadow-purple-500/30"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white font-medium transition-all hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Order'
                            )}
                        </button>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                
                
                .no-scrollbar {
                    scrollbar-width: none;        
                    -ms-overflow-style: none;     
                }

                
            `}</style>
        </div>
    )
}
