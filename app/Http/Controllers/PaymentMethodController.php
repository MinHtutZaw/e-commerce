<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    public function index()
    {
        $paymentMethods = PaymentMethod::where('is_active', true)
            ->orderBy('display_order')
            ->get()
            ->map(function ($method) {
                return [
                    'id' => $method->id,
                    'name' => $method->name,
                    'bank' => $method->bank_name,
                    'accountName' => $method->account_name,
                    'accountNumber' => $method->account_number,
                    'qrCodeImage' => $method->qr_code_image,
                ];
            });

        return response()->json($paymentMethods);
    }
}
