import { Card } from "@/components/ui/card";
import { LoginForm } from "./_components/LoginForm";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="flex-center h-svh flex-3 px-2 py-6 md:px-6">
      <div className="flex-center w-sm px-2">
        <Card className="w-full">
          {/* <div className="flex w-full justify-end">
            <BackButton />
            </div> */}

          <LoginForm />
        </Card>
      </div>
    </div>
  );
}
