import { NextResponse } from 'next/server';
import { getSessionId } from '@/lib/session';

export async function GET() {
  const sessionId = getSessionId();
  return NextResponse.json({ sessionId });
}
