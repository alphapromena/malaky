import { NextResponse } from 'next/server';
import { getSessionId } from '@/lib/session';
import { deleteConversation } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const sessionId = getSessionId();
  await deleteConversation(params.id, sessionId);
  return NextResponse.json({ ok: true });
}
