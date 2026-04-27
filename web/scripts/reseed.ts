import fs from 'node:fs';
import path from 'node:path';
import { Client } from 'pg';
import bcrypt from 'bcryptjs';

const REPO_ROOT = path.resolve(process.cwd(), '..');
const SEED_DIR = path.join(REPO_ROOT, 'db', 'seed');
const SCHEMA_PATH = path.join(REPO_ROOT, 'db', 'schema.sql');

if (!process.env.DATABASE_URL) {
  console.error(
    'DATABASE_URL is not set. Run via `npm run db:reseed` from web/.',
  );
  process.exit(1);
}

function parseCsv(content: string): string[][] {
  return content
    .split(/\r?\n/)
    .filter((line) => line.length > 0)
    .map((line) => line.split(','));
}

function readSeed(name: string): string[][] {
  const rows = parseCsv(fs.readFileSync(path.join(SEED_DIR, name), 'utf8'));
  rows.shift();
  return rows;
}

async function main(): Promise<void> {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  console.log('→ Running schema (drops + creates)...');
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  await client.query(schema);

  await client.query('BEGIN');
  try {
    const sellers = readSeed('seller.csv');
    for (const [seller_id, name, website_link] of sellers) {
      await client.query(
        'INSERT INTO seller (seller_id, name, website_link) VALUES ($1, $2, $3)',
        [Number(seller_id), name, website_link],
      );
    }
    await client.query(
      "SELECT setval('seller_seller_id_seq', (SELECT MAX(seller_id) FROM seller))",
    );
    console.log(`✓ seller: ${sellers.length} rows`);

    const users = readSeed('app_user.csv');
    for (const [user_id, name, email, password] of users) {
      await client.query(
        'INSERT INTO app_user (user_id, name, email, password) VALUES ($1, $2, $3, $4)',
        [Number(user_id), name, email, password],
      );
    }
    await client.query(
      "SELECT setval('app_user_user_id_seq', (SELECT MAX(user_id) FROM app_user))",
    );
    console.log(`✓ app_user: ${users.length} rows`);

    const models = readSeed('model.csv');
    for (const [model_id, brand, name, storage] of models) {
      await client.query(
        'INSERT INTO model (model_id, brand, name, storage) VALUES ($1, $2, $3, $4)',
        [Number(model_id), brand, name, storage],
      );
    }
    await client.query(
      "SELECT setval('model_model_id_seq', (SELECT MAX(model_id) FROM model))",
    );
    console.log(`✓ model: ${models.length} rows`);

    const listings = readSeed('listing.csv');
    for (const [listing_id, model_id, seller_id, price] of listings) {
      await client.query(
        'INSERT INTO listing (listing_id, model_id, seller_id, price) VALUES ($1, $2, $3, $4)',
        [Number(listing_id), Number(model_id), Number(seller_id), price],
      );
    }
    await client.query(
      "SELECT setval('listing_listing_id_seq', (SELECT MAX(listing_id) FROM listing))",
    );
    console.log(`✓ listing: ${listings.length} rows`);

    const favorites = readSeed('favorite.csv');
    for (const [user_id, listing_id] of favorites) {
      await client.query(
        'INSERT INTO favorite (user_id, listing_id) VALUES ($1, $2)',
        [Number(user_id), Number(listing_id)],
      );
    }
    console.log(`✓ favorite: ${favorites.length} rows`);

    console.log('→ Rehashing seeded user passwords to "password123"...');
    const hash = await bcrypt.hash('password123', 10);
    const { rowCount } = await client.query(
      'UPDATE app_user SET password = $1',
      [hash],
    );
    console.log(`✓ rehashed ${rowCount} user passwords`);

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  }

  const counts = await client.query<{ t: string; c: string }>(`
    SELECT 'seller' AS t, COUNT(*)::text AS c FROM seller
    UNION ALL SELECT 'app_user',  COUNT(*)::text FROM app_user
    UNION ALL SELECT 'model',     COUNT(*)::text FROM model
    UNION ALL SELECT 'listing',   COUNT(*)::text FROM listing
    UNION ALL SELECT 'favorite',  COUNT(*)::text FROM favorite
  `);
  console.log('\n=== Final row counts ===');
  for (const row of counts.rows) {
    console.log(`  ${row.t.padEnd(9)} ${row.c}`);
  }
  console.log('\nSeeded user demo login: nancy.garcia@example.com / password123');

  await client.end();
}

main().catch((err) => {
  console.error('Reseed failed:', err);
  process.exit(1);
});
