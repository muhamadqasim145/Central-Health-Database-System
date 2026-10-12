"use client";
import PortalShell from "@/components/PortalShell";
import ReportList from "@/components/ReportList";

// A patient sees only their own reports (the backend filters them by patientId)
export default function PatientPage() {
  return (
    <PortalShell allow={["PATIENT"]} chip="Patient Portal">
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">My lab reports</p>
      <p className="mb-3 text-[13px] text-[var(--muted)]">
        Your reports are stored encrypted and decrypted only when you open one.
      </p>
      <ReportList />
    </PortalShell>
  );
}
