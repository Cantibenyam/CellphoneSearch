'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export function FavoriteButton({
  listingId,
  initialFavorited,
}: {
  listingId: number;
  initialFavorited: boolean;
}) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    setError(null);
    const next = !favorited;
    setFavorited(next);
    startTransition(async () => {
      const res = await fetch('/api/favorites', {
        method: next ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId }),
      });
      if (!res.ok) {
        setFavorited(!next);
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Request failed');
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
          favorited
            ? 'bg-red-50 text-red-700 hover:bg-red-100'
            : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
        } disabled:opacity-50`}
      >
        {favorited ? '♥ Favorited' : '♡ Add to favorites'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
