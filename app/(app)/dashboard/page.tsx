import Link from "next/link";
import {
  BookOpen,
  FileQuestion,
  GraduationCap,
  Plus,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <main className="w-full">
      {" "}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}{" "}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          {" "}
          <div>
            {" "}
            <p className="text-sm text-muted-foreground">Welcome back 👋 </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Your study space
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Build your question bank, create an assessment, and start testing
              yourself.
            </p>
          </div>
          <Button asChild>
            <Link href="/question-bank/import/multiple-choice">
              <Upload />
              Import Questions
            </Link>
          </Button>
        </section>
        {/* Main actions */}
        <section className="grid gap-4 md:grid-cols-2">
          <Card className="transition-colors hover:bg-muted/50">
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg border bg-background">
                <BookOpen className="size-5" />
              </div>

              <CardTitle>Question Bank</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Import, organize, and manage your questions.
              </p>

              <Button variant="secondary" asChild>
                <Link href="/question-bank/import/multiple-choice">
                  Open Question Bank
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="transition-colors hover:bg-muted/50">
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg border bg-background">
                <FileQuestion className="size-5" />
              </div>

              <CardTitle>Assessments</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Create dynamic assessments from your question bank.
              </p>

              <Button variant="secondary" asChild>
                <Link href="/assessments">View Assessments</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
        {/* Quick start */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Get started</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex gap-4">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full border font-semibold">
                    1
                  </div>

                  <div>
                    <h3 className="font-medium">Import questions</h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Add your questions to the question bank.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full border font-semibold">
                    2
                  </div>

                  <div>
                    <h3 className="font-medium">Create an assessment</h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Choose subjects and configure your dynamic rules.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full border font-semibold">
                    3
                  </div>

                  <div>
                    <h3 className="font-medium">Take the assessment</h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Test yourself using questions selected from your bank.
                    </p>
                  </div>
                </div>
              </div>

              <Button className="mt-6" asChild>
                <Link href="/question-bank/import/multiple-choice">
                  <Plus />
                  Add your first questions
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
