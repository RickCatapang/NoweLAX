// "use client";

// import * as React from "react";
// import { useParams, useRouter } from "next/navigation";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   CheckCircle2,
//   ChevronLeft,
//   ChevronRight,
//   Loader2,
//   Clock,
//   Flag,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
// import { cn } from "@/lib/utils";

// interface Question {
//   id: string;
//   text: string;
//   choices: Array<{
//     id: string;
//     label: string;
//     content: string;
//   }>;
//   sortOrder: number;
//   answered: boolean;
//   selectedChoiceId: string | null;
// }

// interface AttemptData {
//   id: string;
//   assessment: {
//     title: string;
//     timeLimitSeconds: number | null;
//   };
//   questions: Question[];
// }

// // API functions
// async function generateAttempt(
//   assessmentId: string,
// ): Promise<{ attemptId: string; isResuming: boolean }> {
//   const response = await fetch(`/api/assessments/${assessmentId}/generate`, {
//     method: "POST",
//   });
//   const result = await response.json();
//   if (!response.ok || !result.success) {
//     throw new Error(result.message || "Failed to start assessment");
//   }
//   return result.data;
// }

// async function fetchAttemptQuestions(attemptId: string): Promise<AttemptData> {
//   const response = await fetch(`/api/attempts/${attemptId}/questions`);
//   const result = await response.json();
//   if (!response.ok || !result.success) {
//     throw new Error(result.message || "Failed to load questions");
//   }
//   return {
//     id: result.data.attempt.id,
//     assessment: {
//       title: result.data.attempt.assessment.title,
//       timeLimitSeconds: result.data.attempt.assessment.timeLimitSeconds,
//     },
//     questions: result.data.questions,
//   };
// }

// async function submitAnswer(
//   attemptId: string,
//   questionId: string,
//   selectedChoiceId: string,
// ): Promise<void> {
//   const response = await fetch(`/api/attempts/${attemptId}/answer`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ questionId, selectedChoiceId }),
//   });
//   const result = await response.json();
//   if (!response.ok || !result.success) {
//     throw new Error(result.message || "Failed to save answer");
//   }
// }

// async function submitAttempt(
//   attemptId: string,
// ): Promise<{ attemptId: string }> {
//   const response = await fetch(`/api/attempts/${attemptId}/submit`, {
//     method: "POST",
//   });
//   const result = await response.json();
//   if (!response.ok || !result.success) {
//     throw new Error(result.message || "Failed to submit assessment");
//   }
//   return result.data;
// }

// export default function TakeAssessmentPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { toast } = useToast();
//   const queryClient = useQueryClient();
//   const assessmentId = params.id as string;

//   const [currentIndex, setCurrentIndex] = React.useState(0);
//   const [timeLeft, setTimeLeft] = React.useState<number | null>(null);
//   const [isSubmitting, setIsSubmitting] = React.useState(false);

//   // Generate attempt mutation
//   const generateMutation = useMutation({
//     mutationFn: () => generateAttempt(assessmentId),
//     onSuccess: (data) => {
//       // After generating, fetch questions
//       refetchQuestions();
//     },
//     onError: (error) => {
//       toast({
//         title: "Error",
//         description:
//           error instanceof Error ? error.message : "Failed to start assessment",
//         variant: "destructive",
//       });
//       router.push("/assessments");
//     },
//   });

//   // Fetch questions query
//   const {
//     data: attemptData,
//     isLoading: isLoadingQuestions,
//     refetch: refetchQuestions,
//     isRefetching,
//   } = useQuery({
//     queryKey: ["attempt", generateMutation.data?.attemptId],
//     queryFn: () => {
//       if (!generateMutation.data?.attemptId) {
//         throw new Error("No attempt ID available");
//       }
//       return fetchAttemptQuestions(generateMutation.data.attemptId);
//     },
//     enabled: !!generateMutation.data?.attemptId,
//     staleTime: 0,
//   });

