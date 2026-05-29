<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('class_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('ext_id')->unique();    // T1 …
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('starts', 5);           // 08:00
            $table->string('ends', 5);             // 09:30
            $table->string('room');
            $table->string('topic');
            $table->string('status');              // done | live | next | upcoming
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_sessions');
    }
};
