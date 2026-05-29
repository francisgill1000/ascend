import { Head } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';
import { Plus } from '@/Components/AscendIcons';
import { Btn, fmtK, PageHeader } from '@/Components/ui';

type Course = {
    id: string;
    name: string;
    code: string;
    color: string;
    teacher: string;
    level: string;
    room: string;
    students: number;
    sessions: number;
    fee: number;
    progress: number;
};

export default function Courses({ courses }: { courses: Course[] }) {
    return (
        <AdminLayout title="Courses" actions={<Btn variant="primary" icon={<Plus size={15} />}>New course</Btn>}>
            <Head title="Courses" />
            <div className="page">
                <PageHeader title="Courses" subtitle={`${courses.length} active courses · spring term`} />
                <div className="course-grid">
                    {courses.map((c) => (
                        <div key={c.id} className="course-card">
                            <div className="top" style={{ background: `linear-gradient(135deg, ${c.color}22, transparent)` }}>
                                <span
                                    className="code"
                                    style={{ background: `color-mix(in oklab, ${c.color} 18%, transparent)`, color: c.color }}
                                >
                                    {c.code}
                                </span>
                            </div>
                            <div className="body">
                                <div className="nm">{c.name}</div>
                                <div className="tch">
                                    {c.teacher} · {c.level} · {c.room}
                                </div>
                                <div className="c-stats">
                                    <div className="c-stat">
                                        <div className="v">{c.students}</div>
                                        <div className="l">Students</div>
                                    </div>
                                    <div className="c-stat">
                                        <div className="v">{c.sessions}</div>
                                        <div className="l">Sessions</div>
                                    </div>
                                    <div className="c-stat">
                                        <div className="v">{fmtK(c.fee)}</div>
                                        <div className="l">Fee · AED</div>
                                    </div>
                                </div>
                                <div className="prog">
                                    <i style={{ width: `${c.progress * 100}%`, background: c.color }} />
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: 11,
                                        color: 'var(--text-4)',
                                        marginTop: 7,
                                    }}
                                >
                                    <span>{Math.round(c.progress * 100)}% complete</span>
                                    <span>
                                        {Math.round(c.sessions * c.progress)}/{c.sessions} sessions
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
