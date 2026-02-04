<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomOrderSize extends Model
{
    use HasFactory;

    protected $fillable = [
        'custom_order_id',
        'size',
        'quantity',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    /**
     * Get the custom order that owns this size.
     */
    public function customOrder()
    {
        return $this->belongsTo(CustomOrder::class);
    }
}
