import { CreditCard } from 'lucide-react';
import { ComingSoon } from '@/components/settings/ComingSoon';

export const metadata = { title: 'الفوترة — ملاكي' };

export default function BillingPage() {
  return (
    <ComingSoon
      icon={CreditCard}
      title="الفوترة والخطط"
      description="خطط مدفوعة بحدود استهلاك أعلى، أولوية في الطابور، ومميزات جديدة. حالياً كل شي مجاناً."
      features={[
        'خطة Pro — حدود استهلاك ×10 ونماذج أقوى',
        'خطة Team — مشاركة المساحة مع الفريق وفوترة موحّدة',
        'فواتير PDF تلقائية وعملة محليّة',
        'رصيد مجاني شهري + دفع حسب الاستخدام',
      ]}
    />
  );
}
