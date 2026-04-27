import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect('/');

  return (
    <div className="mx-auto max-w-md space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Log in</h1>
        <p className="text-sm text-zinc-600">
          New here?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Create an account
          </Link>
          .
        </p>
        <p className="text-xs text-zinc-500">
          Demo credential:{' '}
          <code className="rounded bg-zinc-100 px-1">
            nancy.garcia@example.com
          </code>{' '}
          / <code className="rounded bg-zinc-100 px-1">password123</code>
        </p>
      </header>
      <LoginForm />
    </div>
  );
}
