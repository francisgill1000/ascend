import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';
import { ArrowUp, Book, Card as CardIcon, ChevronRight, Clipboard, Download, GradCap, Plus, Send } from '@/Components/AscendIcons';
import { Btn, Card, fmtK, PageHeader, Spark, StatTile } from '@/Components/ui';

type Klass = {
    id: string;
    time: string;
    end: string;
    room: string;
    topic: string;
    status: string;
    course: { name: string; color: string; teacher: string };
};
type AtRisk = { id: string; initials: string; name: string; attendance: number; avg: number; due: number };

type Props = {
    kpis: { students: number; attendance: number; courses: number; collected: number };
    enrollment: { m: string; v: number }[];
    todayClasses: Klass[];
    fees: { collected: number; overdue: number; collectionRate: number };
    atRisk: AtRisk[];
};

function ClsStatus({ status }: { status: string }) {
    if (status === 'live')
        return (
            <span className="cls-status live">
                <span className="pulse-dot" style={{ width: 5, height: 5 }} />
                Live
            </span>
        );
    if (status === 'next') return <span className="cls-status next">Next</span>;
    if (status === 'done') return <span className="cls-status done">Done</span>;
    return <span className="cls-status upcoming">Upcoming</span>;
}

export default function Dashboard({ kpis, enrollment, todayClasses, fees, atRisk }: Props) {
    const academy = usePage().props.academy as { todayLabel: string; termLabel: string };
    const maxEnroll = Math.max(...enrollment.map((d) => d.v));
    const go = (name: string) => router.visit(route(name));

    return (
        <AdminLayout
            title="Dashboard"
            live
            actions={
                <>
                    <Btn variant="secondary" icon={<Download size={15} />}>
                        Report
                    </Btn>
                    <Btn variant="primary" icon={<Plus size={15} />}>
                        Enroll student
                    </Btn>
                </>
            }
        >
            <Head title="Dashboard" />
            <div className="page">
                <PageHeader title="Dashboard" subtitle={`${academy.todayLabel} · ${academy.termLabel}`} />

                <div className="kpi-strip">
                    <div className="kpi">
                        <div className="top">
                            <div className="ico mint">
                                <GradCap size={18} />
                            </div>
                            <span className="trend up">
                                <ArrowUp size={12} /> 21
                            </span>
                        </div>
                        <div className="label">Active students</div>
                        <div className="value">{kpis.students}</div>
                        <div className="spark">
                            <Spark data={enrollment.map((d) => d.v)} id="k1" />
                        </div>
                    </div>
                    <div className="kpi">
                        <div className="top">
                            <div className="ico blue">
                                <Clipboard size={18} />
                            </div>
                            <span className="trend up">
                                <ArrowUp size={12} /> 2pt
                            </span>
                        </div>
                        <div className="label">Attendance · today</div>
                        <div className="value">{kpis.attendance}%</div>
                        <div className="spark">
                            <Spark data={[82, 85, 84, 88, 86, 90, 89]} color="#60a5fa" id="k2" />
                        </div>
                    </div>
                    <div className="kpi">
                        <div className="top">
                            <div className="ico violet">
                                <Book size={18} />
                            </div>
                            <span className="trend up">
                                <ArrowUp size={12} /> 1
                            </span>
                        </div>
                        <div className="label">Active courses</div>
                        <div className="value">{kpis.courses}</div>
                        <div className="spark">
                            <Spark data={[3, 4, 4, 5, 5, 6]} color="#c4b5fd" id="k3" />
                        </div>
                    </div>
                    <div className="kpi">
                        <div className="top">
                            <div className="ico amber">
                                <CardIcon size={18} />
                            </div>
                            <span className="trend up">
                                <ArrowUp size={12} /> 12%
                            </span>
                        </div>
                        <div className="label">Fees · May</div>
                        <div className="value">AED {fmtK(kpis.collected)}</div>
                        <div className="spark">
                            <Spark data={[28, 32, 40, 44, 52, 58]} color="#fbd38d" id="k4" />
                        </div>
                    </div>
                </div>

                <div className="mz-grid">
                    <div className="mz-col">
                        <Card
                            title="Today's classes"
                            action={
                                <Btn variant="ghost" size="sm" onClick={() => go('academy.timetable')}>
                                    Timetable <ChevronRight size={13} />
                                </Btn>
                            }
                        >
                            {todayClasses.map((t) => (
                                <div key={t.id} className="cls-row">
                                    <div className="cls-time">
                                        {t.time}
                                        <span className="e">{t.end}</span>
                                    </div>
                                    <div className="cls-spine" style={{ background: t.course.color }} />
                                    <div>
                                        <div className="cls-name">{t.course.name}</div>
                                        <div className="cls-meta">
                                            <span>{t.course.teacher}</span>
                                            <span className="dot" />
                                            <span>{t.room}</span>
                                            <span className="dot" />
                                            <span>{t.topic}</span>
                                        </div>
                                    </div>
                                    <ClsStatus status={t.status} />
                                </div>
                            ))}
                        </Card>

                        <Card title="Enrollment trend" action={<span className="muted" style={{ fontSize: 12 }}>6 months</span>}>
                            <div className="dp-bars" style={{ height: 150 }}>
                                {enrollment.map((d, i) => (
                                    <div key={i} className="dp-bar-col">
                                        <div className={`dp-bar ${d.v === maxEnroll ? 'peak' : ''}`} style={{ height: `${(d.v / maxEnroll) * 100}%` }}>
                                            <span className="cap">{d.v}</span>
                                        </div>
                                        <span className="dp-label">{d.m}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <div className="mz-col">
                        <Card
                            title="Fee collection"
                            action={
                                <Btn variant="ghost" size="sm" onClick={() => go('academy.fees')}>
                                    All <ChevronRight size={13} />
                                </Btn>
                            }
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                                <div className="kpi-tile">
                                    <div className="kpi-tile-label">Collected</div>
                                    <div className="kpi-tile-value" style={{ color: 'var(--mint-300)' }}>
                                        AED {fmtK(fees.collected)}
                                    </div>
                                </div>
                                <div className="kpi-tile">
                                    <div className="kpi-tile-label">Overdue</div>
                                    <div className="kpi-tile-value" style={{ color: '#fca5a5' }}>
                                        AED {fmtK(fees.overdue)}
                                    </div>
                                </div>
                            </div>
                            <div className="quota-bar" style={{ height: 8 }}>
                                <div className="quota-fill" style={{ width: `${fees.collectionRate}%` }} />
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: 11.5,
                                    color: 'var(--text-4)',
                                    marginTop: 8,
                                    fontFamily: 'var(--font-mono)',
                                }}
                            >
                                <span>{fees.collectionRate}% collected</span>
                                <span>{100 - fees.collectionRate}% pending</span>
                            </div>
                        </Card>

                        <Card title="Needs attention" action={<span className="muted" style={{ fontSize: 12 }}>at-risk</span>}>
                            {atRisk.map((s) => (
                                <div key={s.id} className="lb-row">
                                    <div className="lb-av">{s.initials}</div>
                                    <div>
                                        <div className="lb-name">{s.name}</div>
                                        <div className="lb-meta">
                                            <span>{Math.round(s.attendance * 100)}% attendance</span>
                                            <span className="dot" />
                                            <span>avg {s.avg}</span>
                                        </div>
                                    </div>
                                    <span className="fee-pill overdue">AED {fmtK(s.due)}</span>
                                </div>
                            ))}
                            <div className="lb-row" style={{ borderBottom: 0 }}>
                                <div className="lb-av" style={{ color: '#93c5fd' }}>
                                    RP
                                </div>
                                <div>
                                    <div className="lb-name">3 students below 80% attendance</div>
                                    <div className="lb-meta">Send reminder to parents</div>
                                </div>
                                <Btn variant="ghost" size="sm" icon={<Send size={14} />} />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
