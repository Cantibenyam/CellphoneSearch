import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getListingById } from '@/lib/queries/listings';
import { isFavorited } from '@/lib/queries/favorites';
import { getCurrentUser } from '@/lib/auth';
import { FavoriteButton } from '@/components/FavoriteButton';

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listingId = Number(id);
  if (!Number.isInteger(listingId) || listingId <= 0) notFound();

  const listing = await getListingById(listingId);
  if (!listing) notFound();

  const user = await getCurrentUser();
  const favorited = user ? await isFavorited(user.user_id, listingId) : false;

  return (
    <div className="space-y-6">
      <Link
        href={`/models/${listing.model_id}`}
        className="text-sm text-zinc-500 hover:underline"
      >
        ← Back to {listing.model_name}
      </Link>

      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Listing #{listing.listing_id}</h1>
      </header>

      <section className="rounded-lg border bg-white p-4">
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-zinc-500">
              Model
            </dt>
            <dd className="text-base font-medium">{listing.model_name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-zinc-500">
              Brand · Storage
            </dt>
            <dd className="text-base">
              {listing.brand} · {listing.storage}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-zinc-500">
              Price
            </dt>
            <dd className="text-base font-mono font-semibold">
              ${Number(listing.price).toFixed(2)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-zinc-500">
              Seller
            </dt>
            <dd className="text-base">{listing.seller_name}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-zinc-500">
              Seller website
            </dt>
            <dd className="text-base">
              <a
                href={listing.website_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {listing.website_link} ↗
              </a>
            </dd>
          </div>
        </dl>

        <div className="mt-6 border-t pt-4">
          {user ? (
            <FavoriteButton
              listingId={listing.listing_id}
              initialFavorited={favorited}
            />
          ) : (
            <p className="text-sm text-zinc-500">
              <Link href="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>{' '}
              to favorite this listing.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
