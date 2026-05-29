import { Link, router, usePage } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react';
import {
    AscendMark,
    Bell,
    Book,
    Calendar,
    Card as CardIcon,
    Chart,
    Check,
    Clipboard,
    Dashboard,
    Logout,
    Search,
    Settings as SettingsIcon,
    Users,
} from './AscendIcons';
import { Btn } from './ui';

type NavItem = { label: string; route: string; href: string; icon: (p: { size?: number }) => ReactNode; live?: boolean };

function useFlash() {
    const flash = (usePage().props.flash ?? {}) as { success?: string | null; error?: string | null };
    const [toast, setToast] = useState<{ msg: string; error?: boolean } | null>(null);

    useEffect(() => {
        const msg = flash.success || flash.error;
        if (!msg) return;
        setToast({ msg, error: !!flash.error });
        const t = setTimeout(() => setToast(null), 2600);
        return () => clearTimeout(t);
    }, [flash.success, flash.error]);

    return toast;
}

export default function AdminLayout({
    title,
    live,
    actions,
    children,
}: {
    title: string;
    live?: boolean;
    actions?: ReactNode;
    children: ReactNode;
}) {
    const { props, url } = usePage();
    const academy = props.academy as { name: string; director: string };
    const user = (props.auth as { user: { name: string; role: string } | null } | undefined)?.user ?? null;
    const toast = useFlash();

    const initials = user
        ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
        : 'PN';
    const roleLabel = user ? (user.role === 'admin' ? 'Academy Director' : 'Academy Staff') : 'Academy Director';
    const logout = () => router.post(route('logout'));

    const items: NavItem[] = [
        { label: 'Dashboard', route: 'academy.dashboard', href: route('academy.dashboard'), icon: Dashboard },
        { label: 'Students', route: 'academy.students', href: route('academy.students'), icon: Users },
        { label: 'Courses', route: 'academy.courses', href: route('academy.courses'), icon: Book },
        { label: 'Timetable', route: 'academy.timetable', href: route('academy.timetable'), icon: Calendar },
        { label: 'Attendance', route: 'academy.attendance', href: route('academy.attendance'), icon: Clipboard, live: true },
        { label: 'Fees', route: 'academy.fees', href: route('academy.fees'), icon: CardIcon },
        { label: 'Reports', route: 'academy.reports', href: route('academy.reports'), icon: Chart },
    ];
    const account: NavItem[] = [
        { label: 'Settings', route: 'academy.settings', href: route('academy.settings'), icon: SettingsIcon },
    ];

    const path = url.split('?')[0];
    const isActive = (href: string) => {
        const p = new URL(href, 'http://x').pathname;
        return p === '/' ? path === '/' : path.startsWith(p);
    };

    const NavBtn = (it: NavItem) => {
        const Icon = it.icon;
        const active = isActive(it.href);
        return (
            <Link key={it.route} href={it.href} className={`nav-item ${active ? 'active' : ''}`}>
                <span className="nav-icon">
                    <Icon size={18} />
                </span>
                <span className="nav-label">{it.label}</span>
                {it.live && (
                    <span style={{ marginLeft: 'auto' }}>
                        <span
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: 999,
                                background: 'var(--mint-400)',
                                boxShadow: '0 0 0 3px rgba(0,255,204,0.18)',
                                display: 'inline-block',
                            }}
                        />
                    </span>
                )}
            </Link>
        );
    };

    return (
        <div className="app">
            <aside className="sidebar ascend-brand">
                <div className="brand">
                    <div className="brand-mark">
                        <AscendMark size={20} />
                    </div>
                    <div className="brand-name">{academy.name}</div>
                </div>
                <div className="nav-section-title">Academy</div>
                <div className="nav-items">{items.map(NavBtn)}</div>
                <div className="nav-section-title">Account</div>
                <div className="nav-items">{account.map(NavBtn)}</div>
                <div className="sidebar-footer">
                    <div className="avatar">{initials}</div>
                    <div style={{ minWidth: 0 }}>
                        <div
                            style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: 'var(--text-1)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {user ? user.name : academy.director}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-4)', whiteSpace: 'nowrap' }}>{roleLabel}</div>
                    </div>
                    <button className="logout-btn" title="Sign out" onClick={logout} aria-label="Sign out">
                        <Logout size={16} />
                    </button>
                </div>
            </aside>

            <main className="main">
                <header className="topbar">
                    <div className="topbar-title">
                        <h1>{title}</h1>
                        {live && (
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    marginLeft: 8,
                                    padding: '3px 10px',
                                    borderRadius: 999,
                                    background: 'var(--mint-soft)',
                                    color: 'var(--mint-300)',
                                    fontSize: 11,
                                    fontWeight: 500,
                                    border: '1px solid var(--border-mint)',
                                    letterSpacing: '0.04em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                <span className="pulse-dot" /> Live
                            </span>
                        )}
                    </div>
                    <div className="topbar-actions">
                        <div className="search">
                            <Search size={14} />
                            <input placeholder="Search students, courses…" />
                            <kbd>⌘K</kbd>
                        </div>
                        <Btn variant="ghost" icon={<Bell size={18} />} />
                        {actions}
                    </div>
                </header>
                {children}
            </main>

            {toast && (
                <div className={`toast ${toast.error ? 'error' : ''}`}>
                    <Check size={16} />
                    <span>{toast.msg}</span>
                </div>
            )}
        </div>
    );
}
