<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('ext_id')->unique();    // C1, C2 … stable handle used by the client
            $table->string('name');
            $table->string('code');                // MATH-401 …
            $table->string('color');               // hex accent
            $table->string('teacher');
            $table->string('level');               // Grade 12 …
            $table->string('room');
            $table->unsignedInteger('enrolled');   // displayed roster size
            $table->unsignedInteger('sessions');   // total sessions in term
            $table->unsignedInteger('fee');        // whole AED
            $table->decimal('progress', 3, 2);     // 0.00 – 1.00
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
