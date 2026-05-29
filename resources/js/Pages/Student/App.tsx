import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    AscendMark,
    Award,
    Bell,
    Book,
    Calendar,
    Card as CardIcon,
    Check,
    ChevronRight,
    Doc,
    Home as HomeIcon,
    Logout,
    Pencil,
    Star,
    UserIcon,
    Video,
} from '@/Components/AscendIcons';
import { fmt } from '@/Components/ui';

type Me = {
    id: string;
    initials: string;
    name: string;
    grade: string;
    parent: string;
    attendance: number;
    avg: number;
    due: number;
    courseCount: number;
};
type Course = { id: string; name: string; code: string; color: string; teacher: string; sessions: number; progress: number };
type Klass = { id: string; time: string; end: string; room: string; topic: string; status: string; course: { name: string; color: string; teacher: string } };
type CourseLite = { name: string; color: string; teacher: string; room: string; code: string };
type Assignment = { id: string; title: string; due: string; status: string; score: number | null; course: { name: string; code: string; color: string } };

type Props = {
    me: Me;
    courses: Course[];
    today: Klass[];
    week: { days: string[]; slots: string[]; grid: (string | null)[][] };
    courseLookup: Record<string, CourseLite>;
    assignments: Assignment[];
};

function Ring({ pct, color = '#00ffcc', label, val }: { pct: number; color?: string; label: string; val: string | number }) {
    const R = 32;
    const C = 2 * Math.PI * R;
    const dash = (pct / 100) * C;
    return (
        <div className="es-ring">
            <svg width="76" height="76" viewBox="0 0 76 76">
                <circle cx="38" cy="38" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                <circle
                    cx="38"
                    cy="38"
                    r={R}
                    fill="none"
                    stroke={color}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${C}`}
                    style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
                />
            </svg>
            <div className="c">
                <div>
                    <div className="v">{val}</div>
                    <div className="l">{label}</div>
                </div>
            </div>
        </div>
    );
}

export default function StudentApp({ me, courses, today, week, courseLookup, assignments }: Props) {
    const [tab, setTab] = useState('home');
    const logout = () => router.post(route('logout'));

    const live = today.find((t) => t.status === 'live');
    const pending = assignments.filter((a) => a.status === 'pending');
    const graded = assignments.filter((a) => a.status === 'graded');

    const Home = () => (
        <div className="m-screen">
            <div className="es-hero">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span className="mb-crumb" style={{ color: 'var(--mint-300)' }}>
                        <AscendMark size={15} /> ASCEND
                    </span>
                    <div className="m-icon-btn">
                        <Bell size={18} />
                        <span className="dot-badge" />
                    </div>
                </div>
                <div className="greet">Good morning,</div>
                <h1>{me.name.split(' ')[0]} 👋</h1>
            </div>
            <div className="m-scroll" style={{ paddingTop: 14 }}>
                <div className="es-progress-card">
                    <Ring pct={me.attendance * 100} val={`${Math.round(me.attendance * 100)}%`} label="Attend" />
                    <div className="es-prog-stats">
                        <div className="r">
                            <span className="l">Avg score</span>
                            <span className="v">{me.avg}%</span>
                        </div>
                        <div className="r">
                            <span className="l">Courses</span>
                            <span className="v">{me.courseCount}</span>
                        </div>
                        <div className="r">
                            <span className="l">Rank</span>
                            <span className="v">3 / 38</span>
                        </div>
                    </div>
                </div>

                {live && (
                    <>
                        <div className="mb-sec">
                            <h3>Live now</h3>
                        </div>
                        <div className="es-next">
                            <div className="spine" style={{ background: live.course.color }} />
                            <span className="live-tag">
                                <span className="pulse-dot" style={{ width: 5, height: 5 }} />
                                Live
                            </span>
                            <div className="eyebrow">
                                {live.time} – {live.end} · {live.room}
                            </div>
                            <h3>{live.course.name}</h3>
                            <div className="sub">
                                {live.topic} · {live.course.teacher}
                            </div>
                            <button className="join">
                                <Video size={16} /> Join class
                            </button>
                        </div>
                    </>
                )}

                <div className="mb-sec">
                    <h3>Today's classes</h3>
                    <span className="link" onClick={() => setTab('schedule')}>
                        Schedule
                    </span>
                </div>
                {today.map((t) => (
                    <div key={t.id} className="es-cls">
                        <div className="t">
                            {t.time}
                            <span className="e">{t.end}</span>
                        </div>
                        <div className="spine" style={{ background: t.course.color }} />
                        <div style={{ flex: 1 }}>
                            <div className="nm">{t.course.name}</div>
                            <div className="mt">
                                {t.room} · {t.topic}
                            </div>
                        </div>
                        {t.status === 'done' && <Check size={16} style={{ color: 'var(--mint-300)' }} />}
                        {t.status === 'live' && (
                            <span className="cls-status live" style={{ fontSize: 9 }}>
                                <span className="pulse-dot" style={{ width: 4, height: 4 }} />
                                Live
                            </span>
                        )}
                    </div>
                ))}

                <div className="mb-sec">
                    <h3>Due soon</h3>
                    <span className="link" onClick={() => setTab('grades')}>
                        All
                    </span>
                </div>
                {pending.map((a) => (
                    <div key={a.id} className="m-settings-group" style={{ marginBottom: 8 }}>
                        <div className="m-settings-row" style={{ borderBottom: 0 }}>
                            <div className="ico" style={{ background: `color-mix(in oklab, ${a.course.color} 14%, transparent)`, color: a.course.color }}>
                                <Doc size={16} />
                            </div>
                            <div className="body">
                                <div className="l">{a.title}</div>
                                <div className="s">
                                    {a.course.code} · due {a.due}
                                </div>
                            </div>
                            <span className="chev">
                                <ChevronRight size={14} />
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const Schedule = () => {
        const [day, setDay] = useState(4); // Fri
        const daySlots = week.slots.map((slot, si) => ({ slot, cid: week.grid[day][si] })).filter((x) => x.cid);
        return (
            <div className="m-screen">
                <div className="m-appbar">
                    <div>
                        <h1 style={{ fontSize: 22 }}>Schedule</h1>
                        <div className="sub">Week 8 · Spring term</div>
                    </div>
                </div>
                <div className="m-scroll" style={{ paddingTop: 4 }}>
                    <div className="mb-date-row">
                        {week.days.map((d, i) => (
                            <div key={d} className={`mb-date ${day === i ? 'active' : ''}`} onClick={() => setDay(i)} style={{ flex: '0 0 52px' }}>
                                <div className="dow">{d}</div>
                                <div className="dnum">{25 + i}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: 16 }}>
                        {daySlots.length === 0 ? (
                            <div className="mo-empty">
                                <div className="t">No classes</div>
                                <div className="s">Enjoy your day off</div>
                            </div>
                        ) : (
                            daySlots.map(({ slot, cid }) => {
                                const c = courseLookup[cid as string];
                                return (
                                    <div key={slot} className="es-cls">
                                        <div className="t">{slot}</div>
                                        <div className="spine" style={{ background: c.color }} />
                                        <div style={{ flex: 1 }}>
                                            <div className="nm">{c.name}</div>
                                            <div className="mt">
                                                {c.teacher} · {c.room}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const Courses = () => (
        <div className="m-screen">
            <div className="m-appbar">
                <div>
                    <h1 style={{ fontSize: 22 }}>My courses</h1>
                    <div className="sub">{courses.length} enrolled</div>
                </div>
            </div>
            <div className="m-scroll" style={{ paddingTop: 6 }}>
                {courses.map((c) => (
                    <div key={c.id} className="es-course">
                        <div className="h">
                            <div className="ic" style={{ background: `color-mix(in oklab, ${c.color} 16%, transparent)`, color: c.color }}>
                                <Book size={20} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="nm">{c.name}</div>
                                <div className="tch">
                                    {c.teacher} · {c.code}
                                </div>
                            </div>
                            <ChevronRight size={16} style={{ color: 'var(--text-4)' }} />
                        </div>
                        <div className="prog">
                            <i style={{ width: `${c.progress * 100}%`, background: c.color }} />
                        </div>
                        <div className="pm">
                            <span>{Math.round(c.progress * 100)}% complete</span>
                            <span>
                                {Math.round(c.sessions * c.progress)}/{c.sessions} sessions
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const Grades = () => (
        <div className="m-screen">
            <div className="m-appbar">
                <div>
                    <h1 style={{ fontSize: 22 }}>Grades</h1>
                    <div className="sub">Avg {me.avg}% · rank 3 of 38</div>
                </div>
            </div>
            <div className="m-scroll" style={{ paddingTop: 6 }}>
                <div className="es-progress-card" style={{ marginBottom: 18 }}>
                    <Ring pct={me.avg} val={me.avg} label="Avg" />
                    <div className="es-prog-stats">
                        <div className="r">
                            <span className="l">Highest</span>
                            <span className="v">95 · Calculus</span>
                        </div>
                        <div className="r">
                            <span className="l">This term</span>
                            <span className="v">+6 pts</span>
                        </div>
                        <div className="r">
                            <span className="l">Pending</span>
                            <span className="v">{pending.length}</span>
                        </div>
                    </div>
                </div>
                <div className="mb-sec">
                    <h3 style={{ fontSize: 13, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Graded</h3>
                </div>
                {graded.map((a) => {
                    const col = (a.score ?? 0) >= 90 ? '#00ffcc' : (a.score ?? 0) >= 75 ? '#60a5fa' : '#fbd38d';
                    return (
                        <div key={a.id} className="es-grade-row">
                            <div className="es-grade-score" style={{ background: `color-mix(in oklab, ${col} 14%, transparent)`, color: col }}>
                                {a.score}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="nm">{a.title}</div>
                                <div className="mt">
                                    {a.course.name} · {a.course.code}
                                </div>
                            </div>
                            <Star size={15} fill={col} style={{ color: col }} />
                        </div>
                    );
                })}
                <div className="mb-sec">
                    <h3 style={{ fontSize: 13, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pending</h3>
                </div>
                {pending.map((a) => (
                    <div key={a.id} className="es-grade-row">
                        <div className="es-grade-score" style={{ background: 'var(--surface-2)', color: 'var(--text-4)' }}>
                            <Doc size={18} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div className="nm">{a.title}</div>
                            <div className="mt">
                                {a.course.code} · due {a.due}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const Profile = () => (
        <div className="m-screen">
            <div className="m-appbar">
                <div>
                    <h1 style={{ fontSize: 22 }}>Profile</h1>
                    <div className="sub">
                        {me.id} · {me.grade}
                    </div>
                </div>
            </div>
            <div className="m-scroll" style={{ paddingTop: 6 }}>
                <div className="mb-prof-hero">
                    <div className="mb-prof-av">{me.initials}</div>
                    <div>
                        <h2>{me.name}</h2>
                        <div className="sub">
                            {me.grade} · Parent: {me.parent}
                        </div>
                    </div>
                </div>

                <div className={`es-fee-card ${me.due === 0 ? 'clear' : ''}`} style={{ marginBottom: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div
                                style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: 10.5,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    color: me.due === 0 ? 'var(--mint-300)' : '#fbd38d',
                                }}
                            >
                                Fees · spring term
                            </div>
                            <div style={{ fontSize: 26, fontWeight: 600, color: 'var(--text-1)', marginTop: 6 }}>
                                {me.due === 0 ? 'All clear' : fmt(me.due)}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 2 }}>
                                {me.due === 0 ? 'Next invoice Jun 1' : 'Due in 5 days'}
                            </div>
                        </div>
                        <CardIcon size={26} style={{ color: me.due === 0 ? 'var(--mint-300)' : '#fbd38d' }} />
                    </div>
                </div>

                <div className="m-settings-group">
                    <div className="m-settings-row">
                        <div className="ico mint">
                            <Award size={16} />
                        </div>
                        <div className="body">
                            <div className="l">Attendance</div>
                            <div className="s">{Math.round(me.attendance * 100)}% this term</div>
                        </div>
                        <span className="chev">
                            <ChevronRight size={14} />
                        </span>
                    </div>
                    <div className="m-settings-row">
                        <div className="ico">
                            <Doc size={16} />
                        </div>
                        <div className="body">
                            <div className="l">Report cards</div>
                            <div className="s">Spring · Fall 2025</div>
                        </div>
                        <span className="chev">
                            <ChevronRight size={14} />
                        </span>
                    </div>
                    <div className="m-settings-row">
                        <div className="ico">
                            <CardIcon size={16} />
                        </div>
                        <div className="body">
                            <div className="l">Payment history</div>
                            <div className="s">3 invoices</div>
                        </div>
                        <span className="chev">
                            <ChevronRight size={14} />
                        </span>
                    </div>
                </div>
                <div className="m-settings-group">
                    <div className="m-settings-row">
                        <div className="ico">
                            <Bell size={16} />
                        </div>
                        <div className="body">
                            <div className="l">Class reminders</div>
                        </div>
                        <span className="switch on" />
                    </div>
                    <div className="m-settings-row">
                        <div className="ico">
                            <Pencil size={16} />
                        </div>
                        <div className="body">
                            <div className="l">Grade alerts</div>
                        </div>
                        <span className="switch on" />
                    </div>
                </div>

                <button className="m-signout" onClick={logout}>
                    <Logout size={16} /> Sign out
                </button>
                <div className="m-app-footer">ASCEND · v1.0.0</div>
            </div>
        </div>
    );

    const tabs = [
        { id: 'home', label: 'Home', icon: HomeIcon },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
        { id: 'courses', label: 'Courses', icon: Book },
        { id: 'grades', label: 'Grades', icon: Award },
        { id: 'profile', label: 'Profile', icon: UserIcon },
    ];

    let screen;
    if (tab === 'schedule') screen = <Schedule />;
    else if (tab === 'courses') screen = <Courses />;
    else if (tab === 'grades') screen = <Grades />;
    else if (tab === 'profile') screen = <Profile />;
    else screen = <Home />;

    return (
        <div className="student-app">
            <Head title="My Academy" />
            {screen}
            <div className="m-tabbar">
                {tabs.map((t) => {
                    const Ico = t.icon;
                    return (
                        <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                            <span className="icon">
                                <Ico size={20} />
                            </span>
                            <span>{t.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
