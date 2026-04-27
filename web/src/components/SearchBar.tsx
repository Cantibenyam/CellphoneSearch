export function SearchBar({ defaultValue = '' }: { defaultValue?: string }) {
  return (
    <form action="/models" method="get" className="flex gap-2">
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search by model name or brand (e.g. iPhone 16, Samsung)"
        className="flex-1 rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoFocus
        required
      />
      <button
        type="submit"
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Search
      </button>
    </form>
  );
}
