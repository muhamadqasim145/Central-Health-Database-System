"use client";
import { useEffect, useState } from "react";

// Counts from 0 up to the number, for the dashboard cards
export default function CountUp({ to }) {
  const [n, setN] = useState(0);
  const target = Number(to) || 0;
  useEffect(() => {
    if (target <= 0) return;
    let k = 0;
    const t = setInterval(() => {
      k = Math.min(target, k + Math.max(1, Math.ceil(target / 25)));
      setN(k);
      if (k >= target) clearInterval(t);
    }, 35);
    return () => clearInterval(t);
  }, [target]);
  return <>{target > 0 ? n : 0}</>;
}
