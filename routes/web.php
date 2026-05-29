<?php

use App\Http\Controllers\AcademyController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use App\Http\Middleware\EnsureAdmin;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (! auth()->check()) {
        return redirect()->route('login');
    }

    return auth()->user()->isAdmin()
        ? redirect()->route('academy.dashboard')
        : redirect()->route('student.home');
});

// Guest
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'show'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Student app — any authenticated user (admins may preview it too).
    Route::get('/student', [StudentController::class, 'home'])->name('student.home');

    // Academy admin — admins only.
    Route::middleware(EnsureAdmin::class)->group(function () {
        Route::get('/dashboard', [AcademyController::class, 'dashboard'])->name('academy.dashboard');
        Route::get('/students', [AcademyController::class, 'students'])->name('academy.students');
        Route::get('/courses', [AcademyController::class, 'courses'])->name('academy.courses');
        Route::get('/timetable', [AcademyController::class, 'timetable'])->name('academy.timetable');
        Route::get('/attendance', [AcademyController::class, 'attendance'])->name('academy.attendance');
        Route::post('/attendance', [AcademyController::class, 'submitAttendance'])->name('academy.attendance.submit');
        Route::get('/fees', [AcademyController::class, 'fees'])->name('academy.fees');
        Route::get('/reports', [AcademyController::class, 'reports'])->name('academy.reports');
        Route::get('/settings', [AcademyController::class, 'settings'])->name('academy.settings');
    });
});
