import { db } from '@/lib/db';

export type User = {
  user_id: number;
  name: string;
  email: string;
};

export type UserWithPassword = User & { password: string };

export async function findUserByEmail(
  email: string,
): Promise<UserWithPassword | null> {
  const { rows } = await db.query<UserWithPassword>(
    `SELECT user_id, name, email, password FROM app_user WHERE email = $1`,
    [email],
  );
  return rows[0] ?? null;
}

export async function findUserById(id: number): Promise<User | null> {
  const { rows } = await db.query<User>(
    `SELECT user_id, name, email FROM app_user WHERE user_id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function createUser(
  name: string,
  email: string,
  hashedPassword: string,
): Promise<User> {
  const { rows } = await db.query<User>(
    `INSERT INTO app_user (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING user_id, name, email`,
    [name, email, hashedPassword],
  );
  return rows[0];
}

export async function updateUserName(
  userId: number,
  name: string,
): Promise<boolean> {
  const { rowCount } = await db.query(
    `UPDATE app_user SET name = $1 WHERE user_id = $2`,
    [name, userId],
  );
  return (rowCount ?? 0) > 0;
}

export async function updateUserPassword(
  userId: number,
  hashedPassword: string,
): Promise<boolean> {
  const { rowCount } = await db.query(
    `UPDATE app_user SET password = $1 WHERE user_id = $2`,
    [hashedPassword, userId],
  );
  return (rowCount ?? 0) > 0;
}
