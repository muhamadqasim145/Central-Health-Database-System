"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboard } from "@/services/labService";
import CountUp from "@/components/CountUp";
import Icon from "@/components/Icon";

const metrics = [
  { label: "Pending requests", key: "pending", icon: "clipboard-list", href: "/lab/requests", detail: "Ready for review" },
  { label: "Reports uploaded", key: "uploaded", icon: "file-up", href: "/lab/reports", detail: "Reports in your library" },
  { label: "Reports viewed", key: "viewed", icon: "eye", href: "/lab/log", detail: "Views recorded securely" },
  { label: "Encrypted files", key: "encrypted", icon: "shield-check", href: "/lab/reports", detail: "Protected at rest" },
];

const workspaces = [
  { href: "/lab/requests", label: "Review requests", detail: "Check incoming test requests", icon: "clipboard-list", tone: "mint" },
  { href: "/lab/upload", label: "Upload a report", detail: "Add an encrypted result", icon: "file-up", tone: "blue" },
  { href: "/lab/reports", label: "Report library", detail: "View and download reports", icon: "files", tone: "violet" },
  { href: "/lab/log", label: "Access history", detail: "See who viewed reports", icon: "scroll-text", tone: "amber" },
];

export default function LabDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [now, setNow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    getDashboard()
      .then((data) => {
        if (active) {
          setDashboard(data);
          setError("");
        }
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || "We couldn’t load your lab overview. Check your connection and try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refreshKey]);

  function refreshDashboard() {
    setLoading(true);
    setError("");
    setRefreshKey((key) => key + 1);
  }

  useEffect(() => {
    const updateTime = () => setNow(new Date());
    const initialTimer = setTimeout(updateTime, 0);
    const timer = setInterval(updateTime, 60_000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(timer);
    };
  }, []);

  if (loading && !dashboard) {
    return (
      <div className="lab-dashboard space-y-5" aria-label="Loading laboratory dashboard" aria-busy="true">
        <div className="lab-skeleton h-56 rounded-[28px]" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {metrics.map((metric) => <div key={metric.key} className="lab-skeleton h-28 rounded-2xl" />)}
        </div>
        <div className="lab-skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <section className="glass fade-up p-6 sm:p-8" role="alert">
        <div className="mb-3 inline-flex rounded-2xl bg-rose-50 p-3 text-rose-700">
          <Icon name="activity" size={24} />
        </div>
        <h3 className="text-lg font-semibold text-[var(--ink)]">Dashboard unavailable</h3>
        <p className="mt-1 max-w-xl text-sm leading-6 text-[var(--muted)]">{error}</p>
        <button
          type="button"
          onClick={refreshDashboard}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          <Icon name="activity" size={16} />
          Try again
        </button>
      </section>
    );
  }

  const max = Math.max(...dashboard.week, 1);
  const weeklyTotal = dashboard.week.reduce((total, value) => total + value, 0);
  const hasPending = dashboard.pending > 0;

  return (
    <main className="lab-dashboard space-y-6">
      <section className="lab-hero shine fade-up relative isolate overflow-hidden rounded-[28px] p-6 text-white shadow-xl sm:p-8 lg:p-10">
        <div className="lab-hero-grid pointer-events-none absolute inset-0 -z-10" />
        <div className="lab-hero-orbit pointer-events-none absolute -right-16 -top-28 -z-10 h-80 w-80 rounded-full border border-white/10 sm:right-8 sm:top-1/2 sm:-translate-y-1/2" />
        <div className="lab-hero-orbit lab-hero-orbit-inner pointer-events-none absolute right-0 top-1/2 -z-10 h-52 w-52 -translate-y-1/2 rounded-full border border-white/10" />
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-100">
              <Icon name="flask" size={15} />
              Laboratory operations
            </p>
            <h1 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[42px]">
              Every result, handled with care.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50/85 sm:text-base">
              Your secure workspace for requests, reports, and the people who rely on them.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-emerald-50/80">
              <Icon name="clock" size={15} />
              {now
                ? `${now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} · ${now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`
                : "Your lab workspace"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:min-w-52 lg:flex-col">
            <Link
              href={hasPending ? "/lab/requests" : "/lab/log"}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0c5f58] shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Icon name={hasPending ? "clipboard-list" : "scroll-text"} size={17} />
              {hasPending ? `Review ${dashboard.pending} request${dashboard.pending === 1 ? "" : "s"}` : "Review access history"}
            </Link>
            <Link
              href="/lab/reports"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Icon name="files" size={17} />
              Open report library
            </Link>
          </div>
        </div>
      </section>

      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
          <span>{error} Showing the last loaded overview.</span>
          <button type="button" onClick={refreshDashboard} className="font-semibold underline underline-offset-2" disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      )}

      <section aria-label="Laboratory statistics" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((metric, index) => (
          <Link
            key={metric.key}
            href={metric.href}
            className="lab-metric glass fade-up group p-4 transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:p-5"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-[var(--muted)] sm:text-sm">{metric.label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-[34px]">
                  <CountUp to={dashboard[metric.key]} />
                </p>
              </div>
              <span className="lab-metric-icon inline-flex rounded-xl p-2.5 text-[var(--accent)] transition group-hover:scale-105">
                <Icon name={metric.icon} size={20} />
              </span>
            </div>
            <p className="mt-3 text-xs text-[var(--muted)]">{metric.detail}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        <article className="glass fade-up p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                <Icon name="activity" size={15} />
                Activity
              </p>
              <h2 className="mt-1 text-lg font-semibold text-[var(--ink)]">Reports uploaded</h2>
            </div>
            <div className="rounded-xl bg-[var(--lab-soft)] px-3 py-2 text-right">
              <p className="text-xl font-semibold leading-none text-[var(--accent)]">{weeklyTotal}</p>
              <p className="mt-1 text-[11px] font-medium text-[var(--muted)]">this week</p>
            </div>
          </div>
          <div className="mt-5 grid h-44 grid-cols-7 gap-2 sm:gap-3" role="img" aria-label={`Reports uploaded over the last seven days: ${dashboard.week.map((value, index) => `${dashboard.days[index]} ${value}`).join(", ")}`}>
            {dashboard.week.map((value, index) => (
              <div key={`${dashboard.days[index]}-${index}`} className="flex min-w-0 flex-col items-center justify-end gap-2">
                <span className="text-xs font-semibold text-[var(--ink)]">{value || ""}</span>
                <div className="flex min-h-0 w-full flex-1 items-end overflow-hidden rounded-lg bg-[var(--lab-soft)]">
                  <i
                    className={`lab-chart-bar block w-full rounded-lg ${value > 0 ? "lab-chart-bar-active" : ""}`}
                    style={{
                      height: `${value ? Math.max((value / max) * 100, 8) : 4}%`,
                      animationDelay: `${index * 0.07}s`,
                    }}
                  />
                </div>
                <span className="text-[11px] font-medium text-[var(--muted)]">{dashboard.days[index]}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="glass fade-up flex flex-col p-5 sm:p-6" style={{ animationDelay: "0.12s" }}>
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            <Icon name="shield-check" size={15} />
            Privacy & security
          </p>
          <h2 className="mt-1 text-lg font-semibold text-[var(--ink)]">Protected at every step</h2>
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-[var(--lab-soft)] p-4">
            <span className="inline-flex rounded-lg bg-white p-2 text-[var(--accent)] shadow-sm">
              <Icon name="lock" size={19} />
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--ink)]">Encrypted report storage</p>
              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                Uploaded reports are protected, and access is recorded for review.
              </p>
            </div>
          </div>
          <Link
            href="/lab/log"
            className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-[var(--accent)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <Icon name="scroll-text" size={16} />
            Review access history
            <span aria-hidden="true">→</span>
          </Link>
        </article>
      </section>

      <section aria-labelledby="lab-workspaces-heading">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              <Icon name="flask" size={15} />
              Your workspace
            </p>
            <h2 id="lab-workspaces-heading" className="mt-1 text-lg font-semibold text-[var(--ink)]">Lab tools</h2>
          </div>
          <p className="text-xs text-[var(--muted)]">Everything you need, in one place</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {workspaces.map((workspace, index) => (
            <Link
              key={workspace.href}
              href={workspace.href}
              className="lab-workspace glass fade-up group flex items-center gap-3 p-4 transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              style={{ animationDelay: `${index * 0.07}s` }}
            >
              <span className={`lab-workspace-icon lab-workspace-${workspace.tone} inline-flex shrink-0 rounded-xl p-3`}>
                <Icon name={workspace.icon} size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[var(--ink)]">{workspace.label}</span>
                <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">{workspace.detail}</span>
              </span>
              <span className="text-lg text-[var(--muted)] transition group-hover:translate-x-1 group-hover:text-[var(--accent)]" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
