import { NextResponse } from 'next/server';
import { listingUpdateSchema } from '@/lib/validation';
import { getCurrentUser } from '@/lib/auth';
import {
  updateListingPrice,
  deleteListing,
} from '@/lib/queries/listings';

function parseId(idStr: string): number | null {
  const n = Number(idStr);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const listingId = parseId(id);
  if (!listingId) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = listingUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 },
    );
  }

  const updated = await updateListingPrice(listingId, parsed.data.price);
  if (!updated) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const listingId = parseId(id);
  if (!listingId) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const deleted = await deleteListing(listingId);
  if (!deleted) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
