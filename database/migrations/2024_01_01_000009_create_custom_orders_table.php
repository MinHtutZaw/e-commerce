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
        Schema::create('custom_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->nullable()->constrained('orders')->onDelete('set null');
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone');
            $table->text('delivery_address');
            $table->enum('customer_type', ['child', 'adult']);
            $table->enum('gender', ['male', 'female', 'unisex'])->default('unisex');
            $table->enum('uniform_type', [
                'school',
                'college', 
                'university',
            ])->default('school');
           
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'confirmed', 'processing'])->default('pending');
            $table->timestamps();
            
            $table->index('status');
            $table->index(['gender', 'uniform_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custom_orders');
    }
};
