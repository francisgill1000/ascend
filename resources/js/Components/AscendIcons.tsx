import { ReactNode, SVGProps } from 'react';

type IconProps = { size?: number } & SVGProps<SVGSVGElement>;

/** Lucide-style stroked icon wrapper. */
function Svg({ size = 18, children, ...rest }: IconProps & { children: ReactNode }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...rest}
        >
            {children}
        </svg>
    );
}

export const Dashboard = (p: IconProps) => (
    <Svg {...p}>
        <rect x={3} y={3} width={7} height={9} rx={1.5} />
        <rect x={14} y={3} width={7} height={5} rx={1.5} />
        <rect x={14} y={12} width={7} height={9} rx={1.5} />
        <rect x={3} y={16} width={7} height={5} rx={1.5} />
    </Svg>
);

export const Users = (p: IconProps) => (
    <Svg {...p}>
        <circle cx={9} cy={8} r={4} />
        <path d="M3 21c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <path d="M16 4a4 4 0 0 1 0 8" />
        <path d="M21 21c0-2.5-1.4-4.7-3.5-5.7" />
    </Svg>
);

export const Book = (p: IconProps) => (
    <Svg {...p}>
        <path d="M4 5a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2z" />
        <path d="M9 3v16" />
    </Svg>
);

export const Calendar = (p: IconProps) => (
    <Svg {...p}>
        <rect x={3} y={4} width={18} height={17} rx={2} />
        <line x1={8} y1={2} x2={8} y2={6} />
        <line x1={16} y1={2} x2={16} y2={6} />
        <line x1={3} y1={10} x2={21} y2={10} />
    </Svg>
);

export const Clipboard = (p: IconProps) => (
    <Svg {...p}>
        <rect x={6} y={4} width={12} height={17} rx={2} />
        <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
        <path d="M9.5 13l2 2 3.5-4" />
    </Svg>
);

export const Card = (p: IconProps) => (
    <Svg {...p}>
        <rect x={2} y={6} width={20} height={13} rx={2} />
        <line x1={2} y1={11} x2={22} y2={11} />
        <line x1={6} y1={15} x2={10} y2={15} />
    </Svg>
);

export const Chart = (p: IconProps) => (
    <Svg {...p}>
        <path d="M3 3v18h18" />
        <path d="M7 14l4-4 3 3 5-7" />
    </Svg>
);

export const Settings = (p: IconProps) => (
    <Svg {...p}>
        <circle cx={12} cy={12} r={3} />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </Svg>
);

export const Search = (p: IconProps) => (
    <Svg {...p}>
        <circle cx={11} cy={11} r={7} />
        <path d="M21 21l-4.3-4.3" />
    </Svg>
);

export const Bell = (p: IconProps) => (
    <Svg {...p}>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </Svg>
);

export const Plus = (p: IconProps) => (
    <Svg {...p}>
        <line x1={12} y1={5} x2={12} y2={19} />
        <line x1={5} y1={12} x2={19} y2={12} />
    </Svg>
);

export const Download = (p: IconProps) => (
    <Svg {...p}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="M7 10l5 5 5-5" />
        <line x1={12} y1={15} x2={12} y2={3} />
    </Svg>
);

export const Send = (p: IconProps) => (
    <Svg {...p}>
        <path d="M22 2L11 13" />
        <path d="M22 2l-7 20-4-9-9-4z" />
    </Svg>
);

export const Check = (p: IconProps) => (
    <Svg {...p}>
        <path d="M5 12l5 5L20 7" />
    </Svg>
);

export const ChevronRight = (p: IconProps) => (
    <Svg {...p}>
        <path d="M9 6l6 6-6 6" />
    </Svg>
);

export const ArrowUp = (p: IconProps) => (
    <Svg {...p}>
        <path d="M7 17L17 7" />
        <path d="M7 7h10v10" />
    </Svg>
);

export const ArrowDown = (p: IconProps) => (
    <Svg {...p}>
        <path d="M17 7L7 17" />
        <path d="M17 17H7V7" />
    </Svg>
);

export const GradCap = (p: IconProps) => (
    <Svg {...p}>
        <path d="M12 4 2 9l10 5 10-5-10-5z" />
        <path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5" />
        <line x1={22} y1={9} x2={22} y2={14} />
    </Svg>
);

export const Logout = (p: IconProps) => (
    <Svg {...p}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5" />
        <line x1={21} y1={12} x2={9} y2={12} />
    </Svg>
);

/** ASCEND brand mark — graduation cap glyph used in the sidebar lockup. */
export function AscendMark({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
            <path d="M16 5 4 11l12 6 12-6z" fill="currentColor" opacity={0.18} />
            <path d="M16 5 4 11l12 6 12-6-12-6z" stroke="currentColor" strokeWidth={1.7} strokeLinejoin="round" />
            <path d="M9 14v5c0 1.6 3.1 3 7 3s7-1.4 7-3v-5" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" />
        </svg>
    );
}
