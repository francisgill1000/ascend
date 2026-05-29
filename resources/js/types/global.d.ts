import { PageProps as InertiaPageProps } from '@inertiajs/core';

declare global {
    function route(name: string, params?: Record<string, unknown> | string | number): string;
}

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps {
        auth?: {
            user: {
                id: number;
                name: string;
                email: string;
                role: string;
            } | null;
        };
        academy?: {
            name: string;
            tagline: string;
            director: string;
            currency: string;
            term: string;
            termLabel: string;
            todayLabel: string;
        };
        flash?: {
            success?: string | null;
            error?: string | null;
        };
        [key: string]: unknown;
    }
}

export {};
