'use client';

import Link from 'next/link';
import { Gauge, LogOut, Settings as SettingsIcon, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function UserMenu({
  firstName,
  lastName,
  nickname,
  email,
  avatarUrl,
}: {
  firstName: string;
  lastName: string;
  nickname?: string | null;
  email: string;
  avatarUrl?: string | null;
}) {
  const displayName = nickname?.trim() || `${firstName} ${lastName}`.trim();
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl border border-border bg-white/[0.03] p-2.5 text-start transition-colors hover:bg-white/[0.06]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 text-sm font-semibold text-white">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="truncate font-latin text-[11px] text-ink-subtle" dir="ltr">
              {email}
            </p>
          </div>
          <SettingsIcon className="h-4 w-4 shrink-0 text-ink-subtle" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60" sideOffset={8}>
        <DropdownMenuLabel>حسابي</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings/profile">
            <UserIcon className="h-4 w-4" />
            التفضيلات
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings/usage">
            <Gauge className="h-4 w-4" />
            الاستهلاك
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings/account">
            <SettingsIcon className="h-4 w-4" />
            إعدادات الحساب
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action="/api/auth/logout" method="post">
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-danger hover:bg-danger/10 hover:text-danger"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
