import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Navbar from "@/Components/common/Navbar";
import Footer from "@/Components/common/Footer";
import { Label } from "@/components/ui/label";
import { useForm } from '@inertiajs/react'



import InputError from '@/components/input-error'
import { LoaderCircle } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function OrderForm() {
    const [type, setType] = useState<string>("Adult");
    const [quantity, setQuantity] = useState<number>(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Order: ${type} x ${quantity}`);
    
        // here you can send data to backend
    };
    const { data, setData, post, processing, errors } = useForm({
    order_type: 'standard',
    name: '',
    email: '',
    phone: '',
    quantity: '',
    message: '',
});


    return (
        <>
            <Navbar />
           <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
    <div className="grid gap-6">

        {/* Order Type */}
        <div className="grid gap-2">
            <Label>Order Type</Label>
            <RadioGroup
                value={data.order_type}
                onValueChange={(value) => setData('order_type', value)}
                className="mt-2 flex gap-6"
            >
                <div className="flex items-center gap-2">
                    <RadioGroupItem value="standard" id="order-standard" />
                    <Label htmlFor="order-standard" className="cursor-pointer">
                        Standard Order
                    </Label>
                </div>

                <div className="flex items-center gap-2">
                    <RadioGroupItem value="custom" id="order-custom" />
                    <Label htmlFor="order-custom" className="cursor-pointer">
                        Custom Order
                    </Label>
                </div>
            </RadioGroup>
            <InputError message={errors.order_type} />
        </div>

        {/* Name */}
        <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
                id="name"
                type="text"
                required
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Your full name"
                disabled={processing}
            />
            <InputError message={errors.name} />
        </div>

        {/* Email */}
        <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
                id="email"
                type="email"
                required
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="email@example.com"
                disabled={processing}
            />
            <InputError message={errors.email} />
        </div>

        {/* Phone */}
        <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
                id="phone"
                type="text"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                placeholder="+95 xxxx xxxx"
                disabled={processing}
            />
            <InputError message={errors.phone} />
        </div>

        {/* Quantity */}
        <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
                id="quantity"
                type="number"
                min="1"
                value={data.quantity}
                onChange={(e) => setData('quantity', e.target.value)}
                placeholder="e.g. 50"
                disabled={processing}
            />
            <InputError message={errors.quantity} />
        </div>

        {/* Message / Custom Details */}
        <div className="grid gap-2">
            <Label htmlFor="message">Custom Requirements</Label>
            <textarea
                id="message"
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={data.message}
                onChange={(e) => setData('message', e.target.value)}
                placeholder="Describe sizes, colors, logo, deadlines, etc."
                disabled={processing}
            />
            <InputError message={errors.message} />
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={processing}>
            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            Send Request
        </Button>
    </div>
</form>

            <Footer />
        </>

    );
}
