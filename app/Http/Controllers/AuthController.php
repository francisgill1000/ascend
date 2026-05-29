<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // Normalise the email so mobile auto-capitalisation / stray whitespace
        // doesn't cause a (case-sensitive) lookup miss. Trim surrounding
        // whitespace off the password too — copy-pasting from a table or chat
        // commonly drags in trailing spaces, which shouldn't fail a login.
        $credentials['email'] = strtolower(trim($credentials['email']));
        $credentials['password'] = trim($credentials['password']);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors(['email' => 'Those credentials don’t match our records.'])->onlyInput('email');
        }

        $request->session()->regenerate();

        $home = $request->user()->isAcademyUser()
            ? route('academy.dashboard')
            : route('student.home');

        return redirect()->intended($home);
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
