<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'delivery_address',
        'customer_type',
        'gender',
        'uniform_type',
        'size_small_quantity',
        'size_medium_quantity',
        'size_large_quantity',
        'notes',
        'status',
        'quoted_price',
    ];

    protected $casts = [
        'quoted_price' => 'decimal:2',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
