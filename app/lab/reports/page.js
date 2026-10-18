"use client";
import { useEffect, useState } from "react";
import ReportList from "@/components/ReportList";
import Icon from "@/components/Icon";

export default function LabReportsPage() {
  const [flash, setFlash] = useState("");

  useEffect(() => {
    // message saved by the upload page
    const m = sessionStorage.getItem("flash");
    if (m) {
      sessionStorage.removeItem("flash");
      const showTimer = setTimeout(() => setFlash(m), 0);
      const clearTimer = setTimeout(() => setFlash(""), 4000);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(clearTimer);
      };
    }
  }, []);

  return (
    <>
      {flash && <div className="fade-up mb-4 rounded-xl bg-[#eafaf1] px-4 py-3 text-sm text-[#14532d]">{flash}</div>}
      <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
        <Icon name="files" size={16} />
        Uploaded reports
      </p>
      <ReportList />
    </>
  );
}
