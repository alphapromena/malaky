import { NextResponse } from 'next/server';
import { getSessionId } from '@/lib/session';
import { listImages, listMessages } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const sessionId = getSessionId();
  const messages = await listMessages(params.id, sessionId);
  if (messages === null) {
    return NextResponse.json({ error: 'المحادثة غير موجودة.' }, { status: 404 });
  }
  const images = await listImages(params.id, sessionId);
  return NextResponse.json({ messages, images });
}
