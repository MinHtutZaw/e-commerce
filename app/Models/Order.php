<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'status',
        'payment_status',
        'total_amount',
        'notes',
    ];

    protected $casts = [
        'total_amount' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function customOrder()
    {
        return $this->hasOne(CustomOrder::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
