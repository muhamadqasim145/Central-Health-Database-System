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

## 3. Database (you create this part)

`prisma/schema.prisma` shows the models the API expects. After your database exists:

```bash
npx prisma migrate dev --name init
```

Create test users with your own seed script. Passwords use `bcryptjs.hash(password, 10)` and
patient names use `encryptText(name)` from `lib/encryption.js`. Roles are `LAB`, `DOCTOR`, `PATIENT`.
A patient user needs `patientId` set to the matching Patient row.

## 4. Run

```bash
npm run dev      # http://localhost:3000
```

## Sign up and sign in

The home page opens on staff sign-up. Staff can select Doctor or Laboratory staff; registration
accepts only those two roles. Demo accounts are stored in this browser's local storage with salted,
PBKDF2-hashed passwords. After registration, users are returned to the sign-in form and must sign
in before opening the portal for their selected role.
This browser-only authentication is for fictional test data and is not suitable for real accounts
or patient information. Demo account data is separate per browser and can be removed by clearing
the site's local storage.

Sign-up validates full names (2–80 characters), usernames (3–30 letters, numbers, periods,
underscores, or hyphens), passwords (at least 8 characters and at most 72 UTF-8 bytes), and matching
password confirmation and role. Sign-in and both auth APIs validate input on the server as well.

## Interface demo

The sign-in page links to the existing interface demo, which uses fictional sample data without
requiring a database.
Demo uploads and report activity are stored in this browser only; they are not sent to the API.
Do not enter real patient information in demo mode.

The auth APIs remain available for database-backed authentication. To use them, configure
`.env.local` with a valid `DATABASE_URL`, make sure PostgreSQL is running, and run
`npx prisma migrate dev --name init`. Restart the development server after changing environment
variables.

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
