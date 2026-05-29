<?php

return [
    'name'    => env('ASCEND_NAME', 'ASCEND'),
    'tagline' => 'Coaching academy',
    'director' => 'Dr. Priya Nair',
    'currency' => 'AED',

    // Term context shown across the admin chrome.
    'term'         => 'Spring 2026',
    'term_label'   => 'Spring term · week 8 of 14',
    'today_label'  => 'Friday, May 29',
    'working_days' => 'Mon – Sat',

    // Headline figures from the prototype that aren't derived from rows.
    'active_students'  => 244,
    'attendance_today' => 89,   // %
    'collection_rate'  => 78,   // %
    'term_revenue'     => '412k',

    // 6-month enrollment trend (dashboard + reports bars).
    'enrollment' => [
        ['m' => 'Dec', 'v' => 142],
        ['m' => 'Jan', 'v' => 168],
        ['m' => 'Feb', 'v' => 184],
        ['m' => 'Mar', 'v' => 201],
        ['m' => 'Apr', 'v' => 223],
        ['m' => 'May', 'v' => 244],
    ],

    // Weekly timetable layout. Cells reference course ext_ids (null = free).
    'week' => [
        'days'  => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        'slots' => ['08:00', '09:45', '11:15', '14:00', '15:45'],
        'grid'  => [
            ['C1', 'C2', 'C5', 'C4', 'C1'],
            ['C3', 'C6', 'C1', 'C2', 'C3'],
            ['C5', 'C1', 'C3', 'C6', 'C4'],
            ['C2', 'C4', 'C5', 'C1', 'C2'],
            ['C1', 'C3', 'C6', 'C5', 'C1'],
            ['C4', null, 'C2', null, 'C6'],
        ],
    ],
];
