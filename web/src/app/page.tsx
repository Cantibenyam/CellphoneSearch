import Link from 'next/link';
import { listRecentModels } from '@/lib/queries/models';
import { SearchBar } from '@/components/SearchBar';

export default async function Home() {
  const models = await listRecentModels(12);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">
          Compare phone listings across sellers
        </h1>
        <p className="text-zinc-600">
          Search a model to see prices from {''}
          <span className="font-medium">third-party sellers</span>, sorted lowest
          first.
        </p>
      </header>

      <SearchBar />

      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold">Recent models</h2>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {models.map((m) => (
            <li key={m.model_id}>
              <Link
                href={`/models/${m.model_id}`}
                className="block rounded-md border px-3 py-2 hover:bg-zinc-50"
              >
                <div className="text-sm font-medium">{m.name}</div>
                <div className="text-xs text-zinc-500">
                  {m.brand} · {m.storage}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
