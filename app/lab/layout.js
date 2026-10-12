import PortalShell from "@/components/PortalShell";

const NAV = [
  { href: "/lab", label: "Dashboard" },
  { href: "/lab/requests", label: "Requests" },
  { href: "/lab/upload", label: "Upload report" },
  { href: "/lab/reports", label: "Reports" },
  { href: "/lab/log", label: "Access log" },
];

// Every page inside /lab is wrapped here, so only LAB users can open them
export default function LabLayout({ children }) {
  return (
    <PortalShell allow={["LAB"]} chip="Lab Portal" nav={NAV}>
      {children}
    </PortalShell>
  );
}
