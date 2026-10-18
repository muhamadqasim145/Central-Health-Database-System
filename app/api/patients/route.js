import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { formatPatientName } from "@/lib/patientName";

// GET /api/patients (DOCTOR only) - patients available for test requests.
export async function GET(req) {
  const { error } = requireRole(req, ["DOCTOR"]);
  if (error) return error;

  const patients = await prisma.patients.findMany({
    select: { patientID: true, firstName: true, lastName: true },
    orderBy: { patientID: "asc" },
  });

  return Response.json(
    patients.map((patient) => ({
      id: patient.patientID,
      name: formatPatientName(patient),
    }))
  );
}
