"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboard } from "@/services/labService";
import CountUp from "@/components/CountUp";

export default function LabDashboard() {
  const [d, setD] = useState(null);
  const [now, setNow] = useState("");

  useEffect(() => {
    getDashboard().then(setD);
  }, []);

  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleTimeString());
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  if (!d) return <p className="text-[var(--muted)]">Loading...</p>;
  const max = Math.max(...d.week, 1);

  return (
    <>
      <div
        className="shine fade-up relative flex flex-wrap items-center justify-between gap-3 overflow-hidden rounded-[20px] p-6 text-white"
        style={{ background: "linear-gradient(120deg, var(--accent), #0a4f66)" }}
      >
        <div>
          <p className="text-[13px] opacity-90">Today · {now}</p>
          <h3 className="mt-1 text-[22px] font-semibold">
            {d.pending ? `${d.pending} requests waiting for reports` : "All requests are completed"}
          </h3>
        </div>
        {d.pending > 0 && (
          <Link href="/lab/requests" className="relative z-10 rounded-[10px] bg-white px-4 py-2 font-semibold text-[var(--accent)]">
            Review now
          </Link>
        )}
      </div>

      <div className="my-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Pending requests", d.pending],
          ["Reports uploaded", d.uploaded],
          ["Reports viewed", d.viewed],
          ["Encrypted files", d.encrypted],
        ].map(([label, value], i) => (
          <div key={label} className="glass fade-up p-4" style={{ animationDelay: `${i * 0.12}s` }}>
            <b className="block text-[34px] text-[var(--accent)]">
              <CountUp to={value} />
            </b>
            <span className="text-[13px] text-[var(--muted)]">{label}</span>
          </div>
        ))}
      </div>

      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Reports uploaded this week</p>
      <div className="glass flex h-40 items-end gap-2.5 p-4">
        {d.week.map((v, i) => (
          <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5 text-xs text-[var(--muted)]">
            <i
              className="grow block w-full rounded-t-lg rounded-b bg-gradient-to-b from-[var(--accent2)] to-[var(--accent)]"
              style={{ height: `${(v / max) * 100}%`, animationDelay: `${i * 0.08}s`, minHeight: v ? undefined : 3 }}
            />
            <span>{d.days[i]}</span>
          </div>
        ))}
      </div>

      <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Quick actions</p>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[
          ["/lab/requests", "Review requests"],
          ["/lab/upload", "Upload report"],
          ["/lab/reports", "Open reports"],
          ["/lab/log", "Access log"],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="rounded-[14px] border-[1.5px] border-[var(--line)] bg-white p-4 text-center font-semibold transition hover:-translate-y-1 hover:border-[var(--accent)]"
          >
            {label}
          </Link>
        ))}
      </div>
    </>
  );
}
