import api from "@/lib/apiClient";

export async function getPatients() {
  return (await api.get("/patients")).data;
}

export async function createLabRequest(patientId, testName) {
  return (await api.post("/doctor/requests", { patientId, testName })).data;
}
