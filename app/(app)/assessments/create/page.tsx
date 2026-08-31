"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Trash2,
  Clock,
  Hash,
  Layers,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import { useCategories } from "@/hooks/use-categories";
import { useSubjects } from "@/hooks/use-subjects";
import { useCreateAssessment } from "@/hooks/use-assessment";
import { useToast } from "@/hooks/use-toast";

interface AssessmentSubject {
  id: string;
  categoryId: string;
  subjectId: string;
  questionCount: number;
  categoryName?: string;
  subjectName?: string;
}

export default function CreateAssessmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Basic info
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState<"QUIZ" | "EXAM">("EXAM");
  const [timeLimitMinutes, setTimeLimitMinutes] = React.useState<number | null>(
    null,
  );

  // Subjects configuration
  const [subjects, setSubjects] = React.useState<AssessmentSubject[]>([]);
  const [showAddSubject, setShowAddSubject] = React.useState(false);

  // Add subject form
  const [selectedCategoryId, setSelectedCategoryId] = React.useState("");
  const [selectedSubjectId, setSelectedSubjectId] = React.useState("");
  const [newQuestionCount, setNewQuestionCount] = React.useState("10");

  // Queries
  const { data: categories = [] } = useCategories();
  const { data: subjectsData = [], isLoading: subjectsLoading } = useSubjects(
    selectedCategoryId || undefined,
  );

  // Mutation
  const createAssessment = useCreateAssessment();

  const canAddSubject =
    selectedCategoryId && selectedSubjectId && Number(newQuestionCount) > 0;

  // Reset subject selection when category changes
  React.useEffect(() => {
    setSelectedSubjectId("");
  }, [selectedCategoryId]);

  const handleAddSubject = () => {
    if (!canAddSubject) return;

    const category = categories.find((c) => c.id === selectedCategoryId);
    const subject = subjectsData.find((s) => s.id === selectedSubjectId);

    if (!category || !subject) {
      toast({
        title: "Error",
        description: "Selected category or subject not found",
        variant: "destructive",
      });
      return;
    }

    // Check if this subject is already added
    const exists = subjects.some((s) => s.subjectId === selectedSubjectId);
    if (exists) {
      toast({
        title: "Error",
        description: "This subject is already added to the assessment",
        variant: "destructive",
      });
      return;
    }

    setSubjects([
      ...subjects,
      {
        id: crypto.randomUUID(),
        categoryId: selectedCategoryId,
        subjectId: selectedSubjectId,
        questionCount: Number(newQuestionCount),
        categoryName: category.name,
        subjectName: subject.name,
      },
    ]);

    // Reset form
    setSelectedCategoryId("");
    setSelectedSubjectId("");
    setNewQuestionCount("10");
    setShowAddSubject(false);
  };

  const handleRemoveSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a title",
        variant: "destructive",
      });
      return;
    }

    if (subjects.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one subject",
        variant: "destructive",
      });
      return;
    }

    // IMPORTANT: Convert minutes to seconds for the backend
    // The backend expects seconds, but the user inputs minutes
    const timeLimitSeconds = timeLimitMinutes ? timeLimitMinutes * 60 : null;

    console.log("Time Limit - Minutes:", timeLimitMinutes);
    console.log("Time Limit - Seconds (sent to backend):", timeLimitSeconds);

    createAssessment.mutate(
      {
        title: title.trim(),
        description: description.trim() || null,
        type,
        mode: "DYNAMIC",
        timeLimitSeconds: timeLimitSeconds, // Send seconds to backend
        subjects: subjects.map((s) => ({
          categoryId: s.categoryId,
          subjectId: s.subjectId,
          questionCount: s.questionCount,
        })),
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Success",
            description: "Assessment created successfully!",
          });
          queryClient.invalidateQueries({ queryKey: ["assessments"] });
          router.push(`/assessments/${data.id}`);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : "Failed to create assessment",
            variant: "destructive",
          });
        },
      },
    );
  };

  const totalQuestions = subjects.reduce((sum, s) => sum + s.questionCount, 0);

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create Assessment</h1>
        <p className="text-muted-foreground">
          Set up your assessment configuration. Questions will be randomly
          selected from your question bank.
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter assessment title"
                className="mt-1"
                disabled={createAssessment.isPending}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your assessment"
                className="mt-1"
                rows={3}
                disabled={createAssessment.isPending}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Assessment Type</Label>
                <Select
                  value={type}
                  onValueChange={(v: any) => setType(v)}
                  disabled={createAssessment.isPending}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="QUIZ">Quiz</SelectItem>
                    <SelectItem value="EXAM">Exam</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  min={1}
                  value={timeLimitMinutes || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTimeLimitMinutes(val ? Number(val) : null);
                  }}
                  placeholder="Optional (e.g., 30)"
                  className="mt-1"
                  disabled={createAssessment.isPending}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter time limit in minutes. Leave empty for no time limit.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Subjects Configuration */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Subjects & Questions</h2>
            <Badge variant="secondary">{totalQuestions} total questions</Badge>
          </div>

          {/* Subject List */}
          {subjects.length > 0 && (
            <div className="space-y-2 mb-4">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/10"
                >
                  <div className="flex items-center gap-3">
                    <Layers className="size-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">
                        {subject.categoryName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {subject.subjectName} • {subject.questionCount}{" "}
                        questions
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSubject(subject.id)}
                    disabled={createAssessment.isPending}
                  >
                    <Trash2 className="size-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add Subject Button */}
          {!showAddSubject && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAddSubject(true)}
              disabled={createAssessment.isPending}
            >
              <Plus className="mr-2 size-4" />
              Add Subject
            </Button>
          )}

          {/* Add Subject Form - Single Column */}
          {showAddSubject && (
            <div className="border rounded-lg p-4 space-y-4 bg-muted/5">
              <div className="space-y-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={selectedCategoryId}
                    onValueChange={(v) => {
                      setSelectedCategoryId(v);
                      setSelectedSubjectId("");
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Subject</Label>
                  <Select
                    value={selectedSubjectId}
                    onValueChange={setSelectedSubjectId}
                    disabled={!selectedCategoryId || subjectsLoading}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue
                        placeholder={
                          !selectedCategoryId
                            ? "Select a category first"
                            : subjectsLoading
                              ? "Loading subjects..."
                              : subjectsData.length === 0
                                ? "No subjects available"
                                : "Select a subject"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectsData.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedCategoryId &&
                    subjectsData.length === 0 &&
                    !subjectsLoading && (
                      <p className="text-xs text-amber-600 mt-1">
                        No subjects found for this category. Please select a
                        different category or create a subject first.
                      </p>
                    )}
                </div>

                <div>
                  <Label>Number of Questions</Label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={newQuestionCount}
                    onChange={(e) => setNewQuestionCount(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    How many questions should be randomly selected from this
                    subject?
                  </p>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddSubject(false);
                    setSelectedCategoryId("");
                    setSelectedSubjectId("");
                    setNewQuestionCount("10");
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddSubject} disabled={!canAddSubject}>
                  Add Subject
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Summary */}
        {subjects.length > 0 && (
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-4">
              <Sparkles className="size-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">Assessment Summary</h3>
                <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">{totalQuestions}</span>{" "}
                    questions total
                  </p>
                  <p>
                    <span className="font-medium">{subjects.length}</span>{" "}
                    subject
                    {subjects.length > 1 ? "s" : ""} included
                  </p>
                  {timeLimitMinutes && (
                    <p>
                      Time limit:{" "}
                      <span className="font-medium">
                        {timeLimitMinutes} minutes
                      </span>
                    </p>
                  )}
                  <p className="text-xs mt-2">
                    Questions will be randomly selected from your question bank
                    when a user starts this assessment.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={createAssessment.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              createAssessment.isPending ||
              !title.trim() ||
              subjects.length === 0
            }
          >
            {createAssessment.isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create Assessment
                <ArrowRight className="ml-2 size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
