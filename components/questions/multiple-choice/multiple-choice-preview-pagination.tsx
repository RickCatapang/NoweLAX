"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MultipleChoicePreviewPaginationProps {
  currentIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onJump: (index: number) => void;
  className?: string;
}

function getPageNumbers(
  currentIndex: number,
  totalQuestions: number,
): Array<number | "ellipsis"> {
  if (totalQuestions <= 7) {
    return Array.from({ length: totalQuestions }, (_, index) => index);
  }

  const pages = new Set<number>();

  pages.add(0);
  pages.add(totalQuestions - 1);
  pages.add(currentIndex);

  for (let offset = 1; offset <= 2; offset++) {
    pages.add(currentIndex - offset);
    pages.add(currentIndex + offset);
  }

  const sortedPages = Array.from(pages)
    .filter((page) => page >= 0 && page < totalQuestions)
    .sort((a, b) => a - b);

  const result: Array<number | "ellipsis"> = [];

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1];

    if (previousPage !== undefined && page - previousPage > 1) {
      result.push("ellipsis");
    }

    result.push(page);
  });

  return result;
}

export function MultipleChoicePreviewPagination({
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onJump,
  className,
}: MultipleChoicePreviewPaginationProps) {
  const [jumpValue, setJumpValue] = React.useState(String(currentIndex + 1));

  React.useEffect(() => {
    setJumpValue(String(currentIndex + 1));
  }, [currentIndex]);

  function handleJumpSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const questionNumber = Number(jumpValue);

    if (
      !Number.isInteger(questionNumber) ||
      questionNumber < 1 ||
      questionNumber > totalQuestions
    ) {
      setJumpValue(String(currentIndex + 1));
      return;
    }

    onJump(questionNumber - 1);
  }

  const pageNumbers = getPageNumbers(currentIndex, totalQuestions);

  return (
    <div
      className={cn(
        "border-t bg-background/95 px-4 py-3 backdrop-blur",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="gap-1.5"
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>

        <div className="flex items-center justify-center gap-1.5">
          {pageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-1 text-sm text-muted-foreground"
                >
                  …
                </span>
              );
            }

            const isActive = page === currentIndex;

            return (
              <Button
                key={page}
                type="button"
                variant={isActive ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => onJump(page)}
                aria-label={`Go to question ${page + 1}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "text-xs tabular-nums",
                  isActive && "font-semibold",
                )}
              >
                {page + 1}
              </Button>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={currentIndex === totalQuestions - 1}
          className="gap-1.5"
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {totalQuestions > 7 && (
        <form
          onSubmit={handleJumpSubmit}
          className="mt-3 flex items-center justify-center gap-2"
        >
          <span className="text-xs text-muted-foreground">Jump to</span>

          <Input
            value={jumpValue}
            onChange={(event) => setJumpValue(event.target.value)}
            inputMode="numeric"
            aria-label="Question number"
            className="h-8 w-16 text-center text-xs"
          />

          <span className="text-xs text-muted-foreground">
            of {totalQuestions}
          </span>

          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
          >
            Go
          </Button>
        </form>
      )}
    </div>
  );
}
