const ICONS = {
  activity: <><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></>,
  "clipboard-list": <><rect x="5" y="4" width="14" height="18" rx="2" /><path d="M9 4.5h6a1.5 1.5 0 0 0-1.5-1.5h-3A1.5 1.5 0 0 0 9 4.5ZM9 12h6M9 16h6" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
  "eye-off": <><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a14 14 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7a10 10 0 0 0 3.1-.5" /></>,
  "file-text": <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>,
  "file-up": <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M12 18v-6m-3 3 3-3 3 3" /></>,
  files: <><path d="M8 7V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2" /><rect x="3" y="7" width="14" height="14" rx="2" /><path d="M7 12h6M7 16h6" /></>,
  flask: <><path d="M9 3h6M10 3v7l-5.5 9.2A2 2 0 0 0 6.2 22h11.6a2 2 0 0 0 1.7-2.8L14 10V3M8 16h8" /></>,
  hospital: <><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 21v-4h6v4" /><path d="M10 7h4M12 5v4M9 12h.01M15 12h.01" /></>,
  lock: <><rect x="4" y="11" width="16" height="11" rx="2" /><path d="M8 11V7a4 4 0 1 1 8 0v4M12 15v3" /></>,
  "log-out": <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></>,
  "scroll-text": <><path d="M8 21h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8" /><path d="M4 5a2 2 0 0 1 2-2h2v18H6a2 2 0 0 1-2-2zM12 8h6M12 12h6M12 16h4" /></>,
  "shield-check": <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
  stethoscope: <><path d="M6 3v5a6 6 0 0 0 12 0V3M4 3h4M16 3h4M12 14v2a4 4 0 0 0 8 0v-1" /><circle cx="20" cy="13" r="1" /><circle cx="12" cy="20" r="2" /></>,
  upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></>,
  user: <><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="8" r="5" /></>,
  "user-round": <><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></>,
};

export default function Icon({ name, size = 18, className = "" }) {
  const icon = ICONS[name];
  if (!icon) {
    throw new Error(`Unknown icon: ${name}`);
  }

  return (
    <svg
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      {icon}
    </svg>
  );
}
