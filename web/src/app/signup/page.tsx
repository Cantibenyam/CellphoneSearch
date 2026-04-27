import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { SignupForm } from './SignupForm';

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect('/');

  return (
    <div className="mx-auto max-w-md space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="text-sm text-zinc-600">
          Sign up to favorite listings.{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in instead
          </Link>
          .
        </p>
      </header>
      <SignupForm />
    </div>
  );
}
