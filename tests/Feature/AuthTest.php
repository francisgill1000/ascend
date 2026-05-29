<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get(route('academy.dashboard'))->assertRedirect(route('login'));
        $this->get('/')->assertRedirect(route('login'));
    }

    public function test_login_screen_renders(): void
    {
        $this->get(route('login'))->assertOk();
    }

    public function test_admin_can_log_in(): void
    {
        $user = User::factory()->create([
            'email'    => 'info@eloquentservice.com',
            'role'     => 'admin',
            'password' => Hash::make('1@Ab56ab56'),
        ]);

        $this->post('/login', ['email' => 'info@eloquentservice.com', 'password' => '1@Ab56ab56'])
            ->assertRedirect(route('academy.dashboard'));

        $this->assertAuthenticatedAs($user);
    }

    public function test_login_email_is_case_and_whitespace_insensitive(): void
    {
        $user = User::factory()->create([
            'email'    => 'user@eloquentservice.com',
            'role'     => 'user',
            'password' => Hash::make('password'),
        ]);

        // A user-role account lands on the student app.
        $this->post('/login', ['email' => '  User@Eloquentservice.com  ', 'password' => 'password'])
            ->assertRedirect(route('student.home'));

        $this->assertAuthenticatedAs($user);
    }

    public function test_invalid_credentials_are_rejected(): void
    {
        User::factory()->create(['email' => 'info@eloquentservice.com', 'password' => Hash::make('1@Ab56ab56')]);

        $this->post('/login', ['email' => 'info@eloquentservice.com', 'password' => 'wrong'])
            ->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_authenticated_user_can_log_out(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post('/logout')->assertRedirect(route('login'));
        $this->assertGuest();
    }
}
