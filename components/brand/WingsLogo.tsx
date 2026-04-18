import { cn } from '@/lib/utils';

/**
 * Malaky angel-wings mark.
 * Two stylized wings meeting at the center, drawn as filled paths.
 */
export function WingsLogo({
  className,
  size = 24,
  tone = 'gradient',
}: {
  className?: string;
  size?: number;
  /** 'gradient' (gold), 'solid' (inherit color), 'soft' (semi-transparent) */
  tone?: 'gradient' | 'solid' | 'soft';
}) {
  const gradId = `wings-grad-${tone}`;
  return (
    <svg
      viewBox="0 0 64 40"
      width={size * (64 / 40)}
      height={size}
      fill={tone === 'solid' ? 'currentColor' : `url(#${gradId})`}
      stroke="none"
      className={cn('shrink-0', className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EEE1C7" />
          <stop offset="55%" stopColor="#B8956A" />
          <stop offset="100%" stopColor="#7F6038" />
        </linearGradient>
      </defs>

      {/* Left wing — three flowing feather-rows */}
      <g>
        <path d="M32 24 C22 22, 12 20, 4 14 C8 18, 14 20, 20 20 C14 22, 8 26, 3 30 C10 28, 18 26, 24 26 C20 28, 14 32, 10 36 C18 32, 26 28, 30 27 Z" />
      </g>
      {/* Right wing — mirrored */}
      <g>
        <path d="M32 24 C42 22, 52 20, 60 14 C56 18, 50 20, 44 20 C50 22, 56 26, 61 30 C54 28, 46 26, 40 26 C44 28, 50 32, 54 36 C46 32, 38 28, 34 27 Z" />
      </g>
      {/* Central halo dot */}
      <circle cx="32" cy="22" r="1.8" fill={tone === 'solid' ? 'currentColor' : '#F7F1E8'} opacity={tone === 'soft' ? 0.5 : 0.9} />
    </svg>
  );
}
