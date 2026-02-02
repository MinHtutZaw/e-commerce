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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('min_order_quantity')->default(1);
            $table->enum('gender', ['male', 'female', 'unisex'])->default('unisex');
            $table->enum('uniform_type', [
                'school',
                'college', 
                'university',
                'other'
            ])->default('school');
            $table->timestamps();
            
            // Add indexes for better filtering performance
            $table->index('gender');
            $table->index('uniform_type');
            $table->index(['gender', 'uniform_type', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
