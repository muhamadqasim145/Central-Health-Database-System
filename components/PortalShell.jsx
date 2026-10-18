"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSession, clearSession } from "@/lib/session";
import Icon from "@/components/Icon";

// Wraps a portal page: checks the role, shows the welcome header, navigation and log out.
// allow = roles that may open this portal, e.g. ["LAB"]
export default function PortalShell({ allow, chip, icon, nav = [], wide = false, brand = false, children }) {
  const router = useRouter();
  const path = usePathname();
  const [session, setSession] = useState(null);
  const allowedRoles = allow.join("|");

  useEffect(() => {
    const s = getSession();
    if (!s || !allowedRoles.split("|").includes(s.role)) {
      router.replace("/"); // wrong role or not logged in
      return;
    }
    document.body.dataset.role = s.role;
    const timer = setTimeout(() => setSession(s), 0);
    return () => clearTimeout(timer);
  }, [allowedRoles, router]);

  function logout() {
    clearSession();
    document.body.dataset.role = "";
    router.push("/");
  }

  if (!session) return null;

  return (
    <div className="relative z-10 mx-auto max-w-3xl px-5 py-8 fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="inline-block rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-bold text-white">
            {chip}
          </span>
          <h2 className="mt-2 text-3xl font-semibold">Welcome, {session.name}</h2>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border-[1.5px] border-[var(--accent)] bg-white px-4 py-2 font-semibold text-[var(--accent)]"
        >
          Log out
        </button>
      </div>

      {nav.length > 0 && (
        <nav className="mt-5 flex flex-wrap gap-2">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-full border-[1.5px] px-4 py-2 text-sm font-semibold transition ${
                path === n.href
                  ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                  : "border-[var(--line)] bg-white text-[var(--muted)]"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}

      <div className="mt-5">{children}</div>
    </div>
  );
}
