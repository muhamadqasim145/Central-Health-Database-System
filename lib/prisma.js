import { PrismaClient } from "@prisma/client";

// One shared Prisma client (avoids many connections while developing)
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
