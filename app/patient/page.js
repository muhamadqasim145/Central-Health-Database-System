"use client";
import PortalShell from "@/components/PortalShell";
import ReportList from "@/components/ReportList";
import Icon from "@/components/Icon";

// A patient sees only their own reports (the backend filters them by patientId)
export default function PatientPage() {
  return (
    <PortalShell allow={["PATIENT"]} chip="Patient Portal" icon="user-round">
      <div className="glass fade-up mb-4 p-5">
        <h3 className="flex items-center gap-2 text-xl font-semibold">
          <Icon name="file-text" size={21} className="text-[var(--accent)]" />
          My lab reports
        </h3>
        <p className="mt-1 text-[13px] text-[var(--muted)]">
          Your reports are stored encrypted and decrypted only when you open one.
        </p>
      </div>
      <ReportList />
    </PortalShell>
  );
}
