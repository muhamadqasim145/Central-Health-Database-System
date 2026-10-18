import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";

// POST /api/doctor/requests (DOCTOR only) - send a patient test request to the lab.
export async function POST(req) {
  const { user, error } = requireRole(req, ["DOCTOR"]);
  if (error) return error;

  let input;
  try {
    input = await req.json();
  } catch {
    return Response.json({ message: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return Response.json({ message: "Request body must be a JSON object." }, { status: 400 });
  }

  const patientId = input.patientId;
  const testName = typeof input.testName === "string" ? input.testName.trim() : "";
  if (!Number.isSafeInteger(patientId) || patientId < 1) {
    return Response.json({ message: "Choose a valid patient." }, { status: 400 });
  }
  if (testName.length < 2 || testName.length > 100 || /[\u0000-\u001f\u007f]/.test(testName)) {
    return Response.json(
      { message: "Test name must be 2 to 100 characters and contain no control characters." },
      { status: 400 }
    );
  }

  const patient = await prisma.patients.findUnique({
    where: { patientID: patientId },
    select: { patientID: true },
  });
  if (!patient) return Response.json({ message: "Patient not found." }, { status: 404 });

  const request = await prisma.labTestRequest.create({
    data: { patientId, testName, requestedBy: user.name },
    select: { id: true, patientId: true, testName: true, status: true, createdAt: true },
  });

  return Response.json(request, { status: 201 });
}
