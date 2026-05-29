import { Head } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';
import { Plus, Send } from '@/Components/AscendIcons';
import { Btn, Card, fmt, PageHeader, StatTile } from '@/Components/ui';

type Payment = {
    id: string;
    student: { initials: string; name: string };
    course: string;
    amount: number;
    method: string;
    date: string;
    status: string;
};

type Props = {
    payments: Payment[];
    stats: {
        collected: number;
        overdue: number;
        partial: number;
        overdueCount: number;
        partialCount: number;
        collectionRate: number;
    };
};

export default function Fees({ payments, stats }: Props) {
    return (
        <AdminLayout
            title="Fees"
            actions={
                <>
                    <Btn variant="secondary" icon={<Send size={15} />}>
                        Send reminders
                    </Btn>
                    <Btn variant="primary" icon={<Plus size={15} />}>
                        New invoice
                    </Btn>
                </>
            }
        >
            <Head title="Fees" />
            <div className="page">
                <PageHeader title="Fees" subtitle="Spring term · invoices & payments" />
                <div className="res-stat-row">
                    <StatTile label="Collected" currency="AED" value={fmt(stats.collected).replace('AED ', '')} delta="+12%" deltaDir="up" sub="vs Apr" />
                    <StatTile
                        label="Overdue"
                        currency="AED"
                        value={fmt(stats.overdue).replace('AED ', '')}
                        delta={`${stats.overdueCount} students`}
                        deltaDir="down"
                    />
                    <StatTile
                        label="Partial"
                        currency="AED"
                        value={fmt(stats.partial).replace('AED ', '')}
                        delta={`${stats.partialCount} plan`}
                        deltaDir="flat"
                    />
                    <StatTile label="Collection rate" value={`${stats.collectionRate}%`} delta="+4pt" deltaDir="up" />
                </div>
                <Card padding={false} title="Recent invoices">
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Invoice</th>
                                    <th>Student</th>
                                    <th>Course</th>
                                    <th className="right">Amount</th>
                                    <th>Method</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((p) => (
                                    <tr key={p.id}>
                                        <td className="num" style={{ color: 'var(--text-1)' }}>
                                            {p.id}
                                        </td>
                                        <td>
                                            <div className="cust-row">
                                                <div className="att-av" style={{ width: 28, height: 28, fontSize: 10 }}>
                                                    {p.student.initials}
                                                </div>
                                                <div className="cust-name">{p.student.name}</div>
                                            </div>
                                        </td>
                                        <td className="muted">{p.course}</td>
                                        <td className="right num" style={{ color: 'var(--text-1)' }}>
                                            AED {p.amount.toLocaleString()}
                                        </td>
                                        <td className="muted">{p.method}</td>
                                        <td className="muted num">{p.date}</td>
                                        <td>
                                            <span className={`fee-pill ${p.status}`}>{p.status}</span>
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
