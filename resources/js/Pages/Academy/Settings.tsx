import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Components/AdminLayout';
import { Card, PageHeader } from '@/Components/ui';

type Props = { term: string; workingDays: string };

function SettingRow({ label, value, toggle, defaultOn }: { label: string; value?: string; toggle?: boolean; defaultOn?: boolean }) {
    const [on, setOn] = useState(!!defaultOn);
    return (
        <div className="setting-row">
            <span className="lbl">{label}</span>
            {toggle ? (
                <button className={`avail-switch ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => setOn((v) => !v)} />
            ) : (
                <span className="val">{value}</span>
            )}
        </div>
    );
}

export default function Settings({ term, workingDays }: Props) {
    return (
        <AdminLayout title="Settings">
            <Head title="Settings" />
            <div className="page">
                <PageHeader title="Settings" subtitle="Academy preferences" />
                <div className="settings-grid">
                    <Card title="Academy">
                        <SettingRow label="Term" value={term} />
                        <SettingRow label="Working days" value={workingDays} />
                        <SettingRow label="Attendance alerts to parents" toggle defaultOn />
                        <SettingRow label="Auto fee reminders" toggle defaultOn />
                    </Card>
                    <Card title="Notifications">
                        <SettingRow label="Low attendance alerts" toggle defaultOn />
                        <SettingRow label="Grade publish notifications" toggle defaultOn />
                        <SettingRow label="Class cancellation push" toggle defaultOn />
                        <SettingRow label="Weekly digest" value="Off" />
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
