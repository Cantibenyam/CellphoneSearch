import { db } from '@/lib/db';

export type FavoriteRow = {
  listing_id: number;
  price: string;
  model_id: number;
  model_name: string;
  brand: string;
  storage: string;
  seller_name: string;
  website_link: string;
};

export async function getFavoritesForUser(
  userId: number,
): Promise<FavoriteRow[]> {
  const { rows } = await db.query<FavoriteRow>(
    `SELECT l.listing_id, l.price,
            m.model_id, m.name AS model_name, m.brand, m.storage,
            s.name AS seller_name, s.website_link
     FROM favorite f
     JOIN listing l ON f.listing_id = l.listing_id
     JOIN model   m ON l.model_id   = m.model_id
     JOIN seller  s ON l.seller_id  = s.seller_id
     WHERE f.user_id = $1
     ORDER BY l.price ASC`,
    [userId],
  );
  return rows;
}

export async function isFavorited(
  userId: number,
  listingId: number,
): Promise<boolean> {
  const { rowCount } = await db.query(
    `SELECT 1 FROM favorite WHERE user_id = $1 AND listing_id = $2`,
    [userId, listingId],
  );
  return (rowCount ?? 0) > 0;
}

export async function addFavorite(
  userId: number,
  listingId: number,
): Promise<boolean> {
  const { rowCount } = await db.query(
    `INSERT INTO favorite (user_id, listing_id) VALUES ($1, $2)
     ON CONFLICT (user_id, listing_id) DO NOTHING`,
    [userId, listingId],
  );
  return (rowCount ?? 0) > 0;
}

export async function removeFavorite(
  userId: number,
  listingId: number,
): Promise<boolean> {
  const { rowCount } = await db.query(
    `DELETE FROM favorite WHERE user_id = $1 AND listing_id = $2`,
    [userId, listingId],
  );
  return (rowCount ?? 0) > 0;
}
