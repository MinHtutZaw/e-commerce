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
        'gender',
        'uniform_type',
        'notes',
        'status',
        'quoted_price',
    ];

    protected $casts = [
        'quoted_price' => 'decimal:2',
    ];

    // Automatically append total_quantity to JSON
    protected $appends = ['total_quantity'];

    /**
     * Get the user who placed this custom order.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }


    /**
     * Get all sizes for this custom order.
     */
    public function sizes()
    {
        return $this->hasMany(CustomOrderSize::class);
    }

    /**
     * Get total quantity (sum of all sizes).
     */
    public function getTotalQuantityAttribute(): int
    {
        return $this->sizes()->sum('quantity');
    }
}
