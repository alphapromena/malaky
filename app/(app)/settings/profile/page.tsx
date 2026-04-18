import { requireAuthUser } from '@/lib/auth';
import { ProfileForm } from '@/components/settings/ProfileForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'التفضيلات — ملاكي' };

export default async function ProfileSettingsPage() {
  const { profile } = await requireAuthUser();
  return (
    <div className="p-6 sm:p-10">
      <header className="mb-8">
        <p className="font-latin text-[10px] uppercase tracking-[0.18em] text-ink-subtle">
          Preferences
        </p>
        <h1 className="ds-display mt-1 text-3xl font-bold">التفضيلات</h1>
        <p className="mt-2 text-sm text-ink-muted">
          عدّل شخصيّتك أمام ملاكي وسلوك الـ AI معك.
        </p>
      </header>
      <ProfileForm profile={profile!} />
    </div>
  );
}
