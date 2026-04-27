'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export function ProfileForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const body: Record<string, string> = {};
    if (name && name !== initialName) body.name = name;
    if (password) body.password = password;
    if (Object.keys(body).length === 0) {
      setError('Change at least one field.');
      return;
    }
    startTransition(async () => {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Update failed');
        return;
      }
      setMessage(
        body.password
          ? 'Saved. Use the new password next time you log in.'
          : 'Saved.',
      );
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border bg-white p-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={initialName}
          minLength={2}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          New password (optional)
        </label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={8}
          autoComplete="new-password"
          placeholder="Leave blank to keep current password"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm"
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      {message && <p className="text-sm text-green-700">{message}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  );
}
