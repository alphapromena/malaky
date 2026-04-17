import { NextResponse } from 'next/server';
import { getSessionId } from '@/lib/session';
import { listConversations } from '@/lib/db';
import type { Mode } from '@/types/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_MODES: readonly Mode[] = ['WRITER', 'CODER', 'DESIGNER'];

export async function GET(req: Request) {
  const sessionId = getSessionId();
  const url = new URL(req.url);
  const modeParam = url.searchParams.get('mode');
  const mode = modeParam && ALLOWED_MODES.includes(modeParam as Mode) ? (modeParam as Mode) : undefined;

  const conversations = await listConversations(sessionId, mode);
  return NextResponse.json({ conversations });
}
