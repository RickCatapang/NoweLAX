"use client";

import * as React from "react";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardPaste,
  FileJson,
  RotateCcw,
  Upload,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

import { MultipleChoicePreview } from "@/components/questions/multiple-choice/multiple-choice-preview";
import { PromptGuideDialog } from "@/components/question-import/multiple-choice/prompt-guide-dialog";

import {
  multipleChoiceImportSchema,
  type MultipleChoiceImport,
} from "@/src/lib/validations/question-import";

import { extractJsonFromText } from "@/src/lib/question-import/multiple-choice-parser";
import { ImportContextDialog } from "@/components/quick-import/multiple-choice/import-context-dialog";
import { ImportResultDialog } from "@/components/questions/multiple-choice/import-result-dialog";

type ValidationResult =
  | {
      success: true;
      data: MultipleChoiceImport;
    }
  | {
      success: false;
      errors: string[];
    };

const SAMPLE_JSON = `{
  "questions": [
    {
      "question": "What is the capital of France?",
      "choices": [
        {
          "label": "A",
          "content": "London",
          "isCorrect": false
        },
        {
          "label": "B",
          "content": "Paris",
          "isCorrect": true
        },
        {
          "label": "C",
          "content": "Madrid",
          "isCorrect": false
        },
        {
          "label": "D",
          "content": "Rome",
          "isCorrect": false
        }
      ],
      "explanation": "Paris is the capital city of France.",
      "hint": "Think about the city associated with the Eiffel Tower."
    }
  ]
}`;

