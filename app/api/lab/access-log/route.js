import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";

// GET /api/lab/access-log   (LAB only) - latest 50 actions
// Returns: [{ id, userName, reportTitle, action, createdAt }]
export async function GET(req) {
  const { error } = requireRole(req, ["LAB"]);
  if (error) return error;

  const list = await prisma.accessLog.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  return Response.json(list);
}
