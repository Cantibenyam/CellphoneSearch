import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { getFavoritesForUser } from '@/lib/queries/favorites';

export default async function FavoritesPage() {
  const user = await requireUser();
  const favorites = await getFavoritesForUser(user.user_id);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Your favorites</h1>
        <p className="text-sm text-zinc-600">
          {favorites.length} listing{favorites.length === 1 ? '' : 's'} saved
        </p>
      </header>

      {favorites.length === 0 ? (
        <p className="rounded-lg border bg-white p-6 text-zinc-500">
          You haven&apos;t favorited any listings yet. Find a model, open a
          listing, and tap the heart.
        </p>
      ) : (
        <section className="rounded-lg border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-4 py-2">Model</th>
                <th className="px-4 py-2">Storage</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Seller</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((f) => (
                <tr key={f.listing_id} className="border-t">
                  <td className="px-4 py-2">
                    <div className="font-medium">{f.model_name}</div>
                    <div className="text-xs text-zinc-500">{f.brand}</div>
                  </td>
                  <td className="px-4 py-2">{f.storage}</td>
                  <td className="px-4 py-2 font-mono">
                    ${Number(f.price).toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    <a
                      href={f.website_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {f.seller_name}
                    </a>
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/listings/${f.listing_id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
