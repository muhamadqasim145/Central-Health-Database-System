import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/serverAuth";
import { hasValidationErrors, validateRegistration } from "@/lib/authValidation";
import { getAuthDatabaseSetupResponse } from "@/lib/authDatabase";

// POST /api/auth/register body: { name, role, username, password, confirmPassword }
// Public registration is limited to doctor and laboratory staff roles.
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

  const errors = validateRegistration(input);
  if (hasValidationErrors(errors)) {
    return Response.json({ message: "Check the highlighted fields.", errors }, { status: 400 });
  }

  if (!process.env.DATABASE_URL?.trim()) {
    return getAuthDatabaseSetupResponse();
  }

  const name = input.name.trim();
  const username = input.username.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(input.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        username,
        passwordHash,
        role: input.role,
      },
    });

    return Response.json(
      { token: signToken(user), role: user.role, name: user.name },
      { status: 201 }
    );
  } catch (error) {
    if (error?.code === "P2002") {
      return Response.json(
        {
          message: "That username is already taken.",
          errors: { username: "Choose a different username." },
        },
        { status: 409 }
      );
    }
    const setupResponse = getAuthDatabaseSetupResponse(error);
    if (setupResponse) return setupResponse;
    throw error;
  }
}
