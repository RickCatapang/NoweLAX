import { Card } from "@/components/ui/card";
import { RegisterForm } from "./_components/RegisterForm";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
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

          <RegisterForm />
        </Card>
      </div>
    </div>
  );
}
