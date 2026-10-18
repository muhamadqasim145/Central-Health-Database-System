import PortalShell from "@/components/PortalShell";

const NAV = [
  { href: "/lab", label: "Dashboard", icon: "activity" },
  { href: "/lab/requests", label: "Requests", icon: "clipboard-list" },
  { href: "/lab/upload", label: "Upload report", icon: "file-up" },
  { href: "/lab/reports", label: "Reports", icon: "files" },
  { href: "/lab/log", label: "Access log", icon: "scroll-text" },
];

// Every page inside /lab is wrapped here, so only LAB users can open them
export default function LabLayout({ children }) {
  return (
    <PortalShell allow={["LAB"]} chip="Lab Portal" icon="flask" nav={NAV} wide brand>
      {children}
    </PortalShell>
  );
}
