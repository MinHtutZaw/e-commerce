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
            $table->enum('gender', ['male', 'female', 'unisex']);
            $table->string('uniform_type');
            $table->integer('size_small_quantity')->default(0);
            $table->integer('size_medium_quantity')->default(0);
            $table->integer('size_large_quantity')->default(0);
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'quoted', 'accepted', 'rejected', 'completed'])->default('pending');
            $table->decimal('quoted_price', 10, 2)->nullable();
            $table->timestamps();
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
