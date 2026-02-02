<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated and is an admin
        if (!$request->user() || $request->user()->role !== 'admin') {
            // Redirect to home page with error message
            return redirect('/')->with('error', 'Access denied. Admin privileges required.');
        }

        return $next($request);
    }
}
