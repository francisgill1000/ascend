<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAcademy
{
    /**
     * Academy admin chrome — admins and staff. The student "user" role is
     * sent to their student app instead.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || ! $request->user()->isAcademyUser()) {
            return redirect()->route('student.home');
        }

        return $next($request);
    }
}
