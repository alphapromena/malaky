import { PlugZap } from 'lucide-react';
import { ComingSoon } from '@/components/settings/ComingSoon';

export const metadata = { title: 'التكاملات — ملاكي' };

export default function IntegrationsPage() {
  return (
    <ComingSoon
      icon={PlugZap}
      title="التكاملات"
      description="وصّل ملاكي بأدواتك المفضّلة: Slack، Discord، Notion، Zapier، والمزيد."
      features={[
        'Slack — محادثات بالعربي بقناة مشتركة',
        'Discord bot — ردود فوريّة في السيرفر',
        'Notion — حفظ المحادثات كصفحات',
        'Zapier / Make — أتمتة سير العمل',
        'Google Drive — رفع الصور المولّدة',
      ]}
    />
  );
}
