const STORAGE_KEY = "chds-lab-demo-data";
const SAMPLE_REPORT = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="460" viewBox="0 0 720 460"><rect width="720" height="460" rx="24" fill="#f4fbfa"/><text x="48" y="76" font-family="Arial,sans-serif" font-size="30" font-weight="bold" fill="#0b665d">Al Shifa Hospital</text><text x="48" y="122" font-family="Arial,sans-serif" font-size="20" fill="#12233a">LABORATORY REPORT · DEMO SAMPLE</text><path d="M48 148h624" stroke="#c6ddd8" stroke-width="2"/><text x="48" y="202" font-family="Arial,sans-serif" font-size="18" fill="#55657a">Complete Blood Count</text><text x="48" y="258" font-family="Arial,sans-serif" font-size="17" fill="#12233a">Hemoglobin</text><text x="450" y="258" font-family="Arial,sans-serif" font-size="17" fill="#12233a">13.2 g/dL</text><text x="48" y="300" font-family="Arial,sans-serif" font-size="17" fill="#12233a">White blood cells</text><text x="450" y="300" font-family="Arial,sans-serif" font-size="17" fill="#12233a">6.4 × 10⁹/L</text><text x="48" y="342" font-family="Arial,sans-serif" font-size="17" fill="#12233a">Platelets</text><text x="450" y="342" font-family="Arial,sans-serif" font-size="17" fill="#12233a">250 × 10⁹/L</text><text x="48" y="414" font-family="Arial,sans-serif" font-size="14" fill="#9a5b00">Fictional values for interface demonstration only — not medical results.</text></svg>'
)}`;

function initialData() {
  const now = Date.now();
  const day = (offset) => new Date(now - offset * 86400000).toISOString();
  return {
    requests: [
      { id: 101, patientName: "Alex Morgan", testName: "Complete Blood Count", requestedBy: "Dr. Rivera", createdAt: day(0) },
      { id: 102, patientName: "Jamie Chen", testName: "Lipid Panel", requestedBy: "Dr. Patel", createdAt: day(1) },
      { id: 103, patientName: "Taylor Kim", testName: "Metabolic Panel", requestedBy: "Dr. Williams", createdAt: day(2) },
    ],
    reports: [
      {
        id: 201,
        testName: "Complete Blood Count",
        patientName: "Sam Patient",
        fileName: "demo-cbc-report.svg",
        fileType: "image/svg+xml",
        createdAt: day(1),
        note: "Sample result for interface demonstration only.",
        data: SAMPLE_REPORT,
      },
    ],
    accessLog: [
      { id: 301, userName: "Lab Technician", reportTitle: "Complete Blood Count - Sam Patient", action: "Uploaded (demo)", createdAt: day(1) },
      { id: 302, userName: "Dr. Rivera", reportTitle: "Complete Blood Count - Sam Patient", action: "Viewed (demo)", createdAt: day(0) },
    ],
  };
}

export function getDemoData() {
  if (typeof window === "undefined") return initialData();
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (error) {
    console.error("Could not read demo data from local storage", error);
  }
  const data = initialData();
  saveDemoData(data);
  return data;
}

export function saveDemoData(data) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Could not save demo data to local storage", error);
    throw error;
  }
}

export function getDemoReports() {
  return getDemoData().reports.map(({ note, data, ...report }) => report);
}

export function openDemoReport(id, action) {
  const demo = getDemoData();
  const report = demo.reports.find((item) => item.id === Number(id));
  if (!report) throw new Error("Demo report not found");
  demo.accessLog.unshift({
    id: Date.now(),
    userName: "Demo user",
    reportTitle: `${report.testName} - ${report.patientName}`,
    action: action === "download" ? "Downloaded (demo)" : "Viewed (demo)",
    createdAt: new Date().toISOString(),
  });
  saveDemoData(demo);
  return report;
}

export function uploadDemoReport(requestId) {
  const demo = getDemoData();
  const request = demo.requests.find((item) => item.id === Number(requestId));
  if (!request) throw new Error("Demo request not found or already completed");

  const report = {
    id: Date.now(),
    testName: request.testName,
    patientName: request.patientName,
    fileName: "demo-report.svg",
    fileType: "image/svg+xml",
    createdAt: new Date().toISOString(),
    note: "Sample result for interface demonstration only.",
    data: SAMPLE_REPORT,
  };
  demo.reports.unshift(report);
  demo.requests = demo.requests.filter((item) => item.id !== request.id);
  demo.accessLog.unshift({
    id: Date.now() + 1,
    userName: "Lab Technician",
    reportTitle: `${request.testName} - ${request.patientName}`,
    action: "Uploaded (demo)",
    createdAt: new Date().toISOString(),
  });
  saveDemoData(demo);
  return { ok: true };
}
