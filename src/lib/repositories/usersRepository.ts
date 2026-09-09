import { getDatabase } from "@/lib/db";
import { User } from "@/types/database";

/**
 * Retrieves a user record by their unique ID.
 */
export function getUserById(id: string): User | null {
  const sql = `SELECT * FROM users WHERE id = ?`;
  const row = getDatabase().prepare(sql).get(id) as User | undefined;
  return row ?? null;
}


/**
 * Upserts a user record into the database.
 * If user exists by id, updates email, name, and avatar_url.
 */
export function upsertUser(user: User): User {
  const now = user.created_at || new Date().toISOString();
  const sql = `
    INSERT INTO users (id, email, name, avatar_url, created_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      email = excluded.email,
      name = coalesce(excluded.name, users.name),
      avatar_url = coalesce(excluded.avatar_url, users.avatar_url)
    RETURNING *
  `;
  const row = getDatabase().prepare(sql).get(
    user.id,
    user.email,
    user.name || null,
    user.avatar_url || null,
    now
  ) as User;

  return row;
}
