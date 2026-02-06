import { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { toast } from 'sonner'

const BASE_PRICE = {
    child: 5000,
    adult: 8000,
}

const FABRIC_PRICE = {
    Cotton: 2000,
    Polyester: 1500,
    'Dry-fit': 3000,
}

export default function CustomOrderModal({ isOpen, onClose, auth }) {
    const [step, setStep] = useState(1)
    const TOTAL_STEPS = 3

    const { data, setData, post, processing, reset } = useForm({
        customer_type: '',
        fabric_type: '',
        uniform_type: '',
        notes: '',
        waist: '',
        hip: '',
        height: '',
        quantity: '1',
    })

    if (!isOpen) return null

    /* ------------------ PRICE CALCULATION ------------------ */
    const basePrice = data.customer_type ? BASE_PRICE[data.customer_type] : 0
    const fabricPrice = data.fabric_type ? FABRIC_PRICE[data.fabric_type] : 0
    const unitPrice = basePrice + fabricPrice
    const totalPrice = unitPrice * (Number(data.quantity) || 0)

    /* ------------------ NAVIGATION ------------------ */
    const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS))
    const prevStep = () => setStep(s => Math.max(s - 1, 1))

    /* ------------------ SUBMIT ------------------ */
    const handleSubmit = (e) => {
        if (e) e.preventDefault()
            post('/custom-orders', {
                onSuccess: () => {
                  toast.success('Custom order submitted successfully!')
                  reset()
                  setStep(1)
                  onClose()
                },
                onError: (errors) => {
                  toast.error(Object.values(errors).flat().join(', '))
                }
              })
              

    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div
                className={`w-full max-w-3xl rounded-xl bg-white shadow-xl flex flex-col
          ${step === 1 ? 'max-h-auto' : 'h-full max-h-[90vh]'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="border-b px-6 py-4 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-lg font-semibold">
                        Custom Order ({step}/{TOTAL_STEPS})
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black">
                        ✕
                    </button>
                </div>

                {/* FORM CONTENT */}
                <form
                    onSubmit={handleSubmit}
                    className={`flex-1 p-6 space-y-6
                     ${step === 1 ? 'overflow-visible' : 'overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'}`}
                >
                    {/* STEP 1 — CUSTOMER INFO */}
                    {step === 1 && (
                        <>
                            <h3 className="text-lg font-semibold">Customer Information</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <Info label="Name" value={auth.user.name} />
                                <Info label="Email" value={auth.user.email} />
                                <Info label="Phone" value={auth.user.phone || '—'} />
                                <Info label="Address" value={auth.user.address || '—'} />
                            </div>
                        </>
                    )}

                    {/* STEP 2 — ORDER DETAILS */}
                    {step === 2 && (
                        <>
                            <h3 className="text-lg font-semibold">Order Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <Select
                                    label="Customer Type"
                                    value={data.customer_type}
                                    onChange={e => setData('customer_type', e.target.value)}
                                    options={['child', 'adult']}
                                />
                                <Select
                                    label="Fabric"
                                    value={data.fabric_type}
                                    onChange={e => setData('fabric_type', e.target.value)}
                                    options={Object.keys(FABRIC_PRICE)}
                                />
                                <Input
                                    label="Uniform Type"
                                    value={data.uniform_type}
                                    onChange={e => setData('uniform_type', e.target.value)}
                                />
                                <Input
                                    label="Waist (cm)"
                                    value={data.waist}
                                    onChange={e => setData('waist', e.target.value)}
                                />
                                <Input
                                    label="Hip (cm)"
                                    value={data.hip}
                                    onChange={e => setData('hip', e.target.value)}
                                />
                                <Input
                                    label="Height (cm)"
                                    value={data.height}
                                    onChange={e => setData('height', e.target.value)}
                                />
                                <Input
                                    label="Quantity"
                                    type="number"
                                    min="1"
                                    value={data.quantity}
                                    onChange={e => setData('quantity', e.target.value)}

                                />


                                <Input
                                    label="Notes"
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                />
                            </div>

                            {/* PRICE PREVIEW */}
                            <div className="mt-4 rounded-lg border p-4 bg-gray-50 text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span>Base Price</span>
                                    <span>{basePrice} MMK</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Fabric Price</span>
                                    <span>{fabricPrice} MMK</span>
                                </div>
                                <div className="flex justify-between font-semibold border-t pt-2">
                                    <span>Total</span>
                                    <span>{totalPrice} MMK</span>
                                </div>
                            </div>
                        </>
                    )}

                    {/* STEP 3 — CONFIRM */}
                    {step === 3 && (
                        <>
                            <h3 className="text-lg font-semibold">Confirm Order</h3>

                            <Summary title="Customer">
                                <SummaryRow label="Name" value={auth.user.name} />
                                <SummaryRow label="Address" value={auth.user.address || '—'} />
                                <SummaryRow label="Phone" value={auth.user.phone || '—'} />
                            </Summary>

                            <Summary title="Order">
                                <SummaryRow label="Customer Type" value={data.customer_type} />
                                <SummaryRow label="Fabric" value={data.fabric_type} />
                                <SummaryRow label="Uniform Type" value={data.uniform_type || '—'} />
                                <SummaryRow label="Notes" value={data.notes || '—'} />
                                <SummaryRow
                                    label="Measurements"
                                    value={`W:${data.waist} H:${data.hip} HT:${data.height}`}
                                />
                                <SummaryRow label="Quantity" value={data.quantity} />
                                <SummaryRow label="Total Price" value={`${totalPrice} MMK`} />
                            </Summary>
                        </>
                    )}
                </form>

                {/* FOOTER */}
                <div className="border-t px-6 py-4 flex justify-between flex-shrink-0">
                    <button
                        type="button"
                        onClick={step === 1 ? onClose : prevStep}
                        className="px-4 py-2 border rounded-md"
                    >
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>

                    {step < TOTAL_STEPS ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-md"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-md"
                        >
                            {processing ? 'Submitting...' : 'Confirm Order'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

/* ------------------ SMALL COMPONENTS ------------------ */

const Info = ({ label, value }) => (
    <div>
        <p className="text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
    </div>
)

const Input = ({ label, ...props }) => (
    <div>
        <label className="text-sm text-gray-600">{label}</label>
        <input {...props} className="w-full mt-1 border rounded-md px-3 py-2" />
    </div>
)

const Select = ({ label, options, ...props }) => (
    <div>
        <label className="text-sm text-gray-600">{label}</label>
        <select {...props} className="w-full mt-1 border rounded-md px-3 py-2">
            <option value="">Select</option>
            {options.map(o => (
                <option key={o} value={o}>
                    {o}
                </option>
            ))}
        </select>
    </div>
)

const Summary = ({ title, children }) => (
    <div className="border rounded-lg p-4 space-y-2">
        <h4 className="font-semibold">{title}</h4>
        {children}
    </div>
)

const SummaryRow = ({ label, value }) => (
    <div className="flex justify-between text-sm">
        <span className="text-gray-500">{label}</span>
        <span className="font-medium">{value}</span>
    </div>
)
