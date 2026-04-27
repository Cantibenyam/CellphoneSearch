import { db } from '@/lib/db';

export type Model = {
  model_id: number;
  brand: string;
  name: string;
  storage: string;
};

export async function getModelById(id: number): Promise<Model | null> {
  const { rows } = await db.query<Model>(
    `SELECT model_id, brand, name, storage FROM model WHERE model_id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function listRecentModels(limit = 12): Promise<Model[]> {
  const { rows } = await db.query<Model>(
    `SELECT model_id, brand, name, storage
     FROM model
     ORDER BY model_id DESC
     LIMIT $1`,
    [limit],
  );
  return rows;
}

export async function searchModels(q: string, limit = 50): Promise<Model[]> {
  const pattern = `%${q}%`;
  const { rows } = await db.query<Model>(
    `SELECT model_id, brand, name, storage
     FROM model
     WHERE name ILIKE $1 OR brand ILIKE $1
     ORDER BY brand, name
     LIMIT $2`,
    [pattern, limit],
  );
  return rows;
}

export async function getAllModelsForDropdown(): Promise<
  Pick<Model, 'model_id' | 'name' | 'storage'>[]
> {
  const { rows } = await db.query<Pick<Model, 'model_id' | 'name' | 'storage'>>(
    `SELECT model_id, name, storage FROM model ORDER BY name`,
  );
  return rows;
}
