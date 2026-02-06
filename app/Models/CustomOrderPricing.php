<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomOrderPricing extends Model
{
    protected $table = 'custom_order_pricing';

    protected $fillable = [
        'type',
        'name',
        'price',
        'is_active',
    ];

    protected $casts = [
        'price' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get base prices as associative array
     */
    public static function getBasePrices(): array
    {
        return self::where('type', 'base')
            ->where('is_active', true)
            ->pluck('price', 'name')
            ->toArray();
    }

    /**
     * Get fabric prices as associative array
     */
    public static function getFabricPrices(): array
    {
        return self::where('type', 'fabric')
            ->where('is_active', true)
            ->pluck('price', 'name')
            ->toArray();
    }

    /**
     * Get all pricing for frontend
     */
    public static function getAllPricing(): array
    {
        return [
            'base' => self::getBasePrices(),
            'fabric' => self::getFabricPrices(),
        ];
    }
}
