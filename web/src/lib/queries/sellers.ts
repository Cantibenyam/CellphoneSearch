import { db } from '@/lib/db';

export type Seller = {
  seller_id: number;
  name: string;
  website_link: string;
};

export async function getAllSellersForDropdown(): Promise<Seller[]> {
  const { rows } = await db.query<Seller>(
    `SELECT seller_id, name, website_link FROM seller ORDER BY name`,
  );
  return rows;
}
