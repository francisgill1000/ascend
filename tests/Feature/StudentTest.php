<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\AcademySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StudentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(AcademySeeder::class);
    }

    private function user(): User
    {
        return User::factory()->create(['role' => 'user']);
    }

    private function admin(): User
    {
        return User::factory()->create(['role' => 'admin']);
    }

    public function test_student_app_renders_with_data(): void
    {
        $this->actingAs($this->user())
            ->get(route('student.home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Student/App')
                ->where('me.name', 'Francis Gill')
                ->where('me.id', 'S-1042')
                ->has('me.courseCount')
                ->has('courses', 3)
                ->has('today', 6)
                ->has('assignments', 4)
            );
    }

    public function test_user_role_is_redirected_away_from_admin(): void
    {
        $this->actingAs($this->user())
            ->get(route('academy.dashboard'))
            ->assertRedirect(route('student.home'));
    }

    public function test_root_routes_user_to_student_and_admin_to_dashboard(): void
    {
        $this->actingAs($this->user())->get('/')->assertRedirect(route('student.home'));
        $this->actingAs($this->admin())->get('/')->assertRedirect(route('academy.dashboard'));
    }

    public function test_admin_may_preview_student_app(): void
    {
        $this->actingAs($this->admin())
            ->get(route('student.home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Student/App'));
    }
}
