<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    protected $fillable = [
        'ext_id', 'name', 'code', 'color', 'teacher', 'level',
        'room', 'enrolled', 'sessions', 'fee', 'progress', 'sort',
    ];

    protected $casts = [
        'enrolled' => 'integer',
        'sessions' => 'integer',
        'fee'      => 'integer',
        'progress' => 'float',
    ];

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function classSessions(): HasMany
    {
        return $this->hasMany(ClassSession::class);
    }
}
