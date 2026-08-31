import type { Metadata } from "next";
import {
  Balsamiq_Sans,
  Geist,
  Geist_Mono,
  Inter,
  Poppins,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
// import RootNavbar from "@/components/root-components/root-navbars";

import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geistSans = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Balsamiq_Sans({
  variable: "--font-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "noweLAX | learn 'n chill 🔥",
  description:
    "dedicated review web app for my agriculturist, and for you I guess",
};

// export const viewport = {
//   width: "device-width",
//   initialScale: 1,
//   maximumScale: 1,
//   userScalable: "no", // (use with caution)
// };
// export const viewport = {
//   width: "device-width",
//   initialScale: 1,
//   minimumScale: 1,
//   maximumScale: 1,
//   userScalable: "no",
// };
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
        "custom-scrollbar",
      )}
    >
      <body className="antialiased">
        <QueryProvider>
          {" "}
          <div className="min-h-svh w-full bg-background relative">
            {/* Top Fade Grid Background */}
            <div
              className="fixed top-0 inset-0 -z-10 pointer-events-none"
              style={{
                backgroundImage: `
        linear-gradient(to right, oklch(from var(--primary) l c h / 0.2) 0.5px, transparent 0.5px),
        linear-gradient(to bottom, oklch(from var(--primary) l c h / 0.2) 0.5px, transparent 1px)
      `,
                backgroundSize: "2rem 1.5rem",
                WebkitMaskImage:
                  "radial-gradient(ellipse 70% 60% at 50% 0%, var(--muted) 100%, transparent 100%)",
                maskImage:
                  "radial-gradient(ellipse 70% 60% at 50% 0%, var(--accent) 60%, transparent 100%)",
                zIndex: 0,
              }}
            />
            <div
              className="absolute inset-0 z-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `radial-gradient(125% 125% at 50% 90%, var(--primary) 40%, var(--background) 100%)`,
                backgroundSize: "100% 100%",
              }}
            />
            {/* Your Content/Components*/}
            {/* <RootNavbar /> */}

            <div className="relative">{children}</div>
            <Toaster />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
