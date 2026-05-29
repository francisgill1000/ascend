import { Head } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';
import { Download } from '@/Components/AscendIcons';
import { Btn, Card, PageHeader, StatTile } from '@/Components/ui';

type Props = {
    enrollment: { m: string; v: number }[];
    termRevenue: string;
    courses: { id: string; name: string; color: string; score: number }[];
};

export default function Reports({ enrollment, termRevenue, courses }: Props) {
    const maxE = Math.max(...enrollment.map((d) => d.v));

    return (
        <AdminLayout title="Reports" actions={<Btn variant="secondary" icon={<Download size={15} />}>Export PDF</Btn>}>
            <Head title="Reports" />
            <div className="page">
                <PageHeader title="Reports" subtitle="Academy performance · spring term" />
                <div className="res-stat-row">
                    <StatTile label="Avg score" value="84%" delta="+3pt" deltaDir="up" />
                    <StatTile label="Pass rate" value="92%" delta="+1pt" deltaDir="up" />
                    <StatTile label="Retention" value="88%" delta="term" deltaDir="flat" />
                    <StatTile label="Revenue · term" currency="AED" value={termRevenue} delta="+18%" deltaDir="up" />
                </div>
                <div className="report-grid">
                    <Card title="Enrollment" action={<span className="muted" style={{ fontSize: 12 }}>6 months</span>}>
                        <div className="dp-bars" style={{ height: 170 }}>
                            {enrollment.map((d, i) => (
                                <div key={i} className="dp-bar-col">
                                    <div className={`dp-bar ${d.v === maxE ? 'peak' : ''}`} style={{ height: `${(d.v / maxE) * 100}%` }}>
                                        <span className="cap">{d.v}</span>
                                    </div>
                                    <span className="dp-label">{d.m}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                    <Card title="Course performance">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                            {courses.map((c) => (
                                <div key={c.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}>
                                        <span style={{ color: 'var(--text-2)' }}>{c.name.split(' · ')[0]}</span>
                                        <span className="num" style={{ color: 'var(--text-3)' }}>
                                            {c.score}%
                                        </span>
                                    </div>
                                    <div className="quota-bar" style={{ height: 6 }}>
                                        <div
                                            className="quota-fill"
                                            style={{ width: `${c.score}%`, background: `linear-gradient(90deg, ${c.color}, ${c.color}cc)`, boxShadow: 'none' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
