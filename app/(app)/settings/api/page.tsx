import { Key } from 'lucide-react';
import { ComingSoon } from '@/components/settings/ComingSoon';

export const metadata = { title: 'API — ملاكي' };

export default function ApiPage() {
  return (
    <ComingSoon
      icon={Key}
      title="وصول API"
      description="ادمج ملاكي في تطبيقك مباشرة عبر REST + streaming، بنفس الذكاء اللي بتحصل عليه هنا."
      features={[
        'مفاتيح API تقدر تنشئها وتحذفها وقت ما تريد',
        'Endpoints للكاتب والمبرمج والمصمم',
        'Streaming عبر SSE + webhooks للصور',
        'Usage metrics لكل مفتاح على حدة',
        'SDK رسمي للـ TypeScript / Python',
      ]}
    />
  );
}
