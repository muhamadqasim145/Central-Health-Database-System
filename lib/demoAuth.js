const STORAGE_KEY = "chds-lab-demo-accounts";
const HASH_ITERATIONS = 120000;

function getStorage() {
  if (typeof window === "undefined") {
    throw new Error("Demo accounts are available only in the browser.");
  }
  if (!window.crypto?.subtle) {
    throw new Error("This browser does not support secure demo password storage.");
  }
  return window.localStorage;
}

function readAccounts(storage) {
  const stored = storage.getItem(STORAGE_KEY);
  if (!stored) return [];

  let accounts;
  try {
    accounts = JSON.parse(stored);
  } catch (error) {
    throw new Error("Saved demo accounts could not be read. Clear this site's browser data and try again.", {
      cause: error,
    });
  }

  if (!Array.isArray(accounts)) {
    throw new Error("Saved demo accounts have an invalid format. Clear this site's browser data and try again.");
  }
  return accounts;
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex) {
  return Uint8Array.from(hex.match(/.{2}/g) || [], (byte) => Number.parseInt(byte, 16));
}

async function hashPassword(password, salt) {
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const hash = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: hexToBytes(salt),
      iterations: HASH_ITERATIONS,
      hash: "SHA-256",
    },
    cryptoKey,
    256
  );
  return bytesToHex(new Uint8Array(hash));
}

function saveAccounts(storage, accounts) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (error) {
    throw new Error("Could not save the demo account in this browser.", { cause: error });
  }
}

export async function registerDemoAccount(name, role, username, password) {
  const storage = getStorage();
  const accounts = readAccounts(storage);
  const normalizedUsername = username.trim().toLowerCase();

  if (accounts.some((account) => account.username === normalizedUsername)) {
    const error = new Error("That username is already taken in this browser.");
    error.fieldErrors = { username: "Choose a different username." };
    throw error;
  }

  const salt = bytesToHex(window.crypto.getRandomValues(new Uint8Array(16)));
  const passwordHash = await hashPassword(password, salt);
  const account = {
    name: name.trim(),
    role,
    username: normalizedUsername,
    salt,
    passwordHash,
  };
  saveAccounts(storage, [...accounts, account]);

  return { name: account.name, role: account.role, demo: true };
}

export async function loginDemoAccount(username, password) {
  const storage = getStorage();
  const normalizedUsername = username.trim().toLowerCase();
  const account = readAccounts(storage).find((saved) => saved.username === normalizedUsername);

  if (!account || (await hashPassword(password, account.salt)) !== account.passwordHash) {
    throw new Error("Wrong username or password");
  }

  return { name: account.name, role: account.role, demo: true };
}
