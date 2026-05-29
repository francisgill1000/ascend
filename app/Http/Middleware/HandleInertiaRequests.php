<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                    'role'  => $user->role,
                ] : null,
            ],
            'academy' => [
                'name'       => config('ascend.name', 'ASCEND'),
                'tagline'    => config('ascend.tagline'),
                'director'   => config('ascend.director'),
                'currency'   => config('ascend.currency'),
                'term'       => config('ascend.term'),
                'termLabel'  => config('ascend.term_label'),
                'todayLabel' => config('ascend.today_label'),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
