<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'customer_type',
        'fabric_type',
        'uniform_type',
        'notes',
        'waist',
        'hip',
        'height',
        'quantity',
        'unit_price',
        'total_price',
        'status',
    ];

    protected $casts = [
        'waist' => 'decimal:2',
        'hip' => 'decimal:2',
        'height' => 'decimal:2',
        'unit_price' => 'integer',
        'total_price' => 'integer',
    ];

    /**
     * User who placed this order
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
