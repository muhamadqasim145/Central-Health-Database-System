import api from "@/lib/apiClient";
import { getSession } from "@/lib/session";
import { getDemoData, uploadDemoReport } from "@/lib/demoData";

/** GET /api/lab/dashboard -> { pending, uploaded, viewed, encrypted, week[], days[] } */
export async function getDashboard() {
  if (getSession()?.demo) {
    const demo = getDemoData();
    const week = Array(7).fill(0);
    demo.reports.forEach((report) => {
      const day = Math.floor((Date.now() - new Date(report.createdAt).getTime()) / 86400000);
      if (day >= 0 && day < 7) week[6 - day]++;
    });
    return {
      pending: demo.requests.length,
      uploaded: demo.reports.length,
      viewed: demo.accessLog.filter((entry) => entry.action.startsWith("Viewed")).length,
      encrypted: demo.reports.length,
      week,
      days: Array.from({ length: 7 }, (_, i) =>
        new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString("en", { weekday: "short" })
      ),
    };
  }
  return (await api.get("/lab/dashboard")).data;
}

/** GET /api/lab/requests -> [{ id, patientName, testName, requestedBy, createdAt }] */
export async function getRequests() {
  if (getSession()?.demo) return getDemoData().requests;
  return (await api.get("/lab/requests")).data;
}

/**
 * POST /api/lab/requests/:id/report   (multipart form: file, note)
 * onProgress receives a number from 0 to 100
 */
export async function uploadReport(requestId, file, note, onProgress) {
  if (getSession()?.demo) {
    onProgress?.(100);
    return uploadDemoReport(requestId);
  }
  const form = new FormData();
  form.append("file", file);
  form.append("note", note || "");
  const res = await api.post(`/lab/requests/${requestId}/report`, form, {
    onUploadProgress: (e) => e.total && onProgress?.(Math.round((e.loaded / e.total) * 100)),
  });
  return res.data;
}

/** GET /api/lab/access-log -> [{ id, userName, reportTitle, action, createdAt }] */
export async function getAccessLog() {
  if (getSession()?.demo) return getDemoData().accessLog;
  return (await api.get("/lab/access-log")).data;
}
