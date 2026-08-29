import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuroraText } from "@/components/ui/aurora-text";

export default function GetStartedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-24 pb-20">
      <div className="w-full max-w-sm text-center space-y-8">
        <div className="">
          <p className="text-sm font-medium text-muted-foreground text-shadow ">
            now • we • LAX
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Ready to <AuroraText>test</AuroraText> what you know?
          </h1>

          <p className="text-muted-foreground text-lg font-mono mt-2">
            or test yourself to know more?
          </p>
        </div>
        <div className="space-y-3">
          <Button asChild size="lg" className="w-full">
            <Link href="/login">Log in</Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/register">Create account</Link>
          </Button>
          <div className="cursor-not-allowed mt-6">
            <Button
              size="lg"
              variant="secondary"
              disabled
              className="w-full font-mono"
            >
              Continue as guest
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Guest mode will be available in a future release.
        </p>
      </div>
    </main>
  );
}
