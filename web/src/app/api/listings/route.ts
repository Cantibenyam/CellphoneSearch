import { NextResponse } from 'next/server';
import { listingCreateSchema } from '@/lib/validation';
import { getCurrentUser } from '@/lib/auth';
import { createListing } from '@/lib/queries/listings';

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = listingCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 },
    );
  }

  try {
    const id = await createListing(
      parsed.data.model_id,
      parsed.data.seller_id,
      parsed.data.price,
    );
    return NextResponse.json({ listing_id: id });
  } catch (e) {
    const code = (e as { code?: string }).code;
    if (code === '23503') {
      return NextResponse.json(
        { error: 'Unknown model_id or seller_id' },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: 'Could not create listing' },
      { status: 500 },
    );
  }
}
