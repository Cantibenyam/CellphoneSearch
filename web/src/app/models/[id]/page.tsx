import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getModelById } from '@/lib/queries/models';
import { getListingsByModelId } from '@/lib/queries/listings';

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const modelId = Number(id);
  if (!Number.isInteger(modelId) || modelId <= 0) notFound();

  const model = await getModelById(modelId);
  if (!model) notFound();

  const listings = await getListingsByModelId(modelId);

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← Back
      </Link>

      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">{model.name}</h1>
        <p className="text-zinc-600">
          {model.brand} · {model.storage}
        </p>
      </header>

      <section className="rounded-lg border bg-white">
        <div className="border-b px-4 py-3 text-sm font-semibold">
          {listings.length} listing{listings.length === 1 ? '' : 's'} (sorted by
          price ascending)
        </div>
        {listings.length === 0 ? (
          <p className="p-4 text-zinc-500">No listings for this model.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-4 py-2">Seller</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.listing_id} className="border-t">
                  <td className="px-4 py-2">{l.seller_name}</td>
                  <td className="px-4 py-2 font-mono">
                    ${Number(l.price).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      href={`/listings/${l.listing_id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
