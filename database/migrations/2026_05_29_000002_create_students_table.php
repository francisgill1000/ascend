<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('ext_id')->unique();    // S-1042 …
            $table->string('initials', 4);
            $table->string('name');
            $table->string('grade');
            $table->decimal('attendance', 4, 3);   // 0.000 – 1.000
            $table->unsignedInteger('avg');        // avg score
            $table->string('status');              // active | at-risk
            $table->string('parent');
            $table->string('phone');
            $table->unsignedInteger('due')->default(0); // outstanding fees (AED)
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
