<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Add payment_status column
            $table->enum('payment_status', ['unpaid', 'pending', 'paid', 'failed'])
                ->default('unpaid')
                ->after('status');
            
            // Modify status to include more options
            $table->enum('status', ['pending', 'processing', 'delivered'])
                ->default('pending')
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('payment_status');
        });
    }
};
