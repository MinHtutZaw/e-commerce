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
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('customer_type', ['child', 'adult']);
            $table->enum('gender', ['male', 'female', 'unisex'])->default('unisex');
            $table->string('uniform_type')->nullable(); // Changed to string for flexibility
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'quoted', 'confirmed', 'processing', 'completed', 'cancelled'])->default('pending');
            $table->decimal('quoted_price', 10, 2)->nullable();
            $table->timestamps();
            
            $table->index('status');
            $table->index('user_id');
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
