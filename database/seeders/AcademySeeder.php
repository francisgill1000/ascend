<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\ClassSession;
use App\Models\Course;
use App\Models\Payment;
use App\Models\Student;
use Illuminate\Database\Seeder;

class AcademySeeder extends Seeder
{
    public function run(): void
    {
        // ── Courses (ported from edu-data.js) ──
        $courses = [
            ['C1', 'Advanced Mathematics', 'MATH-401', '#00ffcc', 'Dr. Priya Nair',  38, 24, 'Grade 12', 'Hall A', 2400, 0.68],
            ['C2', 'Physics · Mechanics',  'PHY-302',  '#60a5fa', 'Karim Haddad',    31, 20, 'Grade 11', 'Lab 2',  2200, 0.55],
            ['C3', 'Organic Chemistry',    'CHEM-310', '#a78bfa', 'Dr. Lena Fischer', 27, 22, 'Grade 12', 'Lab 1',  2300, 0.72],
            ['C4', 'English Literature',   'ENG-210',  '#f4b860', 'Sarah Mitchell',   44, 18, 'Grade 10', 'Hall B', 1800, 0.61],
            ['C5', 'Computer Science',     'CS-340',   '#34d399', 'Omar Farouk',      35, 26, 'Grade 12', 'Lab 3',  2600, 0.44],
            ['C6', 'Biology · Genetics',   'BIO-305',  '#f472b6', 'Dr. Aisha Rahman', 29, 21, 'Grade 11', 'Lab 1',  2100, 0.50],
        ];
        foreach ($courses as $sort => [$ext, $name, $code, $color, $teacher, $enrolled, $sessions, $level, $room, $fee, $progress]) {
            Course::updateOrCreate(['ext_id' => $ext], compact('name', 'code', 'color', 'teacher', 'level', 'room', 'enrolled', 'sessions', 'fee', 'progress') + ['sort' => $sort]);
        }
        $course = Course::pluck('id', 'ext_id');

        // ── Students + enrollments ──
        $students = [
            ['S-1042', 'FG', 'Francis Gill',   'Grade 12', ['C1', 'C3', 'C5'], 0.94, 0,    88, 'active',  'M. Gill',     '+971 50 11 388'],
            ['S-1043', 'AK', 'Aaliyah Khan',   'Grade 12', ['C1', 'C3'],       0.88, 2300, 91, 'active',  'S. Khan',     '+971 55 80 233'],
            ['S-1044', 'RP', 'Ravi Patel',     'Grade 11', ['C2', 'C6'],       0.76, 2200, 74, 'at-risk', 'N. Patel',    '+971 52 11 487'],
            ['S-1045', 'LM', 'Lina Mansour',   'Grade 10', ['C4'],             0.97, 0,    95, 'active',  'H. Mansour',  '+971 50 44 902'],
            ['S-1046', 'TO', 'Tomas Oliveira', 'Grade 12', ['C1', 'C5'],       0.82, 1300, 79, 'active',  'C. Oliveira', '+971 56 33 290'],
            ['S-1047', 'YS', 'Yuki Sato',      'Grade 11', ['C2', 'C6'],       0.91, 0,    86, 'active',  'K. Sato',     '+971 50 90 771'],
            ['S-1048', 'MB', 'Maya Bianchi',   'Grade 12', ['C3', 'C5'],       0.68, 4900, 71, 'at-risk', 'R. Bianchi',  '+971 50 67 014'],
            ['S-1049', 'DA', 'Daniel Abebe',   'Grade 10', ['C4'],             0.99, 0,    93, 'active',  'T. Abebe',    '+971 52 88 110'],
        ];
        foreach ($students as $sort => [$ext, $initials, $name, $grade, $enrolledIn, $attendance, $due, $avg, $status, $parent, $phone]) {
            $student = Student::updateOrCreate(['ext_id' => $ext], compact('initials', 'name', 'grade', 'attendance', 'avg', 'status', 'parent', 'phone', 'due') + ['sort' => $sort]);
            $student->courses()->sync(collect($enrolledIn)->map(fn ($c) => $course[$c])->all());
        }
        $student = Student::pluck('id', 'ext_id');

        // ── Payments / invoices ──
        $payments = [
            ['P-8821', 'S-1043', 'C1', 2400, 'paid',    'Card',     '2026-05-02'],
            ['P-8822', 'S-1044', 'C2', 2200, 'overdue', null,       '2026-05-10'],
            ['P-8823', 'S-1045', 'C4', 1800, 'paid',    'Transfer', '2026-05-04'],
            ['P-8824', 'S-1048', 'C3', 2300, 'overdue', null,       '2026-05-08'],
            ['P-8825', 'S-1046', 'C5', 2600, 'partial', 'Card',     '2026-05-12'],
            ['P-8826', 'S-1042', 'C1', 2400, 'paid',    'Card',     '2026-05-01'],
        ];
        foreach ($payments as [$ext, $stu, $crs, $amount, $status, $method, $paidOn]) {
            Payment::updateOrCreate(['ext_id' => $ext], [
                'student_id' => $student[$stu],
                'course_id'  => $course[$crs],
                'amount'     => $amount,
                'status'     => $status,
                'method'     => $method,
                'paid_on'    => $paidOn,
            ]);
        }

        // ── Today's class sessions ──
        $today = [
            ['T1', 'C1', '08:00', '09:30', 'Hall A', 'Integration by parts', 'done'],
            ['T2', 'C3', '09:45', '11:00', 'Lab 1',  'Alkenes & reactions',  'done'],
            ['T3', 'C5', '11:15', '12:45', 'Lab 3',  'Recursion & trees',    'live'],
            ['T4', 'C2', '14:00', '15:30', 'Lab 2',  'Projectile motion',    'next'],
            ['T5', 'C4', '15:45', '17:00', 'Hall B', 'Macbeth · Act III',    'upcoming'],
            ['T6', 'C6', '17:15', '18:30', 'Lab 1',  'Mendelian genetics',   'upcoming'],
        ];
        foreach ($today as $sort => [$ext, $crs, $starts, $ends, $room, $topic, $status]) {
            ClassSession::updateOrCreate(['ext_id' => $ext], [
                'course_id' => $course[$crs],
                'starts'    => $starts,
                'ends'      => $ends,
                'room'      => $room,
                'topic'     => $topic,
                'status'    => $status,
                'sort'      => $sort,
            ]);
        }

        // ── Assignments (student app: due + graded) ──
        $assignments = [
            ['A1', 'C1', 'Integration problem set 7',      'Tomorrow',  'pending', null],
            ['A2', 'C5', 'Binary tree implementation',     'In 3 days', 'pending', null],
            ['A3', 'C3', 'Reaction mechanisms lab report', 'Submitted', 'graded',  92],
            ['A4', 'C1', 'Calculus quiz 5',                'Submitted', 'graded',  85],
        ];
        foreach ($assignments as $sort => [$ext, $crs, $title, $due, $status, $score]) {
            Assignment::updateOrCreate(['ext_id' => $ext], [
                'course_id' => $course[$crs],
                'title'     => $title,
                'due'       => $due,
                'status'    => $status,
                'score'     => $score,
                'sort'      => $sort,
            ]);
        }
    }
}
