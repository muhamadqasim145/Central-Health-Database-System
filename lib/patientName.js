export function formatPatientName(patient) {
  return [patient.firstName, patient.lastName].filter(Boolean).join(" ").trim() || "Name unavailable";
}
