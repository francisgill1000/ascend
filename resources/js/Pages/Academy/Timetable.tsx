import { Head } from '@inertiajs/react';
import { Fragment } from 'react';
import AdminLayout from '@/Components/AdminLayout';
import { Calendar, Plus } from '@/Components/AscendIcons';
import { Btn, Card, PageHeader } from '@/Components/ui';

type CourseLite = { code: string; name: string; color: string; room: string };
type Props = {
    week: { days: string[]; slots: string[]; grid: (string | null)[][] };
    courses: Record<string, CourseLite>;
};

export default function Timetable({ week, courses }: Props) {
    return (
        <AdminLayout
            title="Timetable"
            actions={
                <>
                    <Btn variant="secondary" icon={<Calendar size={15} />}>
                        This week
                    </Btn>
                    <Btn variant="primary" icon={<Plus size={15} />}>
                        Add session
                    </Btn>
                </>
            }
        >
            <Head title="Timetable" />
            <div className="page">
                <PageHeader title="Timetable" subtitle="Weekly schedule · all courses" />
                <Card>
                    <div className="tt-wrap">
                        <div className="tt-grid">
                            <div className="tt-head" />
                            {week.days.map((d) => (
                                <div key={d} className="tt-head">
                                    {d}
                                </div>
                            ))}
                            {week.slots.map((slot, si) => (
                                <Fragment key={slot}>
                                    <div className="tt-slot-label">{slot}</div>
                                    {week.days.map((d, di) => {
                                        const cid = week.grid[di][si];
                                        if (!cid) return <div key={d} className="tt-cell empty" />;
                                        const c = courses[cid];
                                        return (
                                            <div
                                                key={d}
                                                className="tt-cell"
                                                style={{
                                                    borderColor: `color-mix(in oklab, ${c.color} 30%, var(--border-1))`,
                                                    background: `color-mix(in oklab, ${c.color} 8%, transparent)`,
                                                }}
                                            >
                                                <span className="c-code" style={{ color: c.color }}>
                                                    {c.code}
                                                </span>
                                                <span className="c-nm">{c.name.split(' · ')[0]}</span>
                                                <span className="c-room">{c.room}</span>
                                            </div>
                                        );
                                    })}
                                </Fragment>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}
