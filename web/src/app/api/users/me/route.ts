import { NextResponse } from 'next/server';
import { updateProfileSchema } from '@/lib/validation';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import {
  updateUserName,
  updateUserPassword,
} from '@/lib/queries/users';

export async function PATCH(request: Request) {
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

  const parsed = updateProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 },
    );
  }

  const { name, password } = parsed.data;

  if (name !== undefined) {
    await updateUserName(user.user_id, name);
  }
  if (password !== undefined) {
    const hash = await hashPassword(password);
    await updateUserPassword(user.user_id, hash);
  }

  return NextResponse.json({ ok: true });
}
