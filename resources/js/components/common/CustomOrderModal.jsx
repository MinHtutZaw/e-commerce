import { useState } from 'react'

export default function CustomOrderModal({ isOpen, onClose }) {
    const [step, setStep] = useState(1)

    const [form, setForm] = useState({
        uniformType: '',
        quantity: '',
        notes: '',
        name: '',
        email: '',
        phone: '',
        address: '',
    })

    if (!isOpen) return null

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 3))
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 ">
            <div className="w-full max-w-2xl rounded-xl bg-[#0b0b0b] p-10 text-white">

                {/* Step Indicator */}
                <div className="relative mb-10 flex justify-between">
                    {/* Connecting line */}
                    <div className="absolute left-0 top-4 h-[2px] w-full bg-gray-700" />

                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className="relative z-10 flex flex-col items-center text-center w-full"
                        >
                            <div
                                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 font-semibold
                ${step >= s
                                        ? 'border-purple-500 text-purple-500 bg-purple-500/10'
                                        : 'border-gray-600 text-gray-400'
                                    }`}
                            >
                                0{s}
                            </div>

                            <span
                                className={`mt-2 text-sm
                ${step >= s ? 'text-white' : 'text-gray-500'}`}
                            >
                                {s === 1 && 'Customer'}
                                {s === 2 && 'Order Info'}
                                {s === 3 && 'Confirm'}
                            </span>
                        </div>
                    ))}
                </div>


                {/* STEP 1 */}
                {step === 1 && (
                    <>
                        <h2 className="mb-4 text-xl font-semibold">Customer Details</h2>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full rounded bg-gray-900 p-3"
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full rounded bg-gray-900 p-3"
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Phone"
                                className="w-full rounded bg-gray-900 p-3"
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Delivery Address"
                                className="w-full rounded bg-gray-900 p-3"
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                            />
                        </div>
                    </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <>
                        <h2 className="mb-4 text-xl font-semibold">Custom Order Information</h2>

                        <div className="space-y-4">

                            {/* Age Group */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">Age Group</label>
                                <select
                                    className="w-full rounded bg-gray-900 p-3"
                                    onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}
                                >
                                    <option value="">Select Age Group</option>
                                    <option value="child">Child</option>
                                    <option value="adult">Adult</option>
                                </select>
                            </div>

                            {/* Clothing Type */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">Uniform Type</label>
                                <input
                                    type="text"
                                    placeholder="e.g. School Shirt, Pant, Blouse"
                                    className="w-full rounded bg-gray-900 p-3"
                                    onChange={(e) => setForm({ ...form, uniformType: e.target.value })}
                                />
                            </div>

                            {/* School Type */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">School Type</label>
                                <select
                                    className="w-full rounded bg-gray-900 p-3"
                                    onChange={(e) => setForm({ ...form, schoolType: e.target.value })}
                                >
                                    <option value="">Select School Type</option>
                                    <option value="private">Private</option>
                                    <option value="tu">TU</option>
                                    <option value="government">Government</option>
                                </select>
                            </div>

                            {/* Quantity per Size */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">Quantities by Size</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Small"
                                            className="w-full rounded bg-gray-900 p-3"
                                            onChange={(e) => setForm({ ...form, sizes: { ...form.sizes, small: e.target.value } })}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Medium"
                                            className="w-full rounded bg-gray-900 p-3"
                                            onChange={(e) => setForm({ ...form, sizes: { ...form.sizes, medium: e.target.value } })}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Large"
                                            className="w-full rounded bg-gray-900 p-3"
                                            onChange={(e) => setForm({ ...form, sizes: { ...form.sizes, large: e.target.value } })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Additional Notes */}
                            <div>
                                <textarea
                                    placeholder="Additional notes"
                                    className="w-full rounded bg-gray-900 p-3"
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                />
                            </div>

                        </div>
                    </>
                )}


                {/* STEP 3 */}
                {step === 3 && (
                    <>
                        <h2 className="mb-4 text-xl font-semibold">Confirm Order</h2>

                        <div className="space-y-2 text-gray-300">
                            <p><strong>Uniform:</strong> {form.uniformType}</p>
                            <p><strong>Quantity:</strong> {form.quantity}</p>
                            <p><strong>Name:</strong> {form.name}</p>
                            <p><strong>Email:</strong> {form.email}</p>
                        </div>
                    </>
                )}

                {/* Buttons */}
                <div className="mt-8 flex justify-between">
                    <button
                        onClick={step === 1 ? onClose : prevStep}
                        className="rounded border border-gray-600 px-6 py-2"
                    >
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={nextStep}
                            className="rounded bg-purple-600 px-6 py-2"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            className="rounded bg-purple-600 px-6 py-2"
                        >
                            Submit
                        </button>
                    )}
                </div>

            </div>
        </div>
    )
}
