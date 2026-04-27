import { NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validation';
import { findUserByEmail } from '@/lib/queries/users';
import { verifyPassword } from '@/lib/auth';
import { getSession } from '@/lib/session';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 },
    );
  }

  const user = await findUserByEmail(parsed.data.email);
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 },
    );
  }

  const ok = await verifyPassword(parsed.data.password, user.password);
  if (!ok) {
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 },
    );
  }

  const session = await getSession();
  session.userId = user.user_id;
  await session.save();

  return NextResponse.json({ user_id: user.user_id, name: user.name });
}
