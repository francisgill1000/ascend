<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\ClassSession;
use App\Models\Course;
use App\Models\User;
use Database\Seeders\AcademySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AcademyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(AcademySeeder::class);
        $this->actingAs(User::factory()->create(['role' => 'admin']));
    }

    public function test_each_admin_page_renders(): void
    {
        $pages = [
            'academy.dashboard'  => 'Academy/Dashboard',
            'academy.students'   => 'Academy/Students',
            'academy.courses'    => 'Academy/Courses',
            'academy.timetable'  => 'Academy/Timetable',
            'academy.attendance' => 'Academy/Attendance',
            'academy.fees'       => 'Academy/Fees',
            'academy.reports'    => 'Academy/Reports',
            'academy.settings'   => 'Academy/Settings',
        ];

        foreach ($pages as $route => $component) {
            $this->get(route($route))
                ->assertOk()
                ->assertInertia(fn (Assert $page) => $page->component($component));
        }
    }

    public function test_dashboard_shares_real_data(): void
    {
        $this->get(route('academy.dashboard'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('Academy/Dashboard')
                ->where('kpis.students', 244)
                ->where('kpis.courses', 6)
                ->where('kpis.collected', 6600)   // sum of paid invoices
                ->has('todayClasses', 6)
                ->has('atRisk', 2)
            );
    }

    public function test_students_roster_lists_enrolled_students(): void
    {
        $this->get(route('academy.students'))
            ->assertInertia(fn (Assert $page) => $page
                ->has('students', 8)
                ->where('students.0.name', 'Francis Gill')
                ->has('students.0.courses', 3)
            );
    }

    public function test_attendance_defaults_to_first_course(): void
    {
        $this->get(route('academy.attendance'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('selected.id', 'C1')
                ->has('roster')
            );
    }

    public function test_submitting_attendance_persists_marks(): void
    {
        $course = Course::where('ext_id', 'C1')->first();
        $roster = $course->students()->orderBy('sort')->get();

        $marks = $roster->map(fn ($s, $i) => [
            'id'     => $s->ext_id,
            'status' => $i === 0 ? 'absent' : 'present',
        ])->all();

        $response = $this->post(route('academy.attendance.submit'), [
            'course' => 'C1',
            'marks'  => $marks,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $session = ClassSession::where('course_id', $course->id)
            ->where('status', 'live')->first()
            ?? ClassSession::where('course_id', $course->id)->first();

        $this->assertSame($roster->count(), Attendance::where('class_session_id', $session->id)->count());
        $this->assertSame('absent', Attendance::where('class_session_id', $session->id)
            ->where('student_id', $roster->first()->id)->value('status'));
    }

    public function test_attendance_submit_rejects_invalid_status(): void
    {
        $this->post(route('academy.attendance.submit'), [
            'course' => 'C1',
            'marks'  => [['id' => 'S-1042', 'status' => 'banana']],
        ])->assertSessionHasErrors('marks.0.status');
    }
}
