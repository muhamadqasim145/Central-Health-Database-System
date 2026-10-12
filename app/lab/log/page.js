"use client";
import { useEffect, useState } from "react";
import { getAccessLog } from "@/services/labService";

export default function AccessLogPage() {
  const [list, setList] = useState(null);

  useEffect(() => {
    getAccessLog().then(setList);
  }, []);

  if (!list) return <p className="text-[var(--muted)]">Loading...</p>;

  return (
    <>
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Who accessed reports</p>
      <div className="glass px-4 py-1">
        {list.length === 0 && <p className="py-4 text-[var(--muted)]">No activity yet.</p>}
        {list.map((l, i) => (
          <div
            key={l.id}
            className="fade-up flex flex-wrap justify-between gap-2 border-b border-[var(--line)] py-3.5 last:border-0"
            style={{ animationDelay: `${Math.min(i, 10) * 0.05}s` }}
          >
            <span>
              {l.userName} · {l.reportTitle}
            </span>
            <span className="text-[13px] text-[var(--muted)]">
              {l.action} · {new Date(l.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
