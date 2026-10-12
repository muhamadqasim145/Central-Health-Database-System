import crypto from "crypto";

// AES-256-GCM. The key lives in .env, never in the database or the frontend.
const key = () => Buffer.from(process.env.ENCRYPTION_KEY, "hex");

// Buffer (file bytes) -> Buffer: [12 byte iv][16 byte tag][encrypted data]
export function encryptBuffer(buf) {
  const iv = crypto.randomBytes(12); // new random value for every encryption
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(buf), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), data]);
}

export function decryptBuffer(stored) {
  const iv = stored.subarray(0, 12);
  const tag = stored.subarray(12, 28);
  const data = stored.subarray(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(tag); // fails if the stored data was changed
  return Buffer.concat([decipher.update(data), decipher.final()]);
}

// Text helpers (names, notes) -> base64 string that fits a normal String column
export const encryptText = (text) =>
  encryptBuffer(Buffer.from(String(text), "utf8")).toString("base64");

export const decryptText = (stored) =>
  decryptBuffer(Buffer.from(stored, "base64")).toString("utf8");