//   // Answer mutation
//   const answerMutation = useMutation({
//     mutationFn: ({
//       questionId,
//       selectedChoiceId,
//     }: {
//       questionId: string;
//       selectedChoiceId: string;
//     }) => {
//       if (!generateMutation.data?.attemptId) {
//         throw new Error("No attempt ID available");
//       }
//       return submitAnswer(
//         generateMutation.data.attemptId,
//         questionId,
//         selectedChoiceId,
//       );
//     },
//     onSuccess: () => {
//       // Invalidate and refetch questions to get updated state
//       queryClient.invalidateQueries({
//         queryKey: ["attempt", generateMutation.data?.attemptId],
//       });
//     },
//     onError: (error) => {
//       toast({
//         title: "Error",
//         description:
//           error instanceof Error ? error.message : "Failed to save answer",
//         variant: "destructive",
//       });
//     },
//   });

//   // Initialize attempt on mount
//   React.useEffect(() => {
//     generateMutation.mutate();
//   }, []);

//   // Set time limit when data loads
//   React.useEffect(() => {
//     if (attemptData?.assessment.timeLimitSeconds) {
//       setTimeLeft(attemptData.assessment.timeLimitSeconds);
//     }
//   }, [attemptData]);

//   // Timer
//   React.useEffect(() => {
//     if (
//       timeLeft === null ||
//       timeLeft <= 0 ||
//       attemptData?.assessment.timeLimitSeconds === null
//     )
//       return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev === null || prev <= 1) {
//           clearInterval(timer);
//           handleSubmit();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft, attemptData]);

//   const handleAnswer = (questionId: string, selectedChoiceId: string) => {
//     // Use mutation to submit answer
//     answerMutation.mutate({ questionId, selectedChoiceId });
//   };

//   const handleSubmit = async () => {
//     if (!generateMutation.data?.attemptId) return;

//     setIsSubmitting(true);
//     try {
//       const result = await submitAttempt(generateMutation.data.attemptId);

//       toast({
//         title: "Assessment Submitted",
//         description: "Your answers have been recorded.",
//       });

//       router.push(`/attempts/${result.attemptId}/results`);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description:
//           error instanceof Error
//             ? error.message
//             : "Failed to submit assessment",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Loading states
//   const isLoading =
//     generateMutation.isPending || isLoadingQuestions || isRefetching;
//   const questions = attemptData?.questions || [];
//   const totalQuestions = questions.length;
//   const answeredCount = questions.filter((q) => q.answered).length;
//   const currentQuestion = questions[currentIndex];

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <Loader2 className="size-8 animate-spin text-muted-foreground mx-auto mb-4" />
//           <p className="text-sm text-muted-foreground">
//             {generateMutation.isPending
//               ? "Starting assessment..."
//               : "Loading questions..."}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!currentQuestion) {
//     return (
//       <div className="container mx-auto max-w-4xl py-8 px-4">
//         <Card className="p-8 text-center">
//           <p className="text-muted-foreground">No questions available.</p>
//           <Button className="mt-4" onClick={() => router.push("/assessments")}>
//             Back to Assessments
//           </Button>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto max-w-4xl py-8 px-4">
//       {/* Header */}
//       <div className="mb-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold tracking-tight">
//               {attemptData?.assessment.title}
//             </h1>
//             <p className="text-sm text-muted-foreground">
//               Question {currentIndex + 1} of {totalQuestions}
//             </p>
//           </div>
//           <div className="flex items-center gap-4">
//             {timeLeft !== null &&
//               attemptData?.assessment.timeLimitSeconds !== null && (
//                 <div className="flex items-center gap-2 text-sm font-mono">
//                   <Clock className="size-4" />
//                   <span
//                     className={cn(timeLeft < 60 && "text-red-500 font-bold")}
//                   >
//                     {formatTime(timeLeft)}
//                   </span>
//                 </div>
//               )}
//             <Badge variant="secondary">
//               {answeredCount}/{totalQuestions} answered
//             </Badge>
//           </div>
//         </div>
//       </div>

//       {/* Question */}
//       <Card className="p-6 mb-6">
//         <div className="space-y-6">
//           <div>
//             <div className="flex items-center gap-2 mb-3">
//               <span className="text-sm font-medium text-muted-foreground">
//                 Question {currentIndex + 1}
//               </span>
//               {currentQuestion.answered && (
//                 <Badge variant="success" className="text-xs">
//                   <CheckCircle2 className="size-3 mr-1" />
//                   Answered
//                 </Badge>
//               )}
//               {answerMutation.isPending && (
//                 <Badge variant="secondary" className="text-xs">
//                   <Loader2 className="size-3 mr-1 animate-spin" />
//                   Saving...
//                 </Badge>
//               )}
//             </div>
//             <h2 className="text-lg font-medium">{currentQuestion.text}</h2>
//           </div>

