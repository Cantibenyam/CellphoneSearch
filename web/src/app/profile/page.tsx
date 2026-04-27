import { requireUser } from '@/lib/auth';
import { ProfileForm } from './ProfileForm';

export default async function ProfilePage() {
  const user = await requireUser();
  return (
    <div className="mx-auto max-w-md space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-zinc-600">
          Logged in as <span className="font-medium">{user.email}</span>
        </p>
      </header>
      <ProfileForm initialName={user.name} />
    </div>
  );
}
