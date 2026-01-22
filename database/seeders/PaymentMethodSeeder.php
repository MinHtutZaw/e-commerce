<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $paymentMethods = [
            [
                'name' => 'KBZ PAY',
                'bank_name' => 'KBZ Bank',
                'account_name' => 'EduFit',
                'account_number' => '09876543210',
                'qr_code_image' => null,
                'is_active' => true,
                'display_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'AYA PAY',
                'bank_name' => 'AYA Bank',
                'account_name' => 'EduFit',
                'account_number' => '01234567890',
                'qr_code_image' => null,
                'is_active' => true,
                'display_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('payment_methods')->insert($paymentMethods);
    }
}
