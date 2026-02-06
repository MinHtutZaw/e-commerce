<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('custom_order_pricing', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // 'base' or 'fabric'
            $table->string('name'); // 'child', 'adult', 'Cotton', etc.
            $table->integer('price')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->unique(['type', 'name']);
        });

        // Insert default pricing
        DB::table('custom_order_pricing')->insert([
            // Base prices
            ['type' => 'base', 'name' => 'child', 'price' => 5000, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['type' => 'base', 'name' => 'adult', 'price' => 8000, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            // Fabric prices
            ['type' => 'fabric', 'name' => 'Cotton', 'price' => 2000, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['type' => 'fabric', 'name' => 'Polyester', 'price' => 1500, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['type' => 'fabric', 'name' => 'Dry-fit', 'price' => 3000, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custom_order_pricing');
    }
};
