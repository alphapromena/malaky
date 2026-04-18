import { NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabase/server';
import { INTEGRATIONS } from '@/lib/integrations/catalog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول.' }, { status: 401 });
  }

  const { data } = await supabase
    .from('user_integrations')
    .select('provider, status')
    .eq('user_id', user.id)
    .eq('status', 'connected');

  const connectedIds = new Set((data ?? []).map((r) => r.provider));
  const connected = INTEGRATIONS.filter((i) => connectedIds.has(i.id)).map((i) => ({
    id: i.id,
    name: i.name,
    nameAr: i.nameAr,
  }));

  return NextResponse.json({ connected });
}
