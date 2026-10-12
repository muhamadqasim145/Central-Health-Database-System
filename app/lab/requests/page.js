"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getRequests } from "@/services/labService";

export default function RequestsPage() {
  const [list, setList] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getRequests().then(setList).catch(() => setError("Could not load the requests"));
  }, []);

  if (error) return <p className="text-sm text-red-700">{error}</p>;
  if (!list) return <p className="text-[var(--muted)]">Loading...</p>;

  return (
    <>
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Test requests from doctors</p>
      <div className="glass px-4 py-1">
        {list.length === 0 && <p className="py-4 text-[var(--muted)]">No pending requests</p>}
        {list.map((r, i) => (
          <div
            key={r.id}
            className="fade-up flex items-center justify-between gap-3 border-b border-[var(--line)] py-3.5 last:border-0"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="min-w-0 flex-1">
              <b>{r.testName}</b>
              <span className="ml-2 rounded-full bg-[#fff0d6] px-2.5 py-0.5 text-[11px] font-bold text-[#9a5b00]">PENDING</span>
              <div className="mt-1 text-[13px] text-[var(--muted)]">
                {r.patientName} · Requested by {r.requestedBy} · {new Date(r.createdAt).toLocaleDateString()}
              </div>
            </div>
            <Link
              href={`/lab/upload?request=${r.id}`}
              className="rounded-[10px] bg-[var(--accent)] px-3.5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Upload report
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
