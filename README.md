# CHDS Lab Portion (Next.js + Tailwind + Node.js API)

Frontend and backend are in ONE Next.js project. The API files in `app/api` run on Node.js.

## 1. Setup (first time)

```bash
npx create-next-app@latest chds-lab      # JavaScript, Tailwind yes, App Router yes, alias @/*
cd chds-lab
npm install axios bcryptjs jsonwebtoken @prisma/client
npm install -D prisma
```

Copy the folders from this zip into your project (`app`, `components`, `lib`, `services`, `prisma`),
and replace the files with the same names (`app/layout.js`, `app/globals.css`, `app/page.js`).

Tailwind note: new projects use Tailwind v4, so `globals.css` starts with `@import "tailwindcss";`.
If your project uses Tailwind v3, replace that line with the three `@tailwind` lines.

## 2. Environment

Copy `.env.example` to `.env` and fill the three values (never upload `.env` to GitHub).

## 3. PostgreSQL database

The app uses PostgreSQL through Prisma. Put `DATABASE_URL`, `ENCRYPTION_KEY`, and
`JWT_SECRET` in the ignored local `.env` file. The schema maps to the existing patient
module's `Patients` table; it does not create a duplicate patient table. The baseline
migration preserves the existing database, and the next migration adds only the lab
account, test request, report, and audit tables. For an existing deployment, inspect
the migration SQL and back up the database before applying migrations.

The lab module uses these tables from `prisma/schema.prisma`:

| Table | Purpose / owner |
|---|---|
| `Patients` | Existing patient-module table; lab requests, reports, and patient accounts reference its `patientID`. |
| `User` | Portal login accounts; patient accounts link to `Patients`, and lab report uploads link to the staff account. |
| `LabTestRequest` | Lab work queue, linked to `Patients` and optionally an existing `MedicalRecords` row. |
| `LabReport` | Encrypted report file and note, linked to its request, patient, and uploading account. |
| `AccessLog` | Records report views, downloads, and uploads for the lab audit page. |

The doctor workflow selects patients from the patient module and creates lab requests;
it does not create duplicate patient records. Lab staff upload reports for those requests.
The patient portal reads only reports associated with the `Patients` row linked to that
account. Patient accounts must be provisioned by a trusted administrator/seed process
and linked to the correct patient record; public sign-up cannot claim a patient's identity.
Passwords use `bcryptjs.hash(password, 10)`.

## 4. Run

```bash
npm run dev      # http://localhost:3000
```

## Sign up and sign in

The home page opens on staff sign-up. Staff can select Doctor or Laboratory staff; registration
accepts only those two roles and saves accounts in the configured PostgreSQL database. After
registration, users are returned to the sign-in form and must sign in before opening the portal
for their selected role. Sign-in validates credentials against the same database, and the returned
token is used for database-backed API requests.

Sign-up validates full names (2–80 characters), usernames (3–30 letters, numbers, periods,
underscores, or hyphens), passwords (at least 8 characters and at most 72 UTF-8 bytes), and matching
password confirmation and role. Sign-in and both auth APIs validate input on the server as well.

## Folder map

| Folder | What it holds |
|---|---|
| `app/page.js` | Doctor/laboratory staff sign-up and sign-in |
| `app/lab/*` | Lab portal: dashboard, requests, upload, reports, access log |
| `app/doctor`, `app/patient` | Doctor overview and reports, patient reports page |
| `app/api/*` | Node.js APIs (listed below) |
| `components/` | PortalShell (role check + header), ReportList, CountUp |
| `services/` | Every API call from the frontend, one file per area |
| `lib/` | encryption, auth, prisma, axios client |

## APIs

| API | Who | Purpose |
|---|---|---|
| POST `/api/auth/register` | authorized staff | Validate and create a doctor or lab account |
| POST `/api/auth/login` | everyone | Check login, return token and role |
| GET `/api/patients` | DOCTOR | List patient-module records available for lab requests |
| POST `/api/doctor/requests` | DOCTOR | Send a patient test request to the lab |
| GET `/api/lab/dashboard` | LAB | Counts and weekly numbers |
| GET `/api/lab/requests` | LAB | Pending test requests |
| POST `/api/lab/requests/:id/report` | LAB | Upload report file, encrypt, mark completed |
| GET `/api/reports` | LAB, DOCTOR, PATIENT | List reports (patient sees only own) |
| GET `/api/reports/:id?action=view\|download` | LAB, DOCTOR, PATIENT | Decrypt and return one report, write log |
| GET `/api/lab/access-log` | LAB | Latest 50 actions |

## Notes

- Encryption is AES-256-GCM (`lib/encryption.js`). The key stays in `.env`.
- With Prisma 6 a `Bytes` column returns a Uint8Array, so the code wraps it with `Buffer.from(...)`.
- In Next.js 15 `params` is a promise, so the routes use `await params` (also fine in Next.js 14).
- The login token is kept in localStorage to keep the project simple. A real system would use secure cookies.
- Large uploads: Next.js route handlers accept a 5 MB file here. If your host limits request size, check its limit.
