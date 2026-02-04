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
        DB::statement("ALTER TABLE orders MODIFY COLUMN payment_status ENUM('unpaid', 'pending', 'paid', 'failed') NOT NULL DEFAULT 'unpaid'");

    }

    public function down(): void
    {
        DB::statement("ALTER TABLE orders MODIFY COLUMN payment_status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending'");
    }
};
