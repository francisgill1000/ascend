<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\AcademySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StaffTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(AcademySeeder::class);
        $this->actingAs(User::factory()->create(['role' => 'staff']));
    }

    public function test_staff_lands_on_dashboard_from_root(): void
    {
        $this->get('/')->assertRedirect(route('academy.dashboard'));
    }

    public function test_staff_can_access_teaching_pages(): void
    {
        foreach (['academy.dashboard', 'academy.students', 'academy.courses', 'academy.timetable', 'academy.attendance'] as $route) {
            $this->get(route($route))->assertOk();
        }
    }

    public function test_staff_is_blocked_from_admin_only_pages(): void
    {
        foreach (['academy.fees', 'academy.reports', 'academy.settings'] as $route) {
            $this->get(route($route))->assertRedirect(route('academy.dashboard'));
        }
    }

    public function test_staff_can_still_mark_attendance(): void
    {
        $this->post(route('academy.attendance.submit'), [
            'course' => 'C1',
            'marks'  => [['id' => 'S-1042', 'status' => 'present']],
        ])->assertRedirect();
    }
}
