import "./globals.css";

export const metadata = {
  title: "Al Shifa Hospital",
  description: "Centralized Health Database System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* moving background colors, shared by every page */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <i className="orb w-[380px] h-[380px] -left-20 -top-16" />
          <i className="orb w-[320px] h-[320px] -right-16 top-1/3 opacity-30" style={{ animationDelay: "-5s" }} />
          <i className="orb w-[300px] h-[300px] left-1/3 -bottom-28" style={{ animationDelay: "-9s" }} />
        </div>
        {children}
      </body>
    </html>
  );
}
