"use client";
import { useEffect, useState } from "react";
import { getAccessLog } from "@/services/labService";
import Icon from "@/components/Icon";

export default function AccessLogPage() {
  const [list, setList] = useState(null);

  useEffect(() => {
    getAccessLog().then(setList);
  }, []);

  if (!list) return <p className="text-[var(--muted)]">Loading...</p>;

  return (
    <>
      <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
        <Icon name="scroll-text" size={16} />
        Who accessed reports
      </p>
      <div className="glass px-4 py-1">
        {list.length === 0 && <p className="py-4 text-[var(--muted)]">No activity yet.</p>}
        {list.map((l, i) => (
          <div
            key={l.id}
            className="fade-up flex flex-wrap justify-between gap-2 border-b border-[var(--line)] py-3.5 last:border-0"
            style={{ animationDelay: `${Math.min(i, 10) * 0.05}s` }}
          >
            <span className="inline-flex items-center gap-2">
              <Icon name="user-round" size={15} className="text-[var(--accent)]" />
              {l.userName} · {l.reportTitle}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--muted)]">
              <Icon name="clock" size={14} />
              {l.action} · {new Date(l.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
