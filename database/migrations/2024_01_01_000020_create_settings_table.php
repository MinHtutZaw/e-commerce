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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Insert default payment settings
        DB::table('settings')->insert([
            ['key' => 'payment_account_name', 'value' => 'EduFit', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'payment_account_number', 'value' => '09876543210', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'payment_bank_name', 'value' => 'KBZ Bank', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
