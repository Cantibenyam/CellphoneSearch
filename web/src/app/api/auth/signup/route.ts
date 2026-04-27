import { NextResponse } from 'next/server';
import { signupSchema } from '@/lib/validation';
import { createUser, findUserByEmail } from '@/lib/queries/users';
import { hashPassword } from '@/lib/auth';
import { getSession } from '@/lib/session';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;

  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json(
      { error: 'Email already registered' },
      { status: 409 },
    );
  }

  const hash = await hashPassword(password);
  const user = await createUser(name, email, hash);

  const session = await getSession();
  session.userId = user.user_id;
  await session.save();

  return NextResponse.json({ user_id: user.user_id, name: user.name });
}
