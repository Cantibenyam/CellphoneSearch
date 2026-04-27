import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';

export async function Nav() {
  const user = await getCurrentUser();
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          Phone Market
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link href="/favorites" className="hover:underline">
                Favorites
              </Link>
              <Link href="/admin/listings" className="hover:underline">
                Admin
              </Link>
              <Link href="/profile" className="hover:underline">
                {user.name}
              </Link>
              <form action="/api/auth/logout" method="post">
                <button type="submit" className="hover:underline">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Log in
              </Link>
              <Link href="/signup" className="hover:underline">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
