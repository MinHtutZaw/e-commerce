<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Order payment_status workflow: unpaid → submitted (pending) → verified (paid) | rejected (failed)
     * Add 'unpaid' so new orders start as unpaid; admin verifies payment before order can advance.
     */
    public function up(): void
    {
        // Add 'unpaid' to enum and set default for new orders
        DB::statement("ALTER TABLE orders MODIFY COLUMN payment_status ENUM('unpaid', 'pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'unpaid'");

        // Existing orders with no payment record: keep as-is. Those with payment_status 'pending' = submitted.
        // Optionally set orders that have no payments to unpaid (if you want strict semantics)
        // DB::table('orders')->whereNull(...)->orWhere(...)->update(['payment_status' => 'unpaid']);
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE orders MODIFY COLUMN payment_status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending'");
    }
};
