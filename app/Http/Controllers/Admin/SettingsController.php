<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/settings', [
            'payment_account_name' => Setting::get('payment_account_name', 'EduFit'),
            'payment_account_number' => Setting::get('payment_account_number', '09876543210'),
            'payment_bank_name' => Setting::get('payment_bank_name', 'KBZ Bank'),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'payment_account_name' => 'required|string|max:255',
            'payment_account_number' => 'required|string|max:255',
            'payment_bank_name' => 'required|string|max:255',
        ]);

        Setting::set('payment_account_name', $request->payment_account_name);
        Setting::set('payment_account_number', $request->payment_account_number);
        Setting::set('payment_bank_name', $request->payment_bank_name);

        return back()->with('success', 'Payment settings updated successfully!');
    }
}
