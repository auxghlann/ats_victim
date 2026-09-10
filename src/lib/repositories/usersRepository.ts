import { getSupabase } from "@/lib/db/supabase";
import { User } from "@/types/database";
import { encrypt, decrypt } from "@/lib/security/encryption";

/**
 * Retrieves a user record by their unique ID, decrypting PII fields.
 */
export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await getSupabase()
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase error fetching user by ID:", error);
    return null;
  }
  if (!data) return null;

  return {
    ...data,
    email: decrypt(data.email),
    name: data.name ? decrypt(data.name) : null,
  } as User;
}

/**
 * Upserts a user record into the database with encrypted PII.
 * If user exists by id, updates email, name, and avatar_url.
 */
export async function upsertUser(user: User): Promise<User> {
  const payload = {
    id: user.id,
    email: encrypt(user.email),
    name: user.name ? encrypt(user.name) : null,
    avatar_url: user.avatar_url || null,
  };

  const { data, error } = await getSupabase()
    .from("users")
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    console.error("Supabase error upserting user:", error);
    throw error;
  }

  return {
    ...data,
    email: decrypt(data.email),
    name: data.name ? decrypt(data.name) : null,
  } as User;
}

export const usersRepository = {
  getUserById,
  upsertUser,
};
