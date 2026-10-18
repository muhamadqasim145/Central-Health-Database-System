import api from "@/lib/apiClient";

/**
 * POST /api/auth/register
 * Creates a staff account in the configured database.
 */
export async function register(name, role, username, password, confirmPassword) {
  return (
    await api.post("/auth/register", {
      name,
      role,
      username,
      password,
      confirmPassword,
    })
  ).data;
}

/**
 * POST /api/auth/login
 * Sends:   { username, password }
 * Returns: { token, role, name }   role is "LAB", "DOCTOR" or "PATIENT"
 */
export async function login(username, password) {
  return (await api.post("/auth/login", { username, password })).data;
}
