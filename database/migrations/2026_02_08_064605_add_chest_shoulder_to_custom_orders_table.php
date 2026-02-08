<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('custom_orders', function (Blueprint $table) {
            $table->decimal('chest', 5, 2)->nullable()->after('hip');
            $table->decimal('shoulder', 5, 2)->nullable()->after('chest');
        });
    }

    public function down(): void
    {
        Schema::table('custom_orders', function (Blueprint $table) {
            $table->dropColumn(['chest', 'shoulder']);
        });
    }
};
