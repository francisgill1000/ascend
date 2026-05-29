import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';
import { AscendMark } from '@/Components/AscendIcons';

export default function Login() {
    const academy = (usePage().props.academy ?? { name: 'ASCEND', tagline: 'Coaching academy' }) as {
        name: string;
        tagline: string;
    };

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="auth-shell">
            <Head title="Sign in" />
            <div className="auth-card">
                <div className="auth-brand">
                    <div className="brand-mark">
                        <AscendMark size={22} />
                    </div>
                    <div>
                        <div className="auth-name">{academy.name}</div>
                        <div className="auth-tag">{academy.tagline} · admin</div>
                    </div>
                </div>

                <h1 className="auth-title">Sign in</h1>
                <p className="auth-sub">Welcome back. Sign in to manage the academy.</p>

                <form onSubmit={submit} className="auth-form">
                    <div className="field">
                        <label className="field-label" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="input"
                            autoComplete="username"
                            autoFocus
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="you@eloquentservice.com"
                        />
                        {errors.email && <div className="auth-error">{errors.email}</div>}
                    </div>

                    <div className="field">
                        <label className="field-label" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="input"
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                        />
                        {errors.password && <div className="auth-error">{errors.password}</div>}
                    </div>

                    <label className="auth-remember">
                        <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
                        <span>Keep me signed in</span>
                    </label>

                    <button type="submit" className="btn btn-primary btn-lg" disabled={processing} style={{ width: '100%' }}>
                        {processing ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>
            </div>
            <div className="auth-foot">Eloquent · {academy.name}</div>
        </div>
    );
}
