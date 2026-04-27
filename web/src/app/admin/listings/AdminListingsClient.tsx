'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { ListingForAdmin } from '@/lib/queries/listings';

type ModelOption = { model_id: number; name: string; storage: string };
type SellerOption = { seller_id: number; name: string };

export function AdminListingsClient({
  initialListings,
  models,
  sellers,
}: {
  initialListings: ListingForAdmin[];
  models: ModelOption[];
  sellers: SellerOption[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState('');

  function refresh() {
    router.refresh();
  }

  function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const body = {
      model_id: Number(fd.get('model_id')),
      seller_id: Number(fd.get('seller_id')),
      price: Number(fd.get('price')),
    };
    startTransition(async () => {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Create failed');
        return;
      }
      (e.target as HTMLFormElement).reset();
      refresh();
    });
  }

  function onSavePrice(listingId: number) {
    setError(null);
    const price = Number(editPrice);
    if (!(price > 0)) {
      setError('Price must be > 0');
      return;
    }
    startTransition(async () => {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Update failed');
        return;
      }
      setEditingId(null);
      setEditPrice('');
      refresh();
    });
  }

  function onDelete(listingId: number) {
    if (!confirm(`Delete listing #${listingId}?`)) return;
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Delete failed');
        return;
      }
      refresh();
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold">Create new listing</h2>
        <form
          onSubmit={onCreate}
          className="grid grid-cols-1 gap-3 sm:grid-cols-4"
        >
          <label className="col-span-1 sm:col-span-2 text-sm">
            <span className="block font-medium">Model</span>
            <select
              name="model_id"
              required
              className="mt-1 w-full rounded-md border px-3 py-2"
            >
              <option value="">— Select model —</option>
              {models.map((m) => (
                <option key={m.model_id} value={m.model_id}>
                  {m.name} ({m.storage})
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="block font-medium">Seller</span>
            <select
              name="seller_id"
              required
              className="mt-1 w-full rounded-md border px-3 py-2"
            >
              <option value="">— Select seller —</option>
              {sellers.map((s) => (
                <option key={s.seller_id} value={s.seller_id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="block font-medium">Price (USD)</span>
            <input
              type="number"
              name="price"
              required
              min="0.01"
              step="0.01"
              placeholder="999.99"
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </label>
          <div className="sm:col-span-4">
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              {pending ? 'Working…' : 'Create listing'}
            </button>
          </div>
        </form>
      </section>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <section className="rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Model</th>
              <th className="px-4 py-2">Seller</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialListings.map((l) => (
              <tr key={l.listing_id} className="border-t">
                <td className="px-4 py-2 font-mono text-xs text-zinc-500">
                  #{l.listing_id}
                </td>
                <td className="px-4 py-2">
                  {l.model_name}{' '}
                  <span className="text-xs text-zinc-500">({l.storage})</span>
                </td>
                <td className="px-4 py-2">{l.seller_name}</td>
                <td className="px-4 py-2 font-mono">
                  {editingId === l.listing_id ? (
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-28 rounded border px-2 py-1"
                      autoFocus
                    />
                  ) : (
                    `$${Number(l.price).toFixed(2)}`
                  )}
                </td>
                <td className="px-4 py-2 text-right space-x-2">
                  {editingId === l.listing_id ? (
                    <>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => onSavePrice(l.listing_id)}
                        className="rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditPrice('');
                        }}
                        className="rounded-md bg-zinc-200 px-2 py-1 text-xs hover:bg-zinc-300"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(l.listing_id);
                          setEditPrice(String(l.price));
                        }}
                        className="rounded-md bg-zinc-100 px-2 py-1 text-xs hover:bg-zinc-200"
                      >
                        Edit price
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => onDelete(l.listing_id)}
                        className="rounded-md bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
