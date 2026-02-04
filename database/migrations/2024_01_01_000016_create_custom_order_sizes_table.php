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
        Schema::create('custom_order_sizes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('custom_order_id')->constrained('custom_orders')->onDelete('cascade');
            $table->string('size', 10); // S, M, L, XL, XXL, etc.
            $table->unsignedInteger('quantity')->default(0);
            $table->timestamps();

            $table->index('custom_order_id');
            $table->unique(['custom_order_id', 'size']); // Prevent duplicate sizes per order
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custom_order_sizes');
    }
};
