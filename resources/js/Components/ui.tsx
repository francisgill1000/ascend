import { ReactNode } from 'react';
import { ArrowDown, ArrowUp } from './AscendIcons';

/* ─── Formatting helpers (ported from edu-data.js) ─── */
export const fmt = (n: number) => 'AED ' + Number(n).toLocaleString('en-AE', { maximumFractionDigits: 0 });
export const fmtK = (n: number) => (n / 1000).toFixed(1) + 'k';
export const pct = (n: number) => Math.round(n * 100) + '%';

/* ─── Button ─── */
type BtnProps = {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    icon?: ReactNode;
    children?: ReactNode;
    type?: 'button' | 'submit';
    disabled?: boolean;
    onClick?: () => void;
};

export function Btn({ variant = 'secondary', size = 'md', icon, children, type = 'button', disabled, onClick }: BtnProps) {
    const cls = [
        'btn',
        `btn-${variant}`,
        size === 'sm' && 'btn-sm',
        size === 'lg' && 'btn-lg',
        !children && 'btn-icon',
    ].filter(Boolean).join(' ');
    return (
        <button type={type} className={cls} onClick={onClick} disabled={disabled}>
            {icon}
            {children}
        </button>
    );
}

/* ─── Card ─── */
export function Card({
    title,
    action,
    children,
    padding = true,
    style,
}: {
    title?: ReactNode;
    action?: ReactNode;
    children: ReactNode;
    padding?: boolean;
    style?: React.CSSProperties;
}) {
    return (
        <div className="card" style={style}>
            {(title || action) && (
                <div className="card-header">
                    {title && <h3>{title}</h3>}
                    {action}
                </div>
            )}
            <div className={padding ? 'card-body' : ''}>{children}</div>
        </div>
    );
}

/* ─── Page header ─── */
export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
    return (
        <div className="page-header">
            <div>
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
            </div>
            {actions && <div className="page-header-actions">{actions}</div>}
        </div>
    );
}

/* ─── Stat tile ─── */
export function StatTile({
    label,
    value,
    currency,
    delta,
    deltaDir = 'up',
    sub,
}: {
    label: string;
    value: string;
    currency?: string;
    delta?: string;
    deltaDir?: 'up' | 'down' | 'flat';
    sub?: string;
}) {
    const Arrow = deltaDir === 'up' ? ArrowUp : deltaDir === 'down' ? ArrowDown : null;
    return (
        <div className="stat">
            <div className="stat-label">{label}</div>
            <div className="stat-value">
                {currency && <span className="currency">{currency}</span>}
                {value}
            </div>
            {delta && (
                <div className={`stat-delta ${deltaDir}`}>
                    {Arrow && <Arrow size={13} />}
                    <span>{delta}</span>
                    {sub && <span style={{ color: 'var(--text-4)', marginLeft: 4 }}>{sub}</span>}
                </div>
            )}
        </div>
    );
}

/* ─── Sparkline ─── */
export function Spark({ data, color = '#00ffcc', id }: { data: number[]; color?: string; id: string }) {
    const W = 120;
    const H = 36;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const x = (i: number) => (i / (data.length - 1)) * W;
    const y = (v: number) => H - 3 - ((v - min) / range) * (H - 8);
    const line = data.map((v, i) => `${x(i)},${y(v)}`).join(' L ');
    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none">
            <defs>
                <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={`M 0,${H} L ${line} L ${W},${H} Z`} fill={`url(#${id}f)`} />
            <path
                d={`M ${line}`}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}
