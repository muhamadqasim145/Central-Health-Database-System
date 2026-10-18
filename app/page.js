"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "@/services/authService";
import { saveSession } from "@/lib/session";
import { hasValidationErrors, validateLogin, validateRegistration } from "@/lib/authValidation";
import Icon from "@/components/Icon";

const HOME = { LAB: "/lab", DOCTOR: "/doctor", PATIENT: "/patient" };
const EMPTY_FORM = { name: "", role: "DOCTOR", username: "", password: "", confirmPassword: "" };
const EMPTY_ERRORS = {
  name: "",
  role: "",
  username: "",
  password: "",
  confirmPassword: "",
};
const INPUT_CLASS =
  "mt-1 w-full rounded-xl border-[1.5px] border-[var(--line)] bg-white px-3.5 py-3 text-base text-[var(--ink)] outline-none focus:border-[var(--accent)]";

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState(EMPTY_ERRORS);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    document.body.dataset.role = "";
  }, []);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({
      ...current,
      [field]: "",
      ...(field === "password" ? { confirmPassword: "" } : {}),
    }));
    setError("");
    setSuccess("");
  }

  function validateForm() {
    return mode === "signup" ? validateRegistration(form) : validateLogin(form);
  }

  function validateField(field) {
    setFieldErrors((current) => ({ ...current, [field]: validateForm()[field] || "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const errors = validateForm();
    setFieldErrors({ ...EMPTY_ERRORS, ...errors });
    if (hasValidationErrors(errors)) return;

    const signingUp = mode === "signup";
    setBusy(true);
    try {
      if (signingUp) {
        await register(
          form.name.trim(),
          form.role,
          form.username.trim(),
          form.password,
          form.confirmPassword
        );
        setForm((current) => ({
          ...EMPTY_FORM,
          role: current.role,
          username: current.username.trim(),
        }));
        setFieldErrors(EMPTY_ERRORS);
        setShowPassword(false);
        setShowConfirmPassword(false);
        setMode("signin");
        setSuccess("Registration successful. Sign in with your new account.");
        setBusy(false);
        return;
      }

      const session = await login(form.username.trim(), form.password);
      const role = String(session?.role ?? "").toUpperCase();

      if (!HOME[role]) {
        throw new Error("Unsupported user role returned by the server.");
      }

      const safeSession = { ...session, role };
      saveSession(safeSession);
      document.body.dataset.role = role;
      router.replace(HOME[role]);
    } catch (submitError) {
      const apiErrors = submitError?.response?.data?.errors || submitError?.fieldErrors;
      if (apiErrors && typeof apiErrors === "object") {
        setFieldErrors((current) => ({ ...current, ...apiErrors }));
      }
      setError(submitError?.response?.data?.message || submitError?.message || "Authentication failed.");
      setBusy(false);
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setFieldErrors(EMPTY_ERRORS);
    setError("");
    setSuccess("");
  }

  return (
    <main className="relative z-10 grid min-h-screen place-items-center p-6">
      <section className="glass fade-up w-full max-w-[420px] rounded-3xl p-6 shadow-2xl">
        <svg viewBox="0 0 300 44" preserveAspectRatio="none" className="h-11 w-full" aria-hidden="true">
          <path
            pathLength="1"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            opacity=".15"
            d="M0 24H70L82 24L92 6L104 40L114 14L122 24H300"
          />
          <path
            pathLength="1"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ecg-run"
            d="M0 24H70L82 24L92 6L104 40L114 14L122 24H300"
          />
        </svg>
        <h1 className="mt-1 flex items-center gap-2 text-[26px] font-semibold tracking-tight">
          <Icon name="hospital" size={26} className="text-[var(--accent)]" />
          Al Shifa Hospital
        </h1>
        <p className="mb-4 text-sm text-[var(--muted)]">
          {mode === "signup"
            ? "Create your doctor or laboratory staff account."
            : "Sign in to your hospital staff account."}
        </p>

        <div className="mb-4 flex rounded-xl bg-white/70 p-1 text-sm font-semibold" aria-label="Account options">
          <button
            type="button"
            onClick={() => switchMode("signup")}
            disabled={busy}
            aria-pressed={mode === "signup"}
            className={`flex-1 rounded-lg px-3 py-2 ${mode === "signup" ? "bg-[var(--accent)] text-white" : "text-[var(--muted)]"}`}
          >
            <span className="inline-flex items-center justify-center gap-1.5">
              <Icon name="user-round" size={16} />
              Sign up
            </span>
          </button>
          <button
            type="button"
            onClick={() => switchMode("signin")}
            disabled={busy}
            aria-pressed={mode === "signin"}
            className={`flex-1 rounded-lg px-3 py-2 ${mode === "signin" ? "bg-[var(--accent)] text-white" : "text-[var(--muted)]"}`}
          >
            <span className="inline-flex items-center justify-center gap-1.5">
              <Icon name="lock" size={16} />
              Sign in
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {mode === "signup" && (
            <label htmlFor="name" className="mb-3 block text-xs font-semibold text-[var(--muted)]">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="user-round" size={14} />
                Full name
              </span>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                onBlur={() => validateField("name")}
                autoComplete="name"
                autoCapitalize="words"
                maxLength={80}
                required
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
                className={INPUT_CLASS}
              />
              {fieldErrors.name && <span id="name-error" className="mt-1 block text-red-700">{fieldErrors.name}</span>}
            </label>
          )}

          {mode === "signup" && (
            <label htmlFor="role" className="mb-3 block text-xs font-semibold text-[var(--muted)]">
              Staff role
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={(event) => updateField("role", event.target.value)}
                onBlur={() => validateField("role")}
                required
                aria-invalid={Boolean(fieldErrors.role)}
                aria-describedby={fieldErrors.role ? "role-error" : undefined}
                className={INPUT_CLASS}
              >
                <option value="DOCTOR">Doctor</option>
                <option value="LAB">Laboratory staff</option>
              </select>
              {fieldErrors.role && <span id="role-error" className="mt-1 block text-red-700">{fieldErrors.role}</span>}
            </label>
          )}

          <label htmlFor="username" className="mb-3 block text-xs font-semibold text-[var(--muted)]">
            Username
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={(event) => updateField("username", event.target.value)}
              onBlur={() => validateField("username")}
              autoComplete="username"
              autoCapitalize="none"
              minLength={3}
              maxLength={30}
              pattern={"[A-Za-z0-9][A-Za-z0-9._\\x2d]{2,29}"}
              required
              aria-invalid={Boolean(fieldErrors.username)}
              aria-describedby={fieldErrors.username ? "username-error" : undefined}
              className={INPUT_CLASS}
            />
            {fieldErrors.username && <span id="username-error" className="mt-1 block text-red-700">{fieldErrors.username}</span>}
          </label>

          <div className="mb-3 text-xs font-semibold text-[var(--muted)]">
            <label htmlFor="password">Password</label>
            <div className="relative mt-1">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                onBlur={() => validateField("password")}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                minLength={mode === "signup" ? 8 : undefined}
                maxLength={72}
                required
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? "password-error" : undefined}
                className={`${INPUT_CLASS} mt-0 pr-16`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded px-1 py-1 text-xs font-semibold text-[var(--accent)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {fieldErrors.password && <span id="password-error" className="mt-1 block text-red-700">{fieldErrors.password}</span>}
          </div>

          {mode === "signup" && (
            <div className="mb-3 text-xs font-semibold text-[var(--muted)]">
              <label htmlFor="confirmPassword">Confirm password</label>
              <div className="relative mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(event) => updateField("confirmPassword", event.target.value)}
                  onBlur={() => validateField("confirmPassword")}
                  autoComplete="new-password"
                  maxLength={72}
                  required
                  aria-invalid={Boolean(fieldErrors.confirmPassword)}
                  aria-describedby={fieldErrors.confirmPassword ? "confirm-password-error" : undefined}
                  className={`${INPUT_CLASS} mt-0 pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                  aria-pressed={showConfirmPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded px-1 py-1 text-xs font-semibold text-[var(--accent)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <span id="confirm-password-error" className="mt-1 block text-red-700">
                  {fieldErrors.confirmPassword}
                </span>
              )}
            </div>
          )}

          {success && (
            <p role="status" className="mb-2 text-[13px] text-green-800">
              {success}
            </p>
          )}
          <p role="alert" className="mb-2 min-h-[18px] text-[13px] text-red-700">{error}</p>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-2xl bg-[var(--accent)] py-3.5 text-base font-bold text-white shadow-lg transition hover:-translate-y-0.5 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-80"
          >
            {busy ? <><i className="spinner" /> {mode === "signup" ? "Creating your account" : "Checking with server"}</> :
              mode === "signup" ? "Create staff account" : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-[var(--muted)]">
          Want to preview the interface?{" "}
          <Link href="/AlShifa_Hospital_Interface.html" className="font-semibold text-[var(--accent)] underline">
            Open demo
          </Link>
        </p>
      </section>
    </main>
  );
}