//           <RadioGroup
//             value={currentQuestion.selectedChoiceId || undefined}
//             onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
//             disabled={answerMutation.isPending}
//             className="space-y-3"
//           >
//             {currentQuestion.choices.map((choice) => (
//               <div
//                 key={choice.id}
//                 className={cn(
//                   "flex items-center space-x-3 rounded-lg border p-4 transition-colors",
//                   currentQuestion.selectedChoiceId === choice.id &&
//                     "border-primary bg-primary/5",
//                   answerMutation.isPending && "opacity-50 cursor-not-allowed",
//                 )}
//               >
//                 <RadioGroupItem
//                   value={choice.id}
//                   id={choice.id}
//                   disabled={answerMutation.isPending}
//                 />
//                 <Label
//                   htmlFor={choice.id}
//                   className={cn(
//                     "flex-1 cursor-pointer text-sm",
//                     answerMutation.isPending && "cursor-not-allowed",
//                   )}
//                 >
//                   <span className="font-medium mr-2">{choice.label}.</span>
//                   {choice.content}
//                 </Label>
//               </div>
//             ))}
//           </RadioGroup>
//         </div>
//       </Card>

//       {/* Navigation */}
//       <div className="flex items-center justify-between gap-4">
//         <Button
//           variant="outline"
//           onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
//           disabled={currentIndex === 0 || answerMutation.isPending}
//         >
//           <ChevronLeft className="mr-2 size-4" />
//           Previous
//         </Button>

//         <div className="flex items-center gap-2">
//           {questions.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentIndex(index)}
//               disabled={answerMutation.isPending}
//               className={cn(
//                 "size-3 rounded-full transition-colors",
//                 index === currentIndex && "ring-2 ring-primary ring-offset-2",
//                 questions[index].answered ? "bg-primary" : "bg-muted",
//               )}
//               aria-label={`Go to question ${index + 1}`}
//             />
//           ))}
//         </div>

//         {currentIndex === totalQuestions - 1 ? (
//           <Button
//             onClick={handleSubmit}
//             disabled={isSubmitting || answerMutation.isPending}
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="mr-2 size-4 animate-spin" />
//                 Submitting...
//               </>
//             ) : (
//               <>
//                 <Flag className="mr-2 size-4" />
//                 Submit Assessment
//               </>
//             )}
//           </Button>
//         ) : (
//           <Button
//             onClick={() =>
//               setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))
//             }
//             disabled={answerMutation.isPending}
//           >
//             Next
//             <ChevronRight className="ml-2 size-4" />
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }
// app/(dashboard)/assessments/[id]/take/page.tsx

"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Clock,
  Flag,
  Lightbulb,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  text: string;
  choices: Array<{
    id: string;
    label: string;
    content: string;
  }>;
  hint?: string;
  explanation?: string;
  sortOrder: number;
  answered: boolean;
  selectedChoiceId: string | null;
}

interface AttemptData {
  id: string;
  assessment: {
    title: string;
    timeLimitSeconds: number | null;
  };
  questions: Question[];
}

// API functions
async function generateAttempt(
  assessmentId: string,
): Promise<{ attemptId: string; isResuming: boolean }> {
  const response = await fetch(`/api/assessments/${assessmentId}/generate`, {
    method: "POST",
  });
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to start assessment");
  }
  return result.data;
}

async function fetchAttemptQuestions(attemptId: string): Promise<AttemptData> {
  const response = await fetch(`/api/attempts/${attemptId}/questions`);
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load questions");
  }
  return {
    id: result.data.attempt.id,
    assessment: {
      title: result.data.attempt.assessment.title,
      timeLimitSeconds: result.data.attempt.assessment.timeLimitSeconds,
    },
    questions: result.data.questions,
  };
}

