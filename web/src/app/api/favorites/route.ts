import { NextResponse } from 'next/server';
import { favoriteToggleSchema } from '@/lib/validation';
import { getCurrentUser } from '@/lib/auth';
import { addFavorite, removeFavorite } from '@/lib/queries/favorites';

type ParseResult =
  | { ok: true; data: { listing_id: number } }
  | { ok: false; error: string };

async function parseBody(request: Request): Promise<ParseResult> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { ok: false, error: 'Invalid JSON' };
  }
  const parsed = favoriteToggleSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid input',
    };
  }
  return { ok: true, data: parsed.data };
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }
  const body = await parseBody(request);
  if (!body.ok) return NextResponse.json({ error: body.error }, { status: 400 });

  const created = await addFavorite(user.user_id, body.data.listing_id);
  return NextResponse.json({ favorited: true, created });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }
  const body = await parseBody(request);
  if (!body.ok) return NextResponse.json({ error: body.error }, { status: 400 });

  const deleted = await removeFavorite(user.user_id, body.data.listing_id);
  return NextResponse.json({ favorited: false, deleted });
}
