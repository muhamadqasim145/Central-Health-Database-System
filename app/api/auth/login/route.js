import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/serverAuth";
import { hasValidationErrors, validateLogin } from "@/lib/authValidation";
import { getAuthDatabaseSetupResponse } from "@/lib/authDatabase";

// POST /api/auth/login   body: { username, password }
// Returns: { token, role, name }
export async function POST(req) {
  let input;
  try {
    input = await req.json();
  } catch {
    return Response.json({ message: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return Response.json({ message: "Request body must be a JSON object." }, { status: 400 });
  }

  const errors = validateLogin(input);
  if (hasValidationErrors(errors)) {
    return Response.json({ message: "Check the highlighted fields.", errors }, { status: 400 });
  }

  if (!process.env.DATABASE_URL?.trim()) {
    return getAuthDatabaseSetupResponse();
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username: input.username.trim().toLowerCase() },
    });
    const ok = user && (await bcrypt.compare(input.password, user.passwordHash));
    if (!ok) {
      return Response.json({ message: "Wrong username or password" }, { status: 401 });
    }

    return Response.json({ token: signToken(user), role: user.role, name: user.name });
  } catch (error) {
    const setupResponse = getAuthDatabaseSetupResponse(error);
    if (setupResponse) return setupResponse;
    throw error;
  }
}
