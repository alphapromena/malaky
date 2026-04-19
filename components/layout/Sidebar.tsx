import Link from 'next/link';
import { Plus, Plug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModeSwitch } from './ModeSwitch';
import { ConversationList } from './ConversationList';
import { UserMenu } from '@/components/auth/UserMenu';
import { SettingsModal } from './SettingsModal';
import { WingsLogo } from '@/components/brand/WingsLogo';
import { getModeConfigByMode } from '@/lib/modes';
import { getAuthUser } from '@/lib/auth';
import { getServerClient } from '@/lib/supabase/server';
import type { Mode } from '@/types/database';

export async function Sidebar({ mode }: { mode: Mode }) {
  const cfg = getModeConfigByMode(mode);
  const auth = await getAuthUser();

  let connectedCount = 0;
  if (auth) {
    const supabase = getServerClient();
    const { count } = await supabase
      .from('user_integrations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', auth.user.id)
      .eq('status', 'connected');
    connectedCount = count ?? 0;
  }

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-canvas-elevated/60 backdrop-blur-2xl">
      {/* Brand */}
      <div className="border-b border-border p-5">
        <Link href="/" className="mb-5 flex items-center gap-3" aria-label="ملاكي">
          <div className="relative flex h-11 w-16 items-center justify-center rounded-xl bg-canvas-raised shadow-sm">
            <WingsLogo size={20} />
          </div>
          <div className="leading-tight">
            <h2 className="ds-wordmark text-2xl">ملاكي</h2>
            <p className="font-latin text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
              Malaky AI
            </p>
          </div>
        </Link>
        <ModeSwitch />
      </div>

      {/* New chat */}
      <div className="p-4">
        <Button asChild className="w-full gap-2" size="default">
          <Link href={`/${cfg.slug}`}>
            <Plus className="h-4 w-4" />
            محادثة جديدة
          </Link>
        </Button>
      </div>

      {/* Conversations */}
      <div className="px-5 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
        المحادثات
      </div>
      <ScrollArea className="chat-scroll flex-1">
        <ConversationList mode={mode} slug={cfg.slug} />
      </ScrollArea>

      {/* User + integrations + limit footer */}
      <div className="space-y-2 border-t border-border p-4">
        <Link
          href="/settings/integrations"
          className="flex items-center justify-between rounded-xl border border-border bg-white/[0.03] px-3 py-2 text-xs transition-colors hover:bg-white/[0.06] hover:border-gold-400/40"
        >
          <span className="flex items-center gap-2 text-ink-muted">
            <Plug className="h-3.5 w-3.5" />
            التكاملات
          </span>
          <span className="font-medium text-foreground">
            {connectedCount}{' '}
            <span className="text-ink-subtle">
              {connectedCount === 1 ? 'متصل' : 'متصلة'}
            </span>
          </span>
        </Link>

        <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2 text-xs">
          <span className="text-ink-muted">الحد اليومي</span>
          <span className="font-medium text-foreground">
            {cfg.limit} <span className="text-ink-subtle">{cfg.limitUnit}</span>
          </span>
        </div>

        {auth?.profile && auth.user.email && (
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <UserMenu
                firstName={auth.profile.first_name}
                lastName={auth.profile.last_name}
                nickname={auth.profile.nickname}
                email={auth.user.email}
                avatarUrl={auth.profile.avatar_url}
              />
            </div>
            <SettingsModal
              firstName={auth.profile.first_name}
              lastName={auth.profile.last_name}
              email={auth.user.email}
              avatarUrl={auth.profile.avatar_url}
            />
          </div>
        )}
      </div>
    </aside>
  );
}
