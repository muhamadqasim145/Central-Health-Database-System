import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";

// GET /api/lab/dashboard   (LAB only)
// Returns: { pending, uploaded, viewed, encrypted, week: [7 numbers], days: [7 labels] }
export async function GET(req) {
  const { error } = requireRole(req, ["LAB"]);
  if (error) return error;

  const since = new Date(Date.now() - 6 * 86400000);
  since.setHours(0, 0, 0, 0);

  const [pending, uploaded, viewed, recent] = await Promise.all([
    prisma.labTestRequest.count({ where: { status: "PENDING" } }),
    prisma.labReport.count(),
    prisma.accessLog.count({ where: { action: { startsWith: "Viewed" } } }),
    prisma.labReport.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
  ]);

  // reports uploaded on each of the last 7 days
  const week = Array(7).fill(0);
  recent.forEach((r) => {
    const day = Math.floor((r.createdAt - since) / 86400000);
    if (day >= 0 && day < 7) week[day]++;
  });
  const days = Array.from({ length: 7 }, (_, i) =>
    new Date(since.getTime() + i * 86400000).toLocaleDateString("en", { weekday: "short" })
  );

  return Response.json({ pending, uploaded, viewed, encrypted: uploaded, week, days });
}
