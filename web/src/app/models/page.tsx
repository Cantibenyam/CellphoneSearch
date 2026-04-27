import Link from 'next/link';
import { searchModels } from '@/lib/queries/models';
import { SearchBar } from '@/components/SearchBar';

export default async function ModelSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const trimmed = q.trim();
  const results = trimmed ? await searchModels(trimmed, 100) : [];

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Search models</h1>
        <SearchBar defaultValue={trimmed} />
      </header>

      {!trimmed ? (
        <p className="text-zinc-500">Type a model name or brand above.</p>
      ) : (
        <section className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 text-sm font-semibold">
            {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;
            {trimmed}&rdquo;
          </div>
          {results.length === 0 ? (
            <p className="p-4 text-zinc-500">No models match.</p>
          ) : (
            <ul className="divide-y">
              {results.map((m) => (
                <li key={m.model_id}>
                  <Link
                    href={`/models/${m.model_id}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-zinc-50"
                  >
                    <div>
                      <div className="text-sm font-medium">{m.name}</div>
                      <div className="text-xs text-zinc-500">
                        {m.brand} · {m.storage}
                      </div>
                    </div>
                    <span className="text-sm text-blue-600">View →</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
