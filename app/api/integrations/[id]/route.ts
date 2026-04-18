import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerClient } from '@/lib/supabase/server';
import { getIntegration } from '@/lib/integrations/catalog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  action: z.enum(['enable', 'disable']),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'يجب تسجيل الدخول.' }, { status: 401 });

  const integration = getIntegration(params.id);
  if (!integration) {
    return NextResponse.json({ error: 'تكامل غير معروف.' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'طلب غير صالح.' }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'بيانات غير صحيحة.' }, { status: 400 });
  }

  // Only native integrations can be toggled from the UI for now; others
  // require OAuth flow or an API key we don't yet collect.
  if (parsed.data.action === 'enable') {
    if (integration.status !== 'available' || integration.authType !== 'native') {
      return NextResponse.json(
        { error: 'هذا التكامل قيد الإعداد وسيكون متاحاً قريباً.' },
        { status: 400 },
      );
    }
    const { error } = await supabase.from('user_integrations').upsert(
      {
        user_id: user.id,
        provider: integration.id,
        status: 'connected',
        connected_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,provider' },
    );
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, status: 'connected' });
  }

  // Disable / disconnect
  const { error } = await supabase
    .from('user_integrations')
    .update({ status: 'disconnected' })
    .eq('user_id', user.id)
    .eq('provider', integration.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, status: 'disconnected' });
}
