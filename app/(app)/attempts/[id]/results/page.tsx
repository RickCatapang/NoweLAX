// app/(dashboard)/attempts/[id]/results/page.tsx

"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Loader2,
  Award,
  BarChart3,
  FileText,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AttemptResult {
  id: string;
  score: number;
  totalPoints: number;
  percentage: number;
  status: string;
  durationSeconds: number;
  completedAt: string;
  startedAt: string;
  assessment: {
    id: string;
    title: string;
    type: string;
  };
  questions: Array<{
    id: string;
    sortOrder: number;
    answered: boolean;
    isCorrect: boolean | null;
    pointsEarned: number | null;
    timeSpentSeconds: number | null;
    question: {
      id: string;
      versions: Array<{
        questionText: string;
        explanation: string | null;
        choices: Array<{
          id: string;
          label: string;
          content: string;
          isCorrect: boolean;
        }>;
      }>;
    };
    answer: {
      selectedChoiceId: string | null;
    } | null;
  }>;
}

async function fetchResults(attemptId: string): Promise<AttemptResult> {
  const response = await fetch(`/api/attempts/${attemptId}/results`);
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load results");
  }
  return result.data;
}

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const attemptId = params.id as string;

  const [showAnswers, setShowAnswers] = React.useState(false);

  const {
    data: result,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["attempt-results", attemptId],
    queryFn: () => fetchResults(attemptId),
    enabled: !!attemptId,
  });

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load results",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <Card className="p-8 text-center">
          <p className="text-destructive">Failed to load results</p>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : "Please try again"}
          </p>
          <Button className="mt-4" onClick={() => router.push("/assessments")}>
            Back to Assessments
          </Button>
        </Card>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const correctCount = result.questions.filter(
    (q) => q.isCorrect === true,
  ).length;
  const incorrectCount = result.questions.filter(
    (q) => q.isCorrect === false,
  ).length;
  const unansweredCount = result.questions.filter((q) => !q.answered).length;

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4 -ml-2"
          onClick={() => router.push("/assessments")}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to Assessments
        </Button>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Results</h1>
            <p className="text-muted-foreground">{result.assessment.title}</p>
          </div>
          <Badge
            className={cn(
              "text-lg px-4 py-2",
              getScoreBadge(result.percentage),
            )}
          >
            {result.percentage.toFixed(1)}%
          </Badge>
        </div>
      </div>

      {/* Score Summary */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="p-4 text-center shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Award className="size-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Score</p>
          </div>
          <p
            className={cn(
              "text-2xl font-bold",
              getScoreColor(result.percentage),
            )}
          >
            {result.score}/{result.totalPoints}
          </p>
        </Card>

        <Card className="p-4 text-center shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock className="size-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Time Taken</p>
          </div>
          <p className="text-2xl font-bold">
            {formatTime(result.durationSeconds)}
          </p>
        </Card>

        <Card className="p-4 text-center shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-1">
            <BarChart3 className="size-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Status</p>
          </div>
          <Badge variant="success" className="text-sm">
            {result.status}
          </Badge>
        </Card>
      </div>

      {/* Question Breakdown */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="p-3 text-center border-green-200 bg-green-50 shadow-sm">
          <p className="text-sm text-muted-foreground">Correct</p>
          <p className="text-2xl font-bold text-green-600">{correctCount}</p>
        </Card>
        <Card className="p-3 text-center border-red-200 bg-red-50 shadow-sm">
          <p className="text-sm text-muted-foreground">Incorrect</p>
          <p className="text-2xl font-bold text-red-600">{incorrectCount}</p>
        </Card>
        <Card className="p-3 text-center border-gray-200 bg-gray-50 shadow-sm">
          <p className="text-sm text-muted-foreground">Unanswered</p>
          <p className="text-2xl font-bold text-gray-600">{unansweredCount}</p>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="p-4 mb-6 shadow-sm">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Score</span>
          <span className="text-sm font-medium">
            {result.percentage.toFixed(1)}%
          </span>
        </div>
        <Progress value={result.percentage} className="h-3" />
      </Card>

      {/* Answer Review Toggle */}
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          onClick={() => setShowAnswers(!showAnswers)}
          className="shadow-sm hover:shadow-md transition-all"
        >
          <FileText className="mr-2 size-4" />
          {showAnswers ? "Hide Answers" : "Review Answers"}
          {showAnswers ? (
            <ChevronUp className="ml-2 size-4" />
          ) : (
            <ChevronDown className="ml-2 size-4" />
          )}
        </Button>
      </div>

      {/* Question Review */}
      {showAnswers && (
        <div className="space-y-4">
          <Separator className="my-6" />
          <h2 className="text-xl font-semibold">Answer Review</h2>

          {result.questions.map((q, index) => {
            const version = q.question.versions[0];
            const correctChoice = version.choices.find((c) => c.isCorrect);
            const userChoice = q.answer?.selectedChoiceId
              ? version.choices.find((c) => c.id === q.answer?.selectedChoiceId)
              : null;
            const isCorrect = q.isCorrect;

            return (
              <Card
                key={q.id}
                className={cn(
                  "p-4 shadow-sm hover:shadow-md transition-all",
                  isCorrect
                    ? "border-green-200"
                    : q.answered
                      ? "border-red-200"
                      : "border-gray-200",
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {isCorrect ? (
                      <CheckCircle2 className="size-5 text-green-500" />
                    ) : q.answered ? (
                      <XCircle className="size-5 text-red-500" />
                    ) : (
                      <div className="size-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-sm font-medium">
                        Question {index + 1}
                      </span>
                      {q.answered ? (
                        <Badge
                          variant={isCorrect ? "success" : "destructive"}
                          className="text-xs"
                        >
                          {isCorrect ? "Correct" : "Incorrect"}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Unanswered
                        </Badge>
                      )}
                      {q.timeSpentSeconds && (
                        <Badge
                          variant="outline"
                          className="text-xs flex items-center gap-1"
                        >
                          <Clock className="size-3" />
                          {q.timeSpentSeconds}s
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm mb-3">{version.questionText}</p>

                    <div className="space-y-1.5">
                      {version.choices.map((choice) => {
                        const isUserChoice = userChoice?.id === choice.id;
                        const isCorrectChoice = choice.isCorrect;

                        return (
                          <div
                            key={choice.id}
                            className={cn(
                              "flex items-center gap-2 text-sm p-2 rounded border",
                              isCorrectChoice && "border-green-500 bg-green-50",
                              isUserChoice &&
                                !isCorrectChoice &&
                                "border-red-500 bg-red-50",
                              isUserChoice &&
                                isCorrectChoice &&
                                "border-green-500 bg-green-100",
                              !isUserChoice &&
                                !isCorrectChoice &&
                                "border-border bg-background",
                            )}
                          >
                            <span className="font-medium min-w-[20px]">
                              {choice.label}.
                            </span>
                            <span className="flex-1">{choice.content}</span>
                            {isCorrectChoice && (
                              <span className="text-green-600 text-xs font-medium">
                                ✓ Correct
                              </span>
                            )}
                            {isUserChoice && !isCorrectChoice && (
                              <span className="text-red-600 text-xs font-medium">
                                ✗ Your answer
                              </span>
                            )}
                            {isUserChoice && isCorrectChoice && (
                              <span className="text-green-600 text-xs font-medium">
                                ✓ Your answer
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {version.explanation && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm border border-dashed">
                        <span className="font-medium">💡 Explanation:</span>{" "}
                        <span className="text-muted-foreground">
                          {version.explanation}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end mt-6">
        <Button
          variant="outline"
          onClick={() => router.push("/assessments")}
          className="shadow-sm hover:shadow-md transition-all"
        >
          Back to Assessments
        </Button>
        <Button
          onClick={() => router.push(`/assessments/${result.assessment.id}`)}
          className="shadow-sm hover:shadow-md transition-all"
        >
          View Assessment
        </Button>
      </div>
    </div>
  );
}
