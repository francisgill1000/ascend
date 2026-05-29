import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Components/AdminLayout';
import { Check, Download } from '@/Components/AscendIcons';
import { Btn, Card, PageHeader } from '@/Components/ui';

type Mark = 'present' | 'late' | 'absent';
type RosterRow = { id: string; initials: string; name: string; grade: string; attendance: number };
type Props = {
    courses: { id: string; code: string }[];
    selected: { id: string; name: string; teacher: string };
    roster: RosterRow[];
};

export default function Attendance({ courses, selected, roster }: Props) {
    const [marks, setMarks] = useState<Record<string, Mark>>({});
    const [saving, setSaving] = useState(false);

    const markFor = (id: string): Mark => marks[id] ?? 'present';
    const set = (id: string, v: Mark) => setMarks((m) => ({ ...m, [id]: v }));
    const present = roster.filter((s) => markFor(s.id) === 'present').length;

    const switchCourse = (id: string) => {
        if (id === selected.id) return;
        setMarks({});
        router.get(route('academy.attendance'), { course: id }, { preserveState: false, preserveScroll: true });
    };

    const submit = () => {
        setSaving(true);
        router.post(
            route('academy.attendance.submit'),
            { course: selected.id, marks: roster.map((s) => ({ id: s.id, status: markFor(s.id) })) },
            { preserveScroll: true, onFinish: () => setSaving(false) },
        );
    };

    return (
        <AdminLayout
            title="Attendance"
            live
            actions={
                <>
                    <Btn variant="secondary" icon={<Download size={15} />}>
                        History
                    </Btn>
                    <Btn variant="primary" icon={<Check size={15} />} onClick={submit} disabled={saving}>
                        Submit attendance
                    </Btn>
                </>
            }
        >
            <Head title="Attendance" />
            <div className="page">
                <PageHeader title="Attendance" subtitle={`${selected.name} · ${selected.teacher} · today's session`} />

                <div className="att-toolbar">
                    <div className="seg-toggle">
                        {courses.map((cc) => (
                            <button key={cc.id} className={cc.id === selected.id ? 'active' : ''} onClick={() => switchCourse(cc.id)}>
                                {cc.code}
                            </button>
                        ))}
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, fontSize: 12.5, color: 'var(--text-3)' }}>
                        <span>
                            <span style={{ color: 'var(--mint-300)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{present}</span> present
                        </span>
                        <span>
                            <span style={{ color: '#fca5a5', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{roster.length - present}</span> absent
                        </span>
                    </div>
                </div>

                <Card padding={false}>
                    <div style={{ padding: '4px 18px' }}>
                        {roster.map((s) => {
                            const v = markFor(s.id);
                            return (
                                <div key={s.id} className="att-row">
                                    <div className="att-av">{s.initials}</div>
                                    <div>
                                        <div className="cls-name">{s.name}</div>
                                        <div className="cls-meta">
                                            {s.id} · {s.grade} · {Math.round(s.attendance * 100)}% term
                                        </div>
                                    </div>
                                    <div className="att-toggle">
                                        <button className={`present ${v === 'present' ? 'on' : ''}`} onClick={() => set(s.id, 'present')}>
                                            Present
                                        </button>
                                        <button className={`late ${v === 'late' ? 'on' : ''}`} onClick={() => set(s.id, 'late')}>
                                            Late
                                        </button>
                                        <button className={`absent ${v === 'absent' ? 'on' : ''}`} onClick={() => set(s.id, 'absent')}>
                                            Absent
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}
