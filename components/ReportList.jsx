"use client";
import { useEffect, useState } from "react";
import { getReports, openReport } from "@/services/reportService";
import { scramble } from "@/lib/scramble";
import Icon from "@/components/Icon";

// Used by the lab "Reports" page and by the patient page.
// A report stays locked (encrypted text) until the user clicks View.
export default function ReportList() {
  const [list, setList] = useState(null);
  const [openId, setOpenId] = useState(0);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getReports()
      .then((l) => setList(l.map((r) => ({ ...r, cipher: scramble(44) }))))
      .catch(() => setError("Could not load the reports"));
  }, []);

  async function view(r) {
    if (openId === r.id) {
      setOpenId(0);
      setDetail(null);
      return;
    }
    setError("");
    setOpenId(r.id);
    setDetail(null);
    setLoading(true); // "Decrypting report..." while the backend decrypts
    try {
      setDetail(await openReport(r.id, "view"));
    } catch (err) {
      setError(err.response?.data?.message || "Could not open the report");
      setOpenId(0);
    } finally {
      setLoading(false);
    }
  }

  async function download(r) {
    try {
      const d = await openReport(r.id, "download");
      const a = document.createElement("a");
      a.href = d.data;
      a.download = d.fileName;
      a.click();
    } catch (err) {
      setError(err.response?.data?.message || "Could not download the report");
    }
  }

  if (!list && !error) return <p className="text-[var(--muted)]">Loading...</p>;

  return (
    <>
      {error && <p className="mb-3 text-sm text-red-700">{error}</p>}

      <div className="glass px-4 py-1">
        {list?.length === 0 && <p className="py-4 text-[var(--muted)]">No reports yet</p>}
        {list?.map((r, i) => (
          <div
            key={r.id}
            className="fade-up flex items-center justify-between gap-3 border-b border-[var(--line)] py-3.5 last:border-0"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="min-w-0 flex-1">
              <b className="inline-flex items-center gap-1.5">
                <Icon name="file-text" size={15} className="text-[var(--accent)]" />
                {r.testName}
              </b>
              <div className="my-1 inline-flex items-center gap-1.5 text-[13px] text-[var(--muted)]">
                <Icon name="clock" size={13} />
                {r.patientName} · {new Date(r.createdAt).toLocaleDateString()} · {r.fileName}
              </div>
              {(openId !== r.id || loading) && (
                <div className="break-all rounded-lg bg-[#0f1f33] px-2.5 py-2 font-mono text-xs text-[#9ff0d4]">
                  ENC:{r.cipher}
                </div>
              )}
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => view(r)}
                className="rounded-[10px] bg-[var(--accent)] px-3.5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                {openId === r.id ? "Close" : "View"}
              </button>
              <button
                onClick={() => download(r)}
                className="rounded-[10px] border-[1.5px] border-[var(--accent)] bg-white px-3.5 py-2 text-sm font-semibold text-[var(--accent)]"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {openId !== 0 && loading && (
        <div className="glass fade-up mt-4 p-5">
          <i className="spinner dark" /> Decrypting report...
        </div>
      )}

      {detail && (
        <div className="glass fade-up mt-4 p-5">
          <b>
            {detail.testName} · {detail.patientName}
          </b>
          <div className="mt-3">
            {detail.fileType.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={detail.data} alt="Lab report" className="max-w-full rounded-xl border border-[var(--line)]" />
            ) : (
              <>
                <iframe src={detail.data} className="h-[420px] w-full rounded-xl border border-[var(--line)]" />
                <p className="mt-1 text-[13px] text-[var(--muted)]">If the PDF does not show, use Download.</p>
              </>
            )}
          </div>
          {detail.note && (
            <div className="mt-3 rounded-xl bg-[#eafaf1] px-3 py-2.5 text-sm text-[#14532d]">{detail.note}</div>
          )}
        </div>
      )}
    </>
  );
}
