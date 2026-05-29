<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    /**
     * Admin-only area (Fees, Reports, Settings). Staff are bounced to the
     * dashboard; the student "user" role to their student app.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! $user->isAdmin()) {
            $target = $user && $user->isAcademyUser() ? 'academy.dashboard' : 'student.home';

            return redirect()->route($target);
        }

        return $next($request);
    }
}