export default function MultipleChoiceImportPage() {
  const router = useRouter();
  const [jsonText, setJsonText] = React.useState("");
  const [validation, setValidation] = React.useState<ValidationResult | null>(
    null,
  );
  const [currentQuestion, setCurrentQuestion] = React.useState(0);

  // State for import result
  const [importResult, setImportResult] = React.useState<{
    total: number;
    imported: number;
    failed: number;
    status: string;
    importBatchId: string;
    failedItems?: Array<{ row: number; error: string }>;
  } | null>(null);

  const [showResultDialog, setShowResultDialog] = React.useState(false);

  function validateJson() {
    setValidation(null);
    setCurrentQuestion(0);
    setImportResult(null);
    setShowResultDialog(false);

    const extraction = extractJsonFromText(jsonText);

    if (!extraction.success) {
      setValidation({
        success: false,
        errors: [extraction.message],
      });

      return;
    }

    const result = multipleChoiceImportSchema.safeParse(extraction.value);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => {
        const questionIndex =
          typeof issue.path[1] === "number" ? issue.path[1] : null;

        const location =
          questionIndex !== null ? `Question ${questionIndex + 1}` : "Import";

        return `${location}: ${issue.message}`;
      });

      setValidation({
        success: false,
        errors,
      });

      return;
    }

    if (extraction.rawJson !== jsonText.trim()) {
      setJsonText(extraction.rawJson);
    }

    setValidation({
      success: true,
      data: result.data,
    });
  }

  function loadExample() {
    setJsonText(SAMPLE_JSON);
    setValidation(null);
    setCurrentQuestion(0);
    setImportResult(null);
    setShowResultDialog(false);
  }

  function clearImport() {
    setJsonText("");
    setValidation(null);
    setCurrentQuestion(0);
    setImportResult(null);
    setShowResultDialog(false);
  }

  function goPrevious() {
    setCurrentQuestion((current) => Math.max(0, current - 1));
  }

  function goNext() {
    if (validation?.success) {
      setCurrentQuestion((current) =>
        Math.min(validation.data.questions.length - 1, current + 1),
      );
    }
  }

  function goToQuestion(index: number) {
    setCurrentQuestion(index);
  }

  function handleImportSuccess(result: {
    categoryId: string;
    subjectId: string;
    categorySubjectId: string;
    importStats: {
      total: number;
      imported: number;
      failed: number;
      status: string;
      importBatchId: string;
      failedItems?: Array<{ row: number; error: string }>;
    };
  }) {
    // Show the import result
    setImportResult(result.importStats);
    setShowResultDialog(true);

    // Reset the validation and form state
    setValidation(null);
    setJsonText("");
    setCurrentQuestion(0);
  }

  function handleCloseResult() {
    setShowResultDialog(false);
    setImportResult(null);
  }

  function handleViewQuestions() {
    setShowResultDialog(false);
    setImportResult(null);
    router.push("/questions");
  }

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-full min-h-0 flex-col gap-3">
          {/* ================================================== */}
          {/* PAGE HEADER */}
          {/* ================================================== */}

          <Card className="flex shrink-0 flex-col gap-3 bg-primary/30 px-4 py-3 shadow-lg sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/30">
                <FileJson className="size-4 text-muted-foreground" />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-sm font-semibold tracking-tight">
                  Import Multiple Choice
                </h1>

                <p className="truncate text-xs text-muted-foreground">
                  Validate questions before adding them to your question bank.
                </p>
              </div>
            </div>

            <PromptGuideDialog />
          </Card>

          {/* ================================================== */}
          {/* IMPORT INPUT */}
          {/* ================================================== */}

          {!validation?.success && !importResult && (
            <Card className="shrink-0 overflow-hidden py-0">
              <div className="flex flex-col gap-2 border-b bg-accent/80 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/30">
                    <ClipboardPaste className="size-4 text-muted-foreground" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold tracking-tight">
                      JSON Text Area Input
                    </h2>

                    <p className="text-xs text-muted-foreground">
                      Paste your generated questions below. Markdown code fences
                      and surrounding AI text are automatically handled.
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={loadExample}
                  className="shrink-0 gap-2"
                >
                  <ClipboardPaste className="size-3.5" />
                  Load Example
                </Button>
              </div>

              <div className="p-4">
                <Textarea
                  value={jsonText}
                  onChange={(event) => {
                    setJsonText(event.target.value);
                    setValidation(null);
                    setImportResult(null);
                  }}
                  placeholder={`Paste your AI-generated response here...

NoweLAX can handle:

1. Plain JSON
2. \`\`\`json fenced responses
3. Responses with text around the JSON

Example:

{
  "questions": [
    {
      "question": "What is 2 + 2?",
      "choices": [...]
    }
  ]
}`}
                  className="min-h-44 max-h-44 resize-y border-4 border-accent font-mono text-xs leading-5 placeholder:text-xs"
                  spellCheck={false}
                />
              </div>

              <div className="flex items-center justify-between border-t bg-muted/10 px-4 py-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearImport}
                  disabled={!jsonText}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="size-3.5" />
                  Clear
                </Button>

                <Button type="button" size="sm" onClick={validateJson}>
                  Validate Questions
                </Button>
              </div>
            </Card>
          )}

          {/* ================================================== */}
          {/* VALIDATION ERROR */}
          {/* ================================================== */}

          {validation && !validation.success && (
            <Card className="shrink-0 border-destructive/30 bg-destructive/5">
              <div className="flex items-start gap-3 p-4">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />

                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-destructive">
                    We found some problems
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Fix the generated JSON and validate it again.
                  </p>

                  <ul className="mt-2 space-y-1.5 text-sm">
                    {validation.errors.map((error, index) => (
                      <li key={`${error}-${index}`} className="flex gap-2">
                        <span className="text-destructive">•</span>
                        <span className="text-foreground/90">{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {/* ================================================== */}
          {/* VALIDATED PREVIEW */}
          {/* ================================================== */}

          {validation?.success && !importResult && (
            <div className="flex min-h-0 flex-1 flex-col gap-3">
              {/* Summary */}

              <Card className="flex shrink-0 flex-col gap-3 bg-accent/30 px-4 py-3 shadow-lg sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/30">
                    <CheckCircle2 className="size-4 text-muted-foreground" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h1 className="truncate text-sm font-semibold tracking-tight">
                        Validation successful
                      </h1>

                      <Badge
                        variant="secondary"
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-medium"
                      >
                        {validation.data.questions.length} questions
                      </Badge>
                    </div>

                    <p className="truncate text-xs text-muted-foreground">
                      Review each question before importing it into your
                      question bank.
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearImport}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X />
                  Start Over
                </Button>
              </Card>

              {/* Preview */}

              <div className="flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 pr-1">
                  <MultipleChoicePreview
                    question={validation.data.questions[currentQuestion]}
                    questionNumber={currentQuestion + 1}
                    totalQuestions={validation.data.questions.length}
                    onPrevious={goPrevious}
                    onNext={goNext}
                    onJump={goToQuestion}
                    actions={
                      <ImportContextDialog
                        questions={validation.data.questions}
                        onSuccess={handleImportSuccess}
                      />
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================== */}
          {/* IMPORT RESULT DIALOG */}
          {/* ================================================== */}

          {importResult && (
            <ImportResultDialog
              result={importResult}
              open={showResultDialog}
              onClose={handleCloseResult}
              onViewQuestions={handleViewQuestions}
            />
          )}
        </div>
      </div>
    </div>
  );
}
