import { db } from '@/lib/db';

export type ListingForModel = {
  listing_id: number;
  price: string;
  seller_id: number;
  seller_name: string;
  website_link: string;
};

export type ListingDetail = {
  listing_id: number;
  price: string;
  model_id: number;
  model_name: string;
  brand: string;
  storage: string;
  seller_id: number;
  seller_name: string;
  website_link: string;
};

export type ListingForAdmin = {
  listing_id: number;
  price: string;
  model_id: number;
  model_name: string;
  storage: string;
  seller_id: number;
  seller_name: string;
};

export async function getListingsByModelId(
  modelId: number,
): Promise<ListingForModel[]> {
  const { rows } = await db.query<ListingForModel>(
    `SELECT l.listing_id, l.price, s.seller_id, s.name AS seller_name, s.website_link
     FROM listing l
     JOIN seller s ON l.seller_id = s.seller_id
     WHERE l.model_id = $1
     ORDER BY l.price ASC`,
    [modelId],
  );
  return rows;
}

export async function getListingById(id: number): Promise<ListingDetail | null> {
  const { rows } = await db.query<ListingDetail>(
    `SELECT l.listing_id, l.price,
            m.model_id, m.name AS model_name, m.brand, m.storage,
            s.seller_id, s.name AS seller_name, s.website_link
     FROM listing l
     JOIN model  m ON l.model_id  = m.model_id
     JOIN seller s ON l.seller_id = s.seller_id
     WHERE l.listing_id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function listAllListingsForAdmin(
  limit = 100,
): Promise<ListingForAdmin[]> {
  const { rows } = await db.query<ListingForAdmin>(
    `SELECT l.listing_id, l.price,
            m.model_id, m.name AS model_name, m.storage,
            s.seller_id, s.name AS seller_name
     FROM listing l
     JOIN model  m ON l.model_id  = m.model_id
     JOIN seller s ON l.seller_id = s.seller_id
     ORDER BY l.listing_id DESC
     LIMIT $1`,
    [limit],
  );
  return rows;
}

export async function createListing(
  modelId: number,
  sellerId: number,
  price: number,
): Promise<number> {
  const { rows } = await db.query<{ listing_id: number }>(
    `INSERT INTO listing (model_id, seller_id, price)
     VALUES ($1, $2, $3)
     RETURNING listing_id`,
    [modelId, sellerId, price],
  );
  return rows[0].listing_id;
}

export async function updateListingPrice(
  id: number,
  price: number,
): Promise<boolean> {
  const { rowCount } = await db.query(
    `UPDATE listing SET price = $1 WHERE listing_id = $2`,
    [price, id],
  );
  return (rowCount ?? 0) > 0;
}

export async function deleteListing(id: number): Promise<boolean> {
  await db.query(`DELETE FROM favorite WHERE listing_id = $1`, [id]);
  const { rowCount } = await db.query(
    `DELETE FROM listing WHERE listing_id = $1`,
    [id],
  );
  return (rowCount ?? 0) > 0;
}
