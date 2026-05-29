import { Head } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';
import { Download, Plus, Search } from '@/Components/AscendIcons';
import { Btn, Card, fmtK, PageHeader } from '@/Components/ui';

type Student = {
    id: string;
    initials: string;
    name: string;
    grade: string;
    courses: { id: string; name: string; color: string }[];
    attendance: number;
    due: number;
    avg: number;
    status: string;
    parent: string;
};

type Props = { students: Student[]; totalCount: number; courseCount: number };

export default function Students({ students, totalCount, courseCount }: Props) {
    const attColor = (a: number) => (a >= 0.85 ? 'var(--mint-300)' : a >= 0.75 ? '#fbd38d' : '#fca5a5');

    return (
        <AdminLayout
            title="Students"
            actions={
                <>
                    <Btn variant="secondary" icon={<Download size={15} />}>
                        Export
                    </Btn>
                    <Btn variant="primary" icon={<Plus size={15} />}>
                        Enroll student
                    </Btn>
                </>
            }
        >
            <Head title="Students" />
            <div className="page">
                <PageHeader title="Students" subtitle={`${totalCount} enrolled · ${courseCount} courses`} />
                <Card
                    padding={false}
                    title="Roster"
                    action={
                        <div className="search" style={{ width: 220 }}>
                            <Search size={13} />
                            <input placeholder="Filter students…" />
                        </div>
                    }
                >
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Grade</th>
                                    <th>Courses</th>
                                    <th>Attendance</th>
                                    <th className="right">Avg score</th>
                                    <th>Fees</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((s) => (
                                    <tr key={s.id}>
                                        <td>
                                            <div className="cust-row">
                                                <div className="att-av" style={{ width: 32, height: 32 }}>
                                                    {s.initials}
                                                </div>
                                                <div>
                                                    <div className="cust-name">{s.name}</div>
                                                    <div className="cust-sub">
                                                        {s.id} · {s.parent}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="muted">{s.grade}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                {s.courses.map((c) => (
                                                    <span
                                                        key={c.id}
                                                        title={c.name}
                                                        style={{ width: 8, height: 8, borderRadius: 3, background: c.color }}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="num" style={{ color: attColor(s.attendance) }}>
                                                {Math.round(s.attendance * 100)}%
                                            </span>
                                        </td>
                                        <td className="right num" style={{ color: 'var(--text-1)' }}>
                                            {s.avg}
                                        </td>
                                        <td>
                                            {s.due > 0 ? (
                                                <span className="fee-pill overdue">AED {fmtK(s.due)}</span>
                                            ) : (
                                                <span className="fee-pill paid">Clear</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`status-chip ${s.status}`}>
                                                <span className="pip" />
                                                {s.status === 'active' ? 'Active' : 'At risk'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}
