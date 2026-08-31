"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  Layers,
  Users,
  Play,
  Edit,
  Share2,
  Loader2,
  ArrowLeft,
  Globe,
  Lock,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAssessment } from "@/hooks/use-assessment";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function AssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPublishing, setIsPublishing] = React.useState(false);

  const id = React.useMemo(() => {
    if (!params) return undefined;
    const paramId = params.id;
    if (Array.isArray(paramId)) {
      return paramId[0];
    }
    return paramId;
  }, [params]);

  const shouldFetch = React.useMemo(() => {
    return !!id && typeof id === "string" && id.length > 0;
  }, [id]);

  const {
    data: assessment,
    isLoading,
    error,
    refetch,
  } = useAssessment(shouldFetch ? id : undefined);

  React.useEffect(() => {
    if (params && !id) {
      router.push("/assessments");
    }
  }, [id, params, router]);

  const handlePublish = async () => {
    if (!assessment) return;

    setIsPublishing(true);
    try {
      const response = await fetch(
        `/api/assessments/${assessment.id}/publish`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to publish assessment");
      }

      toast({
        title: "Assessment Published",
        description: "Your assessment is now available to others.",
      });

      refetch();
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to publish assessment",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  if (!params || !id || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <Card className="p-8 text-center">
          <div className="text-destructive mb-4">
            <p className="text-lg font-semibold">Failed to load assessment</p>
            <p className="text-sm text-muted-foreground mt-2">
              {error instanceof Error ? error.message : "Assessment not found"}
            </p>
          </div>

          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/assessments")}
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to Assessments
          </Button>
        </Card>
      </div>
    );
  }

  const totalQuestions =
    assessment.subjects?.reduce(
      (sum: number, s: any) => sum + (s.questionCount || 0),
      0,
    ) || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-500";
      case "DRAFT":
        return "bg-yellow-500";
      case "ARCHIVED":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "PUBLIC":
        return <Globe className="size-4" />;
      case "PRIVATE":
        return <Lock className="size-4" />;
      default:
        return <Lock className="size-4" />;
    }
  };

  const timeLimitMinutes = assessment.timeLimitSeconds
    ? Math.floor(assessment.timeLimitSeconds / 60)
    : null;

  const isOwner = assessment.isOwner !== undefined ? assessment.isOwner : false;

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Button
        variant="ghost"
        className="mb-4 -ml-2"
        onClick={() => router.push("/assessments")}
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to Assessments
      </Button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight">
              {assessment.title}
            </h1>
            <Badge variant="outline" className="capitalize">
              {assessment.type?.toLowerCase() || "quiz"}
            </Badge>
            <Badge className={getStatusColor(assessment.status)}>
              {assessment.status || "DRAFT"}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              {getVisibilityIcon(assessment.visibility)}
              {assessment.visibility}
            </Badge>
          </div>
          {assessment.description && (
            <p className="text-muted-foreground">{assessment.description}</p>
          )}
          {!isOwner && assessment.createdBy && (
            <p className="text-sm text-muted-foreground mt-1">
              Created by: {assessment.createdBy.name || "Unknown User"}
            </p>
          )}
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-2 size-4" />
              Edit
            </Button>
            {assessment.status === "DRAFT" && (
              <Button size="sm" onClick={handlePublish} disabled={isPublishing}>
                {isPublishing ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Check className="mr-2 size-4" />
                )}
                Publish
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold">{totalQuestions}</p>
            <p className="text-sm text-muted-foreground">Questions</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold">
              {assessment._count?.attempts || 0}
            </p>
            <p className="text-sm text-muted-foreground">Attempts</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold">
              {assessment.subjects?.length || 0}
            </p>
            <p className="text-sm text-muted-foreground">Subjects</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold">
              {timeLimitMinutes ? `${timeLimitMinutes}m` : "∞"}
            </p>
            <p className="text-sm text-muted-foreground">Time Limit</p>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="font-semibold mb-4">Subjects Included</h2>
          {assessment.subjects && assessment.subjects.length > 0 ? (
            <div className="space-y-3">
              {assessment.subjects.map((subject: any) => (
                <div
                  key={subject.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Layers className="size-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {subject.categorySubject?.category?.name ||
                          "Unknown Category"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {subject.categorySubject?.subject?.name ||
                          "Unknown Subject"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {subject.questionCount || 0} questions
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Randomly selected
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No subjects added yet
            </p>
          )}
        </Card>

        <div className="flex gap-3 justify-end">
          <Button variant="outline">
            <Share2 className="mr-2 size-4" />
            Share
          </Button>
          <Button asChild>
            <Link href={`/assessments/${assessment.id}/take`}>
              <Play className="mr-2 size-4" />
              Take Assessment
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
