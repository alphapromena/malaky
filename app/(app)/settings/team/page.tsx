import { Users } from 'lucide-react';
import { ComingSoon } from '@/components/settings/ComingSoon';

export const metadata = { title: 'الفريق — ملاكي' };

export default function TeamPage() {
  return (
    <ComingSoon
      icon={Users}
      title="مساحة الفريق"
      description="ادعُ زملاءك وشاركوا المساحة، مع صلاحيات وفوترة موحّدة."
      features={[
        'دعوة أعضاء عبر البريد',
        'أدوار: مالك / مدير / عضو',
        'مكتبة مشتركة للـ prompts والـ custom instructions',
        'تاريخ نشاط الفريق',
        'فوترة موحّدة على مستوى الفريق',
      ]}
    />
  );
}
