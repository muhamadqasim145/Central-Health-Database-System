"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRequests, uploadReport } from "@/services/labService";
import { scramble } from "@/lib/scramble";
import { getSession } from "@/lib/session";

export default function UploadPage() {
  const router = useRouter();
  const [requests, setRequests] = useState(null);
  const [reqId, setReqId] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [enc, setEnc] = useState("File is encrypted on the server before saving");

  useEffect(() => {
    getRequests().then((list) => {
      setRequests(list);
      // "Upload report" on the requests page sends ?request=ID
      const q = new URLSearchParams(window.location.search).get("request");
      setReqId(q && list.some((r) => String(r.id) === q) ? q : list[0] ? String(list[0].id) : "");
    });
  }, []);

  function pick(e) {
    const f = e.target.files[0];
    setError("");
    setPreview("");
    setFile(null);
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setError("File is larger than 5 MB");
      e.target.value = "";
      return;
    }
    setFile(f);
    if (f.type.startsWith("image/")) setPreview(URL.createObjectURL(f));
  }

  async function submit() {
    if (!file) {
      setError("Please choose the report photo or PDF");
      return;
    }
    setError("");
    setBusy(true);
    const t = setInterval(() => setEnc("ENC:" + scramble(40)), 90); // visual effect only
    try {
      await uploadReport(reqId, file, note, setProgress);
      const message = getSession()?.demo
        ? "Demo report created with fictional data. No file was uploaded to the server."
        : "Report encrypted and uploaded. The doctor and patient can now open it.";
      sessionStorage.setItem("flash", message);
      router.push("/lab/reports");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
      setBusy(false);
    } finally {
      clearInterval(t);
    }
  }

  if (!requests) return <p className="text-[var(--muted)]">Loading...</p>;
  if (requests.length === 0) return <div className="glass p-5">No pending requests.</div>;

  const input =
    "mt-1 w-full rounded-xl border-[1.5px] border-[var(--line)] bg-white px-3.5 py-3 text-base text-[var(--ink)] outline-none focus:border-[var(--accent)]";

  return (
    <div className="glass fade-up p-5">
      <label className="mb-3 block text-xs font-semibold text-[var(--muted)]">
        Test request
        <select value={reqId} onChange={(e) => setReqId(e.target.value)} className={input}>
          {requests.map((r) => (
            <option key={r.id} value={r.id}>
              {r.patientName} · {r.testName}
            </option>
          ))}
        </select>
      </label>

      <label className="mb-1 block text-xs font-semibold text-[var(--muted)]">
        Lab report (photo or PDF)
        <input type="file" accept="image/*,.pdf" onChange={pick} className={input} />
      </label>
      <p className="mb-2 text-[13px] text-[var(--muted)]">
        On a phone you can take a photo of the printed report. Maximum 5 MB.
      </p>
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Preview" className="mb-3 max-h-72 max-w-full rounded-xl border border-[var(--line)]" />
      )}
      {file && !preview && <p className="mb-3 text-[13px] text-[var(--muted)]">Selected file: {file.name}</p>}

      <label className="mb-3 block text-xs font-semibold text-[var(--muted)]">
        Result summary (optional)
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Hemoglobin 13.2 g/dL"
          className={`${input} h-20 resize-y`}
        />
      </label>

      <div className="mb-3 rounded-xl bg-[#0f1f33] px-3 py-2.5 text-xs text-[#9ff0d4]">
        <b className="mb-1 block text-[11px] uppercase tracking-wider text-white/85">Encryption</b>
        <code className="break-all font-mono">{enc}</code>
      </div>
      <div className="mb-3 h-2 overflow-hidden rounded-md bg-[#e3e8ee]">
        <i className="block h-full bg-[var(--accent)] transition-all" style={{ width: `${progress}%` }} />
      </div>

      <p className="mb-2 min-h-[18px] text-[13px] text-red-700">{error}</p>
      <button
        onClick={submit}
        disabled={busy}
        className="w-full rounded-2xl bg-[var(--accent)] py-3.5 text-base font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-70"
      >
        {busy ? (
          <>
            <i className="spinner" /> Encrypting and uploading
          </>
        ) : (
          "Encrypt and upload"
        )}
      </button>
    </div>
  );
}
