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
        Schema::create('product_sizes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('size'); // XS, S, M, L, XL, XXL, XXXL, or numeric sizes like 28, 30, 32, etc.
            $table->integer('price')->default(0);
            $table->integer('stock_quantity')->default(0);
            $table->boolean('is_available')->default(true);
            $table->timestamps();
            $table->unique(['product_id', 'size']);
            $table->index(['product_id', 'is_available']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_sizes');
    }
};
