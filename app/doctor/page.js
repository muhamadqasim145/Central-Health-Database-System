"use client";
import { useEffect, useState } from "react";
import PortalShell from "@/components/PortalShell";
import ReportList from "@/components/ReportList";
import Icon from "@/components/Icon";
import { createLabRequest, getPatients } from "@/services/doctorService";

export default function DoctorPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [testName, setTestName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getPatients()
      .then(setPatients)
      .catch((loadError) => setError(loadError.response?.data?.message || "Could not load patients."));
  }, []);

  async function requestTest(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await createLabRequest(Number(selectedPatient), testName);
      setTestName("");
      setMessage("Test request sent to the laboratory.");
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Could not send the test request.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PortalShell allow={["DOCTOR"]} chip="Doctor Portal" icon="stethoscope">
      <div className="glass fade-up p-5">
        <h3 className="flex items-center gap-2 text-xl font-semibold">
          <Icon name="stethoscope" size={21} className="text-[var(--accent)]" />
          Doctor workspace
        </h3>
        <p className="mt-1 text-[var(--muted)]">
          Review patient requests and read available laboratory reports.
        </p>
      </div>
      <section className="glass fade-up mt-4 p-5">
        <form onSubmit={requestTest} className="space-y-3">
          <h3 className="text-lg font-semibold">Create a lab test request</h3>
          <label className="block text-sm font-medium" htmlFor="request-patient">Patient</label>
          <select
            id="request-patient"
            value={selectedPatient}
            onChange={(event) => setSelectedPatient(event.target.value)}
            required
            className="w-full rounded-xl border-[1.5px] border-[var(--line)] bg-white px-3.5 py-3 text-base outline-none focus:border-[var(--accent)]"
          >
            <option value="">Select a patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>{patient.name}</option>
            ))}
          </select>
          <label className="block text-sm font-medium" htmlFor="test-name">Test name</label>
          <input
            id="test-name"
            value={testName}
            onChange={(event) => setTestName(event.target.value)}
            maxLength={100}
            required
            className="w-full rounded-xl border-[1.5px] border-[var(--line)] bg-white px-3.5 py-3 text-base outline-none focus:border-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={busy || patients.length === 0}
            className="rounded-xl bg-[var(--accent)] px-4 py-2.5 font-semibold text-white disabled:opacity-60"
          >
            Send to laboratory
          </button>
        </form>
        {(error || message) && (
          <p className={`text-sm ${error ? "text-red-700" : "text-green-800"}`} role="status">
            {error || message}
          </p>
        )}
      </section>
      <p className="mb-2 mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
        <Icon name="files" size={16} />
        Available lab reports
      </p>
      <ReportList />
    </PortalShell>
  );
}
