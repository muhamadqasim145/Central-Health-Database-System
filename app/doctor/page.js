"use client";
import PortalShell from "@/components/PortalShell";
import ReportList from "@/components/ReportList";

// Teammate's portion. The role check and header already work through PortalShell.
export default function DoctorPage() {
  return (
    <PortalShell allow={["DOCTOR"]} chip="Doctor Portal">
      <div className="glass p-5">
        <b>Doctor home page</b>
        <p className="mt-1 text-[var(--muted)]">
          Built by my teammate. The doctor requests lab tests and reads the reports here.
        </p>
      </div>
      <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Available lab reports</p>
      <ReportList />
    </PortalShell>
  );
}