async function submitAnswer(
  attemptId: string,
  questionId: string,
  selectedChoiceId: string,
): Promise<void> {
  const response = await fetch(`/api/attempts/${attemptId}/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ questionId, selectedChoiceId }),
  });
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to save answer");
  }
}

async function submitAttempt(
  attemptId: string,
): Promise<{ attemptId: string }> {
  const response = await fetch(`/api/attempts/${attemptId}/submit`, {
    method: "POST",
  });
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to submit assessment");
  }
  return result.data;
}

export default function TakeAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const assessmentId = params.id as string;

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Generate attempt mutation
  const generateMutation = useMutation({
    mutationFn: () => generateAttempt(assessmentId),
    onSuccess: (data) => {
      refetchQuestions();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to start assessment",
        variant: "destructive",
      });
      router.push("/assessments");
    },
  });

  // Fetch questions query
  const {
    data: attemptData,
    isLoading: isLoadingQuestions,
    refetch: refetchQuestions,
    isRefetching,
  } = useQuery({
    queryKey: ["attempt", generateMutation.data?.attemptId],
    queryFn: () => {
      if (!generateMutation.data?.attemptId) {
        throw new Error("No attempt ID available");
      }
      return fetchAttemptQuestions(generateMutation.data.attemptId);
    },
    enabled: !!generateMutation.data?.attemptId,
    staleTime: 0,
  });

  // Answer mutation
  const answerMutation = useMutation({
    mutationFn: ({
      questionId,
      selectedChoiceId,
    }: {
      questionId: string;
      selectedChoiceId: string;
    }) => {
      if (!generateMutation.data?.attemptId) {
        throw new Error("No attempt ID available");
      }
      return submitAnswer(
        generateMutation.data.attemptId,
        questionId,
        selectedChoiceId,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attempt", generateMutation.data?.attemptId],
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save answer",
        variant: "destructive",
      });
    },
  });

  // Initialize attempt on mount
  React.useEffect(() => {
    generateMutation.mutate();
  }, []);

  // Set time limit when data loads
  React.useEffect(() => {
    if (attemptData?.assessment.timeLimitSeconds) {
      setTimeLeft(attemptData.assessment.timeLimitSeconds);
    }
  }, [attemptData]);

  // Timer
  React.useEffect(() => {
    if (
      timeLeft === null ||
      timeLeft <= 0 ||
      attemptData?.assessment.timeLimitSeconds === null
    )
      return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, attemptData]);

  const handleAnswer = (questionId: string, selectedChoiceId: string) => {
    answerMutation.mutate({ questionId, selectedChoiceId });
  };

  const handleSubmit = async () => {
    if (!generateMutation.data?.attemptId) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/attempts/${generateMutation.data.attemptId}/submit`,
        {
          method: "POST",
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to submit assessment");
      }

      toast({
        title: "Assessment Submitted",
        description: "Your answers have been recorded.",
      });

      // Use the attemptId from the response
      const attemptId =
        result.data?.attemptId || generateMutation.data.attemptId;
      router.push(`/attempts/${attemptId}/results`);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit assessment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const isLoading =
    generateMutation.isPending || isLoadingQuestions || isRefetching;
  const questions = attemptData?.questions || [];
  const totalQuestions = questions.length;
  const answeredCount = questions.filter((q) => q.answered).length;
  const currentQuestion = questions[currentIndex];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (!currentQuestion && !isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No questions available.</p>
          <Button className="mt-4" onClick={() => router.push("/assessments")}>
            Back to Assessments
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Card
        className={cn(
          "flex min-h-[500px] flex-col overflow-hidden transition-opacity duration-300 relative",
          isLoading && "opacity-60 pointer-events-none",
        )}
      >
        {/* Loading overlay indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
            <div className="flex items-center gap-3 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border">
              <Loader2 className="size-5 animate-spin text-primary" />
              <span className="text-sm font-medium text-foreground">
                {generateMutation.isPending
                  ? "Starting assessment..."
                  : "Loading questions..."}
              </span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/30">
              <span className="text-sm font-medium text-muted-foreground">
                {currentIndex + 1}
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-sm font-semibold tracking-tight">
                  {attemptData?.assessment.title}
                </h1>
                <Badge variant="secondary" className="text-xs">
                  {answeredCount}/{totalQuestions}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Question {currentIndex + 1} of {totalQuestions}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {timeLeft !== null &&
              attemptData?.assessment.timeLimitSeconds !== null && (
                <div className="flex items-center gap-1.5 text-sm font-mono mr-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <span
                    className={cn(timeLeft < 60 && "text-red-500 font-bold")}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </div>
              )}

            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="size-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() =>
                setCurrentIndex((prev) =>
                  Math.min(totalQuestions - 1, prev + 1),
                )
              }
              disabled={currentIndex === totalQuestions - 1}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl space-y-6">
            {/* Question Text */}
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs font-mono font-semibold tracking-wide text-primary">
                  Question {currentIndex + 1}
                </span>
                {currentQuestion?.answered && (
                  <Badge variant="success" className="text-[10px]">
                    <CheckCircle2 className="size-3 mr-1" />
                    Answered
                  </Badge>
                )}
                {answerMutation.isPending && (
                  <Badge variant="secondary" className="text-[10px]">
                    <Loader2 className="size-3 mr-1 animate-spin" />
                    Saving...
                  </Badge>
                )}
                {/* Hint Popover */}
                {currentQuestion?.hint && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="xs"
                        className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Lightbulb className="size-3.5 mr-1" />
                        Hint
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 text-sm" side="top">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">
                            💡 Hint
                          </span>
                        </div>
                        <p className="text-muted-foreground">
                          {currentQuestion.hint}
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
              <h2 className="text-base font-medium leading-relaxed">
                {currentQuestion?.text}
              </h2>
            </div>

            {/* Choices - with card-like shadow and compact spacing */}
            <div className="space-y-1.5">
              <p className="text-xs font-mono font-semibold tracking-wide text-primary mb-2">
                Choices
              </p>
              <RadioGroup
                value={currentQuestion?.selectedChoiceId || undefined}
                onValueChange={(value) =>
                  handleAnswer(currentQuestion.id, value)
                }
                disabled={answerMutation.isPending}
                className="gap-1"
              >
                {currentQuestion?.choices.map((choice) => {
                  const isSelected =
                    currentQuestion.selectedChoiceId === choice.id;

                  return (
                    <div key={choice.id}>
                      <RadioGroupItem
                        value={choice.id}
                        id={choice.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={choice.id}
                        className={cn(
                          "group relative flex min-h-10 cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-1.5 text-sm transition-all",
                          "bg-card/50 shadow-sm hover:shadow-md hover:scale-[1.01]",
                          isSelected &&
                            "border-primary/40 bg-primary/30 shadow-md",
                          answerMutation.isPending &&
                            "pointer-events-none cursor-not-allowed opacity-50",
                        )}
                      >
                        {/* Letter indicator - acts as checkbox/radio */}
                        <span
                          className={cn(
                            "flex size-7 shrink-0 items-center justify-center rounded-md border text-xs font-medium transition-colors",
                            "border-border bg-muted/40 text-muted-foreground",
                            isSelected &&
                              "border-primary bg-primary text-primary-foreground",
                          )}
                        >
                          {choice.label}
                        </span>

                        {/* Choice content - one line */}
                        <span className="flex-1 leading-snug">
                          {choice.content}
                        </span>

                        {/* Selected check */}
                        {isSelected && <span className="text-xl">👈</span>}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>

            {/* Explanation - Only show after answered */}
            {/* {currentQuestion?.explanation && currentQuestion?.answered && (
              <div className="rounded-lg border border-dashed bg-primary/5 p-3">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    💡 Explanation:
                  </span>{" "}
                  {currentQuestion.explanation}
                </p>
              </div>
            )} */}
          </div>
        </div>

        {/* Footer with progress dots and submit */}
        <div className="flex shrink-0 items-center justify-between border-t px-4 py-3">
          <div className="flex items-center gap-1">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "size-2.5 rounded-full transition-all hover:scale-125",
                  index === currentIndex &&
                    "ring-2 ring-primary ring-offset-2 scale-110",
                  questions[index].answered
                    ? "bg-primary"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
                aria-label={`Go to question ${index + 1}`}
              />
            ))}
          </div>

          {currentIndex === totalQuestions - 1 && (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || answerMutation.isPending}
              size="sm"
              className="shrink-0 shadow-sm hover:shadow-md transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-3 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Flag className="mr-2 size-3" />
                  Submit
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
