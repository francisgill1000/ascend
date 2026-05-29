<?php

use App\Http\Controllers\AcademyController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => auth()->check()
    ? redirect()->route('academy.dashboard')
    : redirect()->route('login'));

// Guest
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'show'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

// Authenticated academy admin
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [AcademyController::class, 'dashboard'])->name('academy.dashboard');
    Route::get('/students', [AcademyController::class, 'students'])->name('academy.students');
    Route::get('/courses', [AcademyController::class, 'courses'])->name('academy.courses');
    Route::get('/timetable', [AcademyController::class, 'timetable'])->name('academy.timetable');
    Route::get('/attendance', [AcademyController::class, 'attendance'])->name('academy.attendance');
    Route::post('/attendance', [AcademyController::class, 'submitAttendance'])->name('academy.attendance.submit');
    Route::get('/fees', [AcademyController::class, 'fees'])->name('academy.fees');
    Route::get('/reports', [AcademyController::class, 'reports'])->name('academy.reports');
    Route::get('/settings', [AcademyController::class, 'settings'])->name('academy.settings');

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});
