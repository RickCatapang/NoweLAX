import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/src/lib/auth";
import AppNavbar from "@/components/root-components/app-navbar";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/get-started");
  }

  return (
    <>
      <AppNavbar user={session.user} />
      <main className="pt-0 md:pt-24">{children}</main>
    </>
  );
}
