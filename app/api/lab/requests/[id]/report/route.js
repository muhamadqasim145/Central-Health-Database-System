import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { encryptBuffer, encryptText, decryptText } from "@/lib/encryption";
import { logAccess } from "@/lib/log";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

// POST /api/lab/requests/:id/report   (LAB only)
// Body: multipart form data -> file (photo or PDF), note (optional text)
// The file is encrypted here before it is saved.
export async function POST(req, { params }) {
  const { user, error } = requireRole(req, ["LAB"]);
  if (error) return error;

  const { id } = await params;
  const request = await prisma.labTestRequest.findUnique({
    where: { id: Number(id) },
    include: { patient: true },
  });
  if (!request || request.status !== "PENDING") {
    return Response.json({ message: "Request not found or already completed" }, { status: 404 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const note = String(form.get("note") || "").trim();

  if (!file || typeof file === "string")
    return Response.json({ message: "Please attach the report photo or PDF" }, { status: 400 });
  if (!ALLOWED.includes(file.type))
    return Response.json({ message: "Only JPG, PNG, WEBP or PDF files are allowed" }, { status: 400 });
  if (file.size > MAX_SIZE)
    return Response.json({ message: "File is larger than 5 MB" }, { status: 400 });

  const bytes = Buffer.from(await file.arrayBuffer());

  // save the encrypted report and mark the request as completed (both or nothing)
  await prisma.$transaction([
    prisma.labReport.create({
      data: {
        requestId: request.id,
        patientId: request.patientId,
        fileName: file.name,
        fileType: file.type,
        fileEncrypted: encryptBuffer(bytes),
        noteEncrypted: note ? encryptText(note) : null,
        uploadedBy: user.id,
      },
    }),
    prisma.labTestRequest.update({ where: { id: request.id }, data: { status: "COMPLETED" } }),
  ]);

  await logAccess(
    user.name,
    `${request.testName} - ${decryptText(request.patient.nameEncrypted)}`,
    "Uploaded (encrypted)"
  );

  return Response.json({ ok: true });
}
