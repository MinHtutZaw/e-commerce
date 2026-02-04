import { useState } from 'react'
import { router } from '@inertiajs/react'
import { toast } from 'sonner'

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']
const MIN_QUANTITY = 10

export default function CustomOrderModal({ isOpen, onClose, auth }) {
    const [step, setStep] = useState(1)
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const TOTAL_STEPS = 2

    const [form, setForm] = useState({
        customerType: '',
        gender: '',
        uniformType: '',
        notes: '',
        sizes: [{ size: '', quantity: '' }]
    })

    // Calculate total quantity
    const totalQuantity = form.sizes.reduce((sum, s) => sum + (parseInt(s.quantity) || 0), 0)

    // Get sizes summary for display
    const sizesSummary = form.sizes
        .filter(s => s.size && parseInt(s.quantity) > 0)
        .map(s => `${s.size}: ${s.quantity}`)
        .join(', ')

    if (!isOpen) return null

    const validateStep1 = () => {
        const newErrors = {}
        if (!form.customerType) newErrors.customerType = 'Customer type is required'
        if (!form.gender) newErrors.gender = 'Gender is required'

        // Check if at least one size has quantity
        const hasValidSize = form.sizes.some(s => s.size && parseInt(s.quantity) > 0)
        if (!hasValidSize) {
            newErrors.sizes = 'Please add at least one size with quantity'
        }

        // Check minimum total quantity
        if (totalQuantity < MIN_QUANTITY) {
            newErrors.minQuantity = `Minimum total quantity is ${MIN_QUANTITY} items. Current: ${totalQuantity}`
        }

        return newErrors
    }

    const nextStep = () => {
        if (step === 1) {
            const stepErrors = validateStep1()
            if (Object.keys(stepErrors).length > 0) {
                setErrors(stepErrors)
                if (stepErrors.minQuantity) {
                    toast.error(stepErrors.minQuantity)
                }
                return
            }
            setErrors({})
        }
        setStep((prev) => Math.min(prev + 1, 2))
    }

    const prevStep = () => {
        setErrors({})
        setStep((prev) => Math.max(prev - 1, 1))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Validate before submission
        const stepErrors = validateStep1()

        if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors)
            setStep(1)
            return
        }

        setSubmitting(true)

        // Filter sizes with valid data
        const sizesWithQuantity = form.sizes
            .filter(s => s.size && parseInt(s.quantity) > 0)
            .map(s => ({
                size: s.size,
                quantity: parseInt(s.quantity)
            }))

        // Submit form data to backend (user info comes from auth)
        router.post('/custom-orders', {
            customer_type: form.customerType,
            gender: form.gender,
            uniform_type: form.uniformType,
            sizes: sizesWithQuantity,
            notes: form.notes,
        }, {
            onSuccess: () => {
                toast.success('Custom order submitted successfully!', {
                    description: 'We will contact you soon with a quote.',
                    duration: 4000,
                })
                onClose()
                // Reset form
                setForm({
                    customerType: '',
                    gender: '',
                    uniformType: '',
                    notes: '',
                    sizes: [{ size: '', quantity: '' }]
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
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        }
    }

    const addSize = () => {
        setForm(prev => ({
            ...prev,
            sizes: [...prev.sizes, { size: '', quantity: '' }]
        }))
    }

    const removeSize = (index) => {
        if (form.sizes.length > 1) {
            setForm(prev => ({
                ...prev,
                sizes: prev.sizes.filter((_, i) => i !== index)
            }))
        }
    }

    const updateSize = (index, field, value) => {
        setForm(prev => ({
            ...prev,
            sizes: prev.sizes.map((s, i) =>
                i === index ? { ...s, [field]: value } : s
            )
        }))
        // Clear errors when updating sizes
        if (errors.sizes || errors.minQuantity) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors.sizes
                delete newErrors.minQuantity
                return newErrors
            })
        }
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
                {/* Header */}
                <div className="px-8 pt-8 pb-6 border-b border-gray-700 bg-gray-900/50">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Bulk Custom Order</h2>
                            <p className="text-sm text-gray-400 mt-1">Minimum {MIN_QUANTITY} items required</p>
                        </div>
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
                            className="absolute left-0 top-5 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300"
                         
                            style={{ width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
                            
                        />

                        {[1, 2].map((s) => (
                            <div key={s} className="relative z-10 flex flex-col items-center">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold text-sm transition-all duration-300 ${
                                        step >= s
                                            ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
                                            : 'border-gray-600 bg-gray-800 text-gray-400'
                                    }`}
                                >
                                    {s}
                                </div>
                                <span className={`mt-2 text-xs font-medium transition-colors ${step >= s ? 'text-white' : 'text-gray-500'}`}>
                                    {s === 1 && 'Order Info'}
                                    {s === 2 && 'Confirm'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-8 py-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {/* STEP 1: Order Info */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Order Information</h3>
                                <p className="text-sm text-gray-400">Tell us about your uniform requirements</p>
                            </div>

                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-300">
                                            Customer Type <span className="text-red-400">*</span>
                                        </label>
                                        <select
                                            value={form.customerType}
                                            className={`w-full rounded-lg bg-gray-800 border px-4 py-3 text-white transition-all focus:outline-none focus:ring-2 ${
                                                errors.customerType
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-700 focus:border-emerald-500 focus:ring-emerald-500'
                                            }`}
                                            onChange={(e) => updateForm('customerType', e.target.value)}
                                        >
                                            <option value="" className="bg-gray-800">Select Type</option>
                                            <option value="child" className="bg-gray-800">Child</option>
                                            <option value="adult" className="bg-gray-800">Adult</option>
                                        </select>
                                        {errors.customerType && <p className="mt-1 text-sm text-red-400">{errors.customerType}</p>}
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-300">
                                            Gender <span className="text-red-400">*</span>
                                        </label>
                                        <select
                                            value={form.gender}
                                            className={`w-full rounded-lg bg-gray-800 border px-4 py-3 text-white transition-all focus:outline-none focus:ring-2 ${
                                                errors.gender
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-700 focus:border-emerald-500 focus:ring-emerald-500'
                                            }`}
                                            onChange={(e) => updateForm('gender', e.target.value)}
                                        >
                                            <option value="" className="bg-gray-800">Select Gender</option>
                                            <option value="male" className="bg-gray-800">Male</option>
                                            <option value="female" className="bg-gray-800">Female</option>
                                            <option value="unisex" className="bg-gray-800">Unisex</option>
                                        </select>
                                        {errors.gender && <p className="mt-1 text-sm text-red-400">{errors.gender}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">
                                        Uniform Type
                                    </label>
                                    <input
                                        type="text"
                                        value={form.uniformType}
                                        placeholder="e.g. School Shirt, Pant, Blouse"
                                        className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500"
                                        onChange={(e) => updateForm('uniformType', e.target.value)}
                                    />
                                </div>

                                {/* Sizes Section */}
                                <div className="space-y-4 border-t border-gray-700 pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-lg font-semibold text-gray-300">Sizes & Quantities</label>
                                            <p className="text-sm text-gray-500">Minimum total: {MIN_QUANTITY} items</p>
                                        </div>
                                        <button
                                            type="button"
                                            className="text-emerald-500 hover:text-emerald-400 border border-emerald-600 hover:border-emerald-500 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                            onClick={addSize}
                                        >
                                            + Add Size
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {form.sizes.map((sizeItem, index) => (
                                            <div
                                                key={index}
                                                className="flex items-end gap-3 p-4 border border-gray-700 rounded-lg bg-gray-800/50"
                                            >
                                                {/* Size Dropdown */}
                                                <div className="flex-1">
                                                    <label className="text-xs text-gray-400 mb-1 block">Size</label>
                                                    <select
                                                        value={sizeItem.size}
                                                        onChange={(e) => updateSize(index, 'size', e.target.value)}
                                                        className="w-full rounded-lg bg-gray-700 border border-gray-600 px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    >
                                                        <option value="">Select</option>
                                                        {AVAILABLE_SIZES.map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Quantity */}
                                                <div className="flex-1">
                                                    <label className="text-xs text-gray-400 mb-1 block">Quantity</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={sizeItem.quantity}
                                                        onChange={(e) => updateSize(index, 'quantity', e.target.value)}
                                                        placeholder="0"
                                                        className="w-full rounded-lg bg-gray-700 border border-gray-600 px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    />
                                                </div>

                                                {/* Remove Button */}
                                                {form.sizes.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSize(index)}
                                                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-2.5 rounded-lg transition-colors"
                                                        title="Remove"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total Quantity Display */}
                                    <div className={`flex items-center justify-between p-3 rounded-lg ${
                                        totalQuantity >= MIN_QUANTITY 
                                            ? 'bg-emerald-900/30 border border-emerald-700/50' 
                                            : 'bg-red-900/30 border border-red-700/50'
                                    }`}>
                                        <span className="text-sm text-gray-300">Total Quantity:</span>
                                        <span className={`text-lg font-bold ${
                                            totalQuantity >= MIN_QUANTITY ? 'text-emerald-400' : 'text-red-400'
                                        }`}>
                                            {totalQuantity} / {MIN_QUANTITY} <span> Minium Qty required</span>
                                        </span>
                                    </div>

                                    {(errors.sizes || errors.minQuantity) && (
                                        <p className="text-sm text-red-400">{errors.sizes || errors.minQuantity}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">
                                        Additional Notes <span className="text-gray-500 text-xs">(Optional)</span>
                                    </label>
                                    <textarea
                                        value={form.notes}
                                        placeholder="Any special requirements, embroidery text, logo details..."
                                        rows="3"
                                        className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
                                        onChange={(e) => updateForm('notes', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Confirm */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Confirm Order</h3>
                                <p className="text-sm text-gray-400">Please review your order details before submitting</p>
                            </div>

                            <div className="space-y-4">
                                {/* Order Info */}
                                <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-5">
                                    <h4 className="text-sm font-semibold text-emerald-400 mb-4 uppercase tracking-wide">Order Details</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Customer Type:</span>
                                            <span className="text-white font-medium capitalize">{form.customerType}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Gender:</span>
                                            <span className="text-white font-medium capitalize">{form.gender}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Uniform Type:</span>
                                            <span className="text-white font-medium">{form.uniformType || 'Not specified'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Sizes:</span>
                                            <span className="text-white font-medium">{sizesSummary || 'Not specified'}</span>
                                        </div>
                                        <div className="flex justify-between border-t border-gray-700 pt-3">
                                            <span className="text-gray-400">Total Pieces:</span>
                                            <span className="text-emerald-400 font-bold text-lg">{totalQuantity}</span>
                                        </div>
                                        {form.notes && (
                                            <div className="pt-2 border-t border-gray-700">
                                                <span className="text-gray-400 block mb-1">Notes:</span>
                                                <span className="text-white">{form.notes}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Info Box */}
                                <div className="rounded-lg bg-emerald-900/30 border border-emerald-700/50 p-4">
                                    <p className="text-sm text-emerald-300">
                                        <strong>What happens next?</strong> Our team will review your order and contact you within 24-48 hours with a price quote.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-gray-700 bg-gray-900/50 flex justify-between gap-4">
                    <button
                        type="button"
                        onClick={step === 1 ? onClose : prevStep}
                        className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 font-medium transition-all hover:bg-gray-800 hover:border-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>

                    {step < 2 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            disabled={totalQuantity < MIN_QUANTITY}
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium transition-all hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium transition-all hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
        </div>
    )
}
