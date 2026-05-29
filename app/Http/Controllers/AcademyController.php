<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\ClassSession;
use App\Models\Course;
use App\Models\Payment;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AcademyController extends Controller
{
    // ─────────────────────────── Dashboard ───────────────────────────
    public function dashboard(): Response
    {
        return Inertia::render('Academy/Dashboard', [
            'kpis' => [
                'students'   => (int) config('ascend.active_students'),
                'attendance' => (int) config('ascend.attendance_today'),
                'courses'    => Course::count(),
                'collected'  => $this->feeSum('paid'),
            ],
            'enrollment'  => config('ascend.enrollment'),
            'todayClasses' => $this->todayClasses(),
            'fees' => [
                'collected'      => $this->feeSum('paid'),
                'overdue'        => $this->feeSum('overdue'),
                'collectionRate' => (int) config('ascend.collection_rate'),
            ],
            'atRisk' => Student::where('status', 'at-risk')->orderBy('sort')->get()
                ->map(fn (Student $s) => [
                    'id'         => $s->ext_id,
                    'initials'   => $s->initials,
                    'name'       => $s->name,
                    'attendance' => $s->attendance,
                    'avg'        => $s->avg,
                    'due'        => $s->due,
                ]),
        ]);
    }

    // ─────────────────────────── Students ────────────────────────────
    public function students(): Response
    {
        return Inertia::render('Academy/Students', [
            'students'   => Student::with('courses')->orderBy('sort')->get()
                ->map(fn (Student $s) => $this->studentLite($s)),
            'totalCount' => (int) config('ascend.active_students'),
            'courseCount' => Course::count(),
        ]);
    }

    // ──────────────────────────── Courses ────────────────────────────
    public function courses(): Response
    {
        return Inertia::render('Academy/Courses', [
            'courses' => Course::orderBy('sort')->get()->map(fn (Course $c) => $this->courseLite($c)),
        ]);
    }

    // ─────────────────────────── Timetable ───────────────────────────
    public function timetable(): Response
    {
        $byExt = Course::orderBy('sort')->get()->keyBy('ext_id')
            ->map(fn (Course $c) => [
                'code'  => $c->code,
                'name'  => $c->name,
                'color' => $c->color,
                'room'  => $c->room,
            ]);

        return Inertia::render('Academy/Timetable', [
            'week'    => config('ascend.week'),
            'courses' => $byExt,
        ]);
    }

    // ─────────────────────────── Attendance ──────────────────────────
    public function attendance(Request $request): Response
    {
        $courses = Course::orderBy('sort')->take(5)->get();
        $current = $request->query('course');
        $course = $courses->firstWhere('ext_id', $current) ?? $courses->first();

        $roster = $course->students()->orderBy('sort')->get()->map(fn (Student $s) => [
            'id'         => $s->ext_id,
            'initials'   => $s->initials,
            'name'       => $s->name,
            'grade'      => $s->grade,
            'attendance' => $s->attendance,
        ]);

        return Inertia::render('Academy/Attendance', [
            'courses'  => $courses->map(fn (Course $c) => ['id' => $c->ext_id, 'code' => $c->code]),
            'selected' => [
                'id'      => $course->ext_id,
                'name'    => $course->name,
                'teacher' => $course->teacher,
            ],
            'roster' => $roster,
        ]);
    }

    public function submitAttendance(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'course'        => 'required|string|exists:courses,ext_id',
            'marks'         => 'required|array|min:1',
            'marks.*.id'    => 'required|string|exists:students,ext_id',
            'marks.*.status' => 'required|in:present,late,absent',
        ]);

        $course = Course::where('ext_id', $data['course'])->firstOrFail();

        // Attach today's live/next session for this course, falling back to the latest.
        $session = ClassSession::where('course_id', $course->id)
            ->orderByRaw("CASE status WHEN 'live' THEN 0 WHEN 'next' THEN 1 ELSE 2 END")
            ->orderBy('sort')->first();

        if (! $session) {
            return back()->with('error', 'No session scheduled for this course today.');
        }

        $students = Student::whereIn('ext_id', collect($data['marks'])->pluck('id'))
            ->get()->keyBy('ext_id');

        foreach ($data['marks'] as $mark) {
            $student = $students[$mark['id']] ?? null;
            if (! $student) {
                continue;
            }
            Attendance::updateOrCreate(
                ['class_session_id' => $session->id, 'student_id' => $student->id],
                ['status' => $mark['status']],
            );
        }

        $present = collect($data['marks'])->where('status', 'present')->count();

        return back()->with('success', "Attendance submitted · {$present}/".count($data['marks']).' present');
    }

    // ──────────────────────────── Fees ───────────────────────────────
    public function fees(): Response
    {
        return Inertia::render('Academy/Fees', [
            'payments' => Payment::with(['student', 'course'])->orderBy('paid_on', 'desc')->get()
                ->map(fn (Payment $p) => [
                    'id'       => $p->ext_id,
                    'student'  => ['initials' => $p->student->initials, 'name' => $p->student->name],
                    'course'   => $p->course->code,
                    'amount'   => $p->amount,
                    'method'   => $p->method ?? '—',
                    'date'     => $p->paid_on->format('m-d'),
                    'status'   => $p->status,
                ]),
            'stats' => [
                'collected'      => $this->feeSum('paid'),
                'overdue'        => $this->feeSum('overdue'),
                'partial'        => $this->feeSum('partial'),
                'overdueCount'   => Payment::where('status', 'overdue')->count(),
                'partialCount'   => Payment::where('status', 'partial')->count(),
                'collectionRate' => (int) config('ascend.collection_rate'),
            ],
        ]);
    }

    // ──────────────────────────── Reports ────────────────────────────
    public function reports(): Response
    {
        return Inertia::render('Academy/Reports', [
            'enrollment' => config('ascend.enrollment'),
            'termRevenue' => config('ascend.term_revenue'),
            'courses' => Course::orderBy('sort')->get()->map(fn (Course $c) => [
                'id'    => $c->ext_id,
                'name'  => $c->name,
                'color' => $c->color,
                // Derived course score, mirroring the prototype: 70 + progress·25.
                'score' => (int) round(70 + $c->progress * 25),
            ]),
        ]);
    }

    // ──────────────────────────── Settings ───────────────────────────
    public function settings(): Response
    {
        return Inertia::render('Academy/Settings', [
            'term'        => config('ascend.term'),
            'workingDays' => config('ascend.working_days'),
        ]);
    }

    // ─────────────────────────── Presenters ──────────────────────────
    private function feeSum(string $status): int
    {
        return (int) Payment::where('status', $status)->sum('amount');
    }

    private function todayClasses()
    {
        return ClassSession::with('course')->orderBy('sort')->get()->map(fn (ClassSession $t) => [
            'id'     => $t->ext_id,
            'time'   => $t->starts,
            'end'    => $t->ends,
            'room'   => $t->room,
            'topic'  => $t->topic,
            'status' => $t->status,
            'course' => [
                'name'    => $t->course->name,
                'color'   => $t->course->color,
                'teacher' => $t->course->teacher,
            ],
        ]);
    }

    private function courseLite(Course $c): array
    {
        return [
            'id'       => $c->ext_id,
            'name'     => $c->name,
            'code'     => $c->code,
            'color'    => $c->color,
            'teacher'  => $c->teacher,
            'level'    => $c->level,
            'room'     => $c->room,
            'students' => $c->enrolled,
            'sessions' => $c->sessions,
            'fee'      => $c->fee,
            'progress' => $c->progress,
        ];
    }

    private function studentLite(Student $s): array
    {
        return [
            'id'         => $s->ext_id,
            'initials'   => $s->initials,
            'name'       => $s->name,
            'grade'      => $s->grade,
            'courses'    => $s->courses->sortBy('sort')->map(fn (Course $c) => [
                'id'    => $c->ext_id,
                'name'  => $c->name,
                'color' => $c->color,
            ])->values(),
            'attendance' => $s->attendance,
            'due'        => $s->due,
            'avg'        => $s->avg,
            'status'     => $s->status,
            'parent'     => $s->parent,
        ];
    }
}
