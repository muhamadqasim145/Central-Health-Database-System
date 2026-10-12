import jwt from "jsonwebtoken";

export function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, name: user.name, patientId: user.patientId },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
}

// Reads "Authorization: Bearer <token>" and returns the user, or null
export function getUser(req) {
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

// Use at the top of every protected API:
//   const { user, error } = requireRole(req, ["LAB"]);
//   if (error) return error;
export function requireRole(req, roles) {
  const user = getUser(req);
  if (!user) return { error: Response.json({ message: "Please log in" }, { status: 401 }) };
  if (!roles.includes(user.role))
    return { error: Response.json({ message: "You are not allowed to do this" }, { status: 403 }) };
  return { user };
}
