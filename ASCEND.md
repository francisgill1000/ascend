# ASCEND — Academy Admin

Coaching-academy management web app, built from a **Claude Design** handoff bundle
(`sale-agent-template` → `ASCEND.html`). Recreated pixel-faithfully on the Eloquent
dark + mint design system (Geist type), same house style as `maison-order` / `gym`.

**Live:** https://academy.eloquentservice.com · repo `github.com/francisgill1000/ascend`

## Auth
Login required (Laravel session auth, hand-rolled on-brand login page). Seeded accounts:
- **Admin** — `info@eloquentservice.com` / `1@Ab56ab56` (role `admin`)
- **User** — `user@eloquentservice.com` / `password` (role `user`)

Credentials come from `Admin_EMAIL`/`Admin_PASSWORD` and `User_EMAIL`/`User_PASSWORD` env vars
(see `.env.example`). Both roles currently land on the same admin; the `role` column is in place
for future gating (the bundle's unbuilt student app is the natural home for the `user` role).

## Deploy
First deploy done via the `deploy-eloquent-app` skill: `/var/www/ascend` on the shared droplet,
**SQLite in production** (matching gym), nginx vhost `academy.eloquentservice.com`, Certbot SSL.
Redeploy = the skill's one-liner (`git pull` → composer → `npm run build` → migrate → cache → chown).

## Stack
Laravel 13 · Inertia 2 · React 18 · TypeScript · Vite 8 · SQLite

## What it is
A real, server-routed Inertia SPA — **8 admin pages**, each with its own route and
controller method pulling live data from the database:

| Route | Page | Highlights |
|-------|------|-----------|
| `/` | Dashboard | KPI strip + sparklines, today's classes, enrollment bars, fee-collection gauge, at-risk students |
| `/students` | Students | roster table (course dots, attendance, avg, fees, status chips) |
| `/courses` | Courses | 6 colour-coded course cards w/ progress |
| `/timetable` | Timetable | weekly grid (Mon–Sat × 5 slots), cells tinted per course |
| `/attendance` | Attendance | **interactive** present/late/absent marking; `POST /attendance` persists |
| `/fees` | Fees | stat tiles + invoices table |
| `/reports` | Reports | enrollment chart + per-course performance bars |
| `/settings` | Settings | academy + notification toggles |

## Domain
`Course` · `Student` (⇄ `course_student` pivot) · `Payment` · `ClassSession` · `Attendance`.
Seeded from the prototype's `edu-data.js` via `AcademySeeder` — 6 courses, 8 students
(incl. Francis Gill S-1042), 15 enrollments, 6 invoices, 6 of today's sessions.
Static analytics (244 active students, enrollment trend, weekly grid, term meta) live in
`config/ascend.php` and are shared to every page via `HandleInertiaRequests`.

## Run
```
composer dev          # serve + vite + queue + logs
# or
php artisan migrate:fresh --seed && npm run build && php artisan serve
```

## Test
```
php artisan test --filter=AcademyTest
```
Covers: every page renders the right Inertia component, dashboard/students data shape,
attendance defaults to C1, attendance submit persists marks + redirects, and rejects
invalid status.

## Frontend layout
- `resources/css/eloquent-base.css` — tokens + admin chrome (sidebar/topbar/cards/buttons/tables/stat)
- `resources/css/ascend.css` — page components (kpi-strip, course-card, timetable grid, attendance, fee pills…)
- `resources/js/Components/` — `AdminLayout` (sidebar+topbar+flash toast), `AscendIcons`, `ui` (Btn/Card/PageHeader/StatTile/Spark)
- `resources/js/Pages/Academy/*.tsx` — the 8 pages

## Origin note
The same bundle also contains a **student mobile app** (`ASCEND Student.html`) — Home,
Schedule, Courses, Grades, Profile — sharing this dataset. NOT yet built; it's the
natural next surface if extending (shares courses + the student Francis Gill).
