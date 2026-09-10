import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";

/**
 * Returns a 32-byte key derived from environment secrets.
 * In development, provides a predictable fallback so tests and local dev work without extra setup.
 */
function getKey(): Buffer {
  const secret =
    process.env.APP_ENCRYPTION_KEY ||
    process.env.TOKEN_ENCRYPTION_KEY ||
    (process.env.NODE_ENV !== "production"
      ? "ats-victim-local-dev-secret-key-32bytes!!"
      : "");

  if (!secret) {
    throw new Error("APP_ENCRYPTION_KEY must be defined in production environment.");
  }

  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypts plaintext string using AES-256-GCM.
 * Output format: iv_hex:auth_tag_hex:ciphertext_hex
 */
export function encrypt(text: string): string {
  if (!text) return text;

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const tag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts a ciphertext string produced by encrypt().
 * If the input does not conform to iv:tag:ciphertext, returns the input string
 * as-is to ensure backwards compatibility with legacy plaintext records.
 */
export function decrypt(ciphertext: string): string {
  if (!ciphertext) return ciphertext;

  const parts = ciphertext.split(":");
  if (parts.length !== 3) {
    // Unencrypted legacy data fallback
    return ciphertext;
  }

  const [ivHex, tagHex, encryptedHex] = parts;

  // Validate hex format
  if (ivHex.length !== 24 || tagHex.length !== 32) {
    return ciphertext;
  }

  try {
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      getKey(),
      Buffer.from(ivHex, "hex")
    );
    decipher.setAuthTag(Buffer.from(tagHex, "hex"));

    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
    console.error("Decryption failed:", err);
    return ciphertext;
  }
}
