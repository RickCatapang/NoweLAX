import RootNavbar from "@/components/root-components/public-navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RootNavbar />

      <main className="min-h-screen">{children}</main>
    </>
  );
}
