import { loginDemoAccount, registerDemoAccount } from "@/lib/demoAuth";

/**
 * POST /api/auth/register
 * Creates a staff account and returns a login session.
 */
export async function register(name, role, username, password, confirmPassword) {
  return registerDemoAccount(name, role, username, password, confirmPassword);
}

/**
 * POST /api/auth/login
 * Sends:   { username, password }
 * Returns: { token, role, name }   role is "LAB", "DOCTOR" or "PATIENT"
 */
export async function login(username, password) {
  return loginDemoAccount(username, password);
}
