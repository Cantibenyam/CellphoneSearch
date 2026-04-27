import { requireUser } from '@/lib/auth';
import { listAllListingsForAdmin } from '@/lib/queries/listings';
import { getAllModelsForDropdown } from '@/lib/queries/models';
import { getAllSellersForDropdown } from '@/lib/queries/sellers';
import { AdminListingsClient } from './AdminListingsClient';

export default async function AdminListingsPage() {
  await requireUser();
  const [listings, models, sellers] = await Promise.all([
    listAllListingsForAdmin(100),
    getAllModelsForDropdown(),
    getAllSellersForDropdown(),
  ]);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Admin: Listings</h1>
        <p className="text-sm text-zinc-600">
          Create, edit, and delete listings. Showing {listings.length} most
          recent.
        </p>
      </header>
      <AdminListingsClient
        initialListings={listings}
        models={models}
        sellers={sellers}
      />
    </div>
  );
}
