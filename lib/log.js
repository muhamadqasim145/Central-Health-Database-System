import { prisma } from "@/lib/prisma";

// Saves who did what to which report (the access log)
export function logAccess(userName, reportTitle, action, userId = null) {
  return prisma.accessLog.create({ data: { userName, reportTitle, action, userId } });
}
