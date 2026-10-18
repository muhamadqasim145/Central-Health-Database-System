import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { decryptBuffer, decryptText } from "@/lib/encryption";
import { logAccess } from "@/lib/log";
import { formatPatientName } from "@/lib/patientName";

// GET /api/reports/:id?action=view   or   ?action=download
// Checks the role, decrypts the file only now, writes an access log row.
// Returns: { id, testName, patientName, fileName, fileType, note, data }
// "data" is a data URL, so the frontend can show it in <img> or <iframe>.
export async function GET(req, { params }) {
  const { user, error } = requireRole(req, ["LAB", "DOCTOR", "PATIENT"]);
  if (error) return error;

  const { id } = await params;
  const report = await prisma.labReport.findUnique({
    where: { id: Number(id) },
    include: { request: true, patient: true },
  });
  if (!report) return Response.json({ message: "Report not found" }, { status: 404 });

  // a patient may only open their own reports
  if (user.role === "PATIENT" && report.patientId !== user.patientId) {
    return Response.json({ message: "You are not allowed to open this report" }, { status: 403 });
  }

  try {
    const file = decryptBuffer(Buffer.from(report.fileEncrypted)); // decrypted only for this request
    const note = report.noteEncrypted ? decryptText(report.noteEncrypted) : "";
    const patientName = formatPatientName(report.patient);
    const action =
      new URL(req.url).searchParams.get("action") === "download" ? "Downloaded" : "Viewed (decrypted)";

    await logAccess(user.name, `${report.request.testName} - ${patientName}`, action, user.id);

    return Response.json({
      id: report.id,
      testName: report.request.testName,
      patientName,
      fileName: report.fileName,
      fileType: report.fileType,
      note,
      data: `data:${report.fileType};base64,${file.toString("base64")}`,
    });
  } catch {
    // decryption fails if the key is wrong or the stored data was changed
    return Response.json({ message: "Could not decrypt this report" }, { status: 500 });
  }
}
