import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { formatPatientName } from "@/lib/patientName";

// GET /api/reports   (LAB, DOCTOR, PATIENT)
// Lab and doctor get all reports. A patient gets only their own.
// Returns the list only - no file content. Content comes from /api/reports/:id
export async function GET(req) {
  const { user, error } = requireRole(req, ["LAB", "DOCTOR", "PATIENT"]);
  if (error) return error;

  const where = user.role === "PATIENT" ? { patientId: user.patientId } : {};

  const list = await prisma.labReport.findMany({
    where,
    select: {
      id: true,
      fileName: true,
      fileType: true,
      createdAt: true,
      request: { select: { testName: true } },
      patient: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(
    list.map((r) => ({
      id: r.id,
      testName: r.request.testName,
      patientName: decryptText(r.patient.nameEncrypted),
      fileName: r.fileName,
      fileType: r.fileType,
      createdAt: r.createdAt,
    }))
  );
}
