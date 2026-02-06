<?php

namespace App\Http\Middleware;

use App\Models\CartItem;
use App\Models\CustomOrderPricing;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        // Get cart count for authenticated users
        $cartCount = 0;
        if ($request->user()) {
            $cartCount = CartItem::where('user_id', $request->user()->id)->sum('quantity');
        }

        // Get custom order pricing
        $customOrderPricing = null;
        try {
            $customOrderPricing = CustomOrderPricing::getAllPricing();
        } catch (\Exception $e) {
            // Table might not exist yet
            $customOrderPricing = [
                'base' => ['child' => 5000, 'adult' => 8000],
                'fabric' => ['Cotton' => 2000, 'Polyester' => 1500, 'Dry-fit' => 3000],
            ];
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'cartCount' => $cartCount,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'message' => $request->session()->get('flash'),
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'customOrderPricing' => $customOrderPricing,
        ];
    }
}
