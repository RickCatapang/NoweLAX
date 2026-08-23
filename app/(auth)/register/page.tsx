import { Card } from "@/components/ui/card";
import { RegisterForm } from "./_components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex-center h-svh flex-3 px-2 py-6 md:px-6">
      <div className="flex-center w-sm px-2 md:pt-20">
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
