import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { decryptText } from "@/lib/encryption";

// GET /api/lab/requests   (LAB only) - test requests waiting for a report
// Returns: [{ id, patientName, testName, requestedBy, createdAt }]
export async function GET(req) {
  const { error } = requireRole(req, ["LAB"]);
  if (error) return error;

  const list = await prisma.labTestRequest.findMany({
    where: { status: "PENDING" },
    include: { patient: true },
    orderBy: { createdAt: "asc" },
  });

  return Response.json(
    list.map((r) => ({
      id: r.id,
      patientName: decryptText(r.patient.nameEncrypted), // lab is allowed to see the name
      testName: r.testName,
      requestedBy: r.requestedBy,
      createdAt: r.createdAt,
    }))
  );
}
