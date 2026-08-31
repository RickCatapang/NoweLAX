"use client";

import * as React from "react";
import {
  CheckCircle2,
  CircleHelp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import type {
  MultipleChoiceQuestion,
  MultipleChoiceChoice,
} from "@/src/lib/validations/question-import";

export interface MultipleChoicePreviewProps {
  question: MultipleChoiceQuestion;
  questionNumber: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onJump: (index: number) => void;
  actions?: React.ReactNode;
}

function ChoiceRow({ choice }: { choice: MultipleChoiceChoice }) {
  const isCorrect = choice.isCorrect;

  return (
    <div
      className={cn(
        "relative flex min-w-0 items-start gap-3 rounded-lg border px-3 py-2.5 text-xs transition-colors",
        "border-border bg-background",
        isCorrect && "border bg-primary dark:bg-primary/10 shadow-sm",
      )}
    >
      <div
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-md border text-xs font-medium",
          "border-border bg-muted/40 text-muted-foreground",
        )}
      >
        {choice.label}
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="leading-relaxed text-foreground">{choice.content}</p>
      </div>

      {isCorrect && (
        <div className="flex shrink-0 items-center gap-1.5">
          <CheckCircle2 className="size-4 text-primary" />
          <Badge variant="success" className="rounded-md text-[10px]">
            Correct
          </Badge>
        </div>
      )}
    </div>
  );
}

export function MultipleChoicePreview({
  question,
  questionNumber,
  totalQuestions,
  onPrevious,
  onNext,
  onJump,
  actions,
}: MultipleChoicePreviewProps) {
  const [jumpValue, setJumpValue] = React.useState(String(questionNumber));

  React.useEffect(() => {
    setJumpValue(String(questionNumber));
  }, [questionNumber]);

  function handleJumpSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const questionNumberValue = Number(jumpValue);

    if (
      !Number.isInteger(questionNumberValue) ||
      questionNumberValue < 1 ||
      questionNumberValue > totalQuestions
    ) {
      setJumpValue(String(questionNumber));
      return;
    }

    onJump(questionNumberValue - 1);
  }

  return (
    <Card className="flex min-h-0 flex-1 flex-col">
      {/* Preview header */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b px-4 pb-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/30">
            <CircleHelp className="size-4 text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h1 className="truncate text-sm font-semibold tracking-tight">
                Question
              </h1>{" "}
              <form
                onSubmit={handleJumpSubmit}
                className="inline-flex items-center gap-1"
              >
                <Input
                  value={jumpValue}
                  onChange={(event) => setJumpValue(event.target.value)}
                  inputMode="numeric"
                  aria-label="Question number"
                  className="h-6 w-10 text-center text-xs px-0"
                />
                <span className="text-muted-foreground">
                  {" "}
                  of {totalQuestions}
                </span>
              </form>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={questionNumber === 1}
            className="h-8 px-2.5"
          >
            <ChevronLeft className="size-3.5" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onNext}
            disabled={questionNumber === totalQuestions}
            className="h-8 px-2.5"
          >
            <ChevronRight className="size-3.5" />
          </Button>

          {actions && <div className="ml-2 md:block hidden">{actions}</div>}
        </div>
      </div>

      {/* Scrollable question content */}
      <div className="min-h-0 flex-1 ">
        <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6">
          <div className="flex justify-between gap-4 flex-col md:flex-row">
            <div className="flex-1 flex-between flex-col">
              {/* Question */}
              <div className="w-full">
                <p className="text-sm font-mono font-semibold tracking-wide text-primary">
                  Question {questionNumber}
                </p>

                <h2 className="text-sm font-medium leading-relaxed text-foreground w-full">
                  {question.question}
                </h2>
              </div>
              {/* Explanation */}
              {question.explanation && (
                <div className="mt-1 rounded-lg border border-dashed font-mono bg-primary/10 py-2 p-3.5 text-primary text-shadow-2xs w-full">
                  <div className="flex items-start gap-2.5">
                    <div className="min-w-0">
                      <p className="mt-1 text-xs leading-relaxed font-light">
                        <span className="font-sans font-bold">
                          💡Explaination:
                        </span>{" "}
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Choices */}
            <div className="flex-1">
              <div className="grid gap-2 w-full text-xs">
                <p className="text-sm font-mono font-semibold tracking-wide text-primary">
                  Choices
                </p>

                <div className="grid gap-2">
                  {question.choices.map((choice) => (
                    <ChoiceRow key={choice.label} choice={choice} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Hint */}
          {question.hint && (
            <div className="mt-2.5 rounded-lg border border-dashed p-3 font-mono bg-secondary/80">
              <div className="flex items-start gap-2.5">
                <div className="min-w-0">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    <span className="font-sans font-semibold">🧠Hint:</span>{" "}
                    {question.hint}
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Action on small screen */}
          {actions && (
            <div className="mt-6 block w-full md:hidden">{actions}</div>
          )}
        </div>
      </div>
    </Card>
  );
}
