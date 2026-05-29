<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\ClassSession;
use App\Models\Course;
use App\Models\Student;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    /** The demo student presented inside the student app. */
    private const STUDENT_EXT = 'S-1042'; // Francis Gill

    public function home(): Response
    {
        $me = Student::with('courses')->where('ext_id', self::STUDENT_EXT)->firstOrFail();

        $courses = $me->courses->sortBy('sort')->values();

        $today = ClassSession::with('course')->orderBy('sort')->get()->map(fn (ClassSession $t) => [
            'id'     => $t->ext_id,
            'time'   => $t->starts,
            'end'    => $t->ends,
            'room'   => $t->room,
            'topic'  => $t->topic,
            'status' => $t->status,
            'course' => ['name' => $t->course->name, 'color' => $t->course->color, 'teacher' => $t->course->teacher],
        ]);

        // Course lookup for the weekly grid (ext_id => lite course).
        $byExt = Course::orderBy('sort')->get()->keyBy('ext_id')->map(fn (Course $c) => [
            'name'    => $c->name,
            'color'   => $c->color,
            'teacher' => $c->teacher,
            'room'    => $c->room,
            'code'    => $c->code,
        ]);

        $assignments = Assignment::with('course')->orderBy('sort')->get()->map(fn (Assignment $a) => [
            'id'     => $a->ext_id,
            'title'  => $a->title,
            'due'    => $a->due,
            'status' => $a->status,
            'score'  => $a->score,
            'course' => ['name' => $a->course->name, 'code' => $a->course->code, 'color' => $a->course->color],
        ]);

        return Inertia::render('Student/App', [
            'me' => [
                'id'         => $me->ext_id,
                'initials'   => $me->initials,
                'name'       => $me->name,
                'grade'      => $me->grade,
                'parent'     => $me->parent,
                'attendance' => $me->attendance,
                'avg'        => $me->avg,
                'due'        => $me->due,
                'courseCount' => $courses->count(),
            ],
            'courses' => $courses->map(fn (Course $c) => [
                'id'       => $c->ext_id,
                'name'     => $c->name,
                'code'     => $c->code,
                'color'    => $c->color,
                'teacher'  => $c->teacher,
                'sessions' => $c->sessions,
                'progress' => $c->progress,
            ]),
            'today'       => $today,
            'week'        => config('ascend.week'),
            'courseLookup' => $byExt,
            'assignments' => $assignments,
        ]);
    }
}
