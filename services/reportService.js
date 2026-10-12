import api from "@/lib/apiClient";
import { getSession } from "@/lib/session";
import { getDemoReports, openDemoReport } from "@/lib/demoData";

/** GET /api/reports -> [{ id, testName, patientName, fileName, fileType, createdAt }] */
export async function getReports() {
  const session = getSession();
  if (session?.demo) {
    const reports = getDemoReports();
    return session.role === "PATIENT"
      ? reports.filter((report) => report.patientName === session.name)
      : reports;
  }
  return (await api.get("/reports")).data;
}

/**
 * GET /api/reports/:id?action=view|download
 * The backend decrypts the file and returns { fileName, fileType, note, data }
 */
export async function openReport(id, action = "view") {
  if (getSession()?.demo) return openDemoReport(id, action);
  return (await api.get(`/reports/${id}`, { params: { action } })).data;
}
