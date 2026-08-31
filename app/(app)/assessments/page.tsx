// "use client";

// import Link from "next/link";
// import { Plus, FileText, Clock, Users, Loader2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { useAssessments } from "@/hooks/use-assessment";

// export default function AssessmentsPage() {
//   const { data: assessments, isLoading, error } = useAssessments();

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "PUBLISHED":
//         return "bg-green-500";
//       case "DRAFT":
//         return "bg-yellow-500";
//       case "ARCHIVED":
//         return "bg-gray-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <Loader2 className="size-8 animate-spin text-muted-foreground" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto max-w-6xl py-8 px-4">
//         <Card className="p-8 text-center text-destructive">
//           <p>Failed to load assessments</p>
//           <p className="text-sm text-muted-foreground">
//             {error instanceof Error ? error.message : "Please try again"}
//           </p>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto max-w-6xl py-8 px-4">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">My Assessments</h1>
//           <p className="text-muted-foreground">
//             Create and manage your assessments
//           </p>
//         </div>
//         <Link href="/assessments/create">
//           <Button>
//             <Plus className="mr-2 size-4" />
//             Create Assessment
//           </Button>
//         </Link>
//       </div>

//       {!assessments || assessments.length === 0 ? (
//         <Card className="p-12 text-center">
//           <FileText className="size-12 mx-auto text-muted-foreground mb-4" />
//           <h3 className="text-lg font-semibold mb-2">No assessments yet</h3>
//           <p className="text-muted-foreground mb-4">
//             Create your first assessment by selecting questions from your
//             question bank.
//           </p>
//           <Link href="/assessments/create">
//             <Button>Create Assessment</Button>
//           </Link>
//         </Card>
//       ) : (
//         <div className="grid gap-4">
//           {assessments.map((assessment) => {
//             const totalQuestions = assessment.subjects.reduce(
//               (sum, s) => sum + (s.questionCount || 0),
//               0,
//             );

//             const timeLimitMinutes = assessment.timeLimitSeconds
//               ? Math.floor(assessment.timeLimitSeconds / 60)
//               : null;

//             return (
//               <Link key={assessment.id} href={`/assessments/${assessment.id}`}>
//                 <Card className="p-6 hover:border-primary/50 transition-colors">
//                   <div className="flex items-start justify-between">
//                     <div className="space-y-1">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <h3 className="text-lg font-semibold">
//                           {assessment.title}
//                         </h3>
//                         <Badge variant="outline" className="capitalize text-xs">
//                           {assessment.type.toLowerCase()}
//                         </Badge>
//                         <Badge className={getStatusColor(assessment.status)}>
//                           {assessment.status}
//                         </Badge>
//                       </div>
//                       {assessment.description && (
//                         <p className="text-sm text-muted-foreground line-clamp-2">
//                           {assessment.description}
//                         </p>
//                       )}
//                       <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
//                         <span className="flex items-center gap-1">
//                           <FileText className="size-3" />
//                           {totalQuestions} questions
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <Users className="size-3" />
//                           {assessment._count.attempts} attempts
//                         </span>
//                         {timeLimitMinutes && (
//                           <span className="flex items-center gap-1">
//                             <Clock className="size-3" />
//                             {timeLimitMinutes} min
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <div className="text-sm text-muted-foreground">
//                       {new Date(assessment.createdAt).toLocaleDateString()}
//                     </div>
//                   </div>
//                 </Card>
//               </Link>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }
// app/(dashboard)/assessments/page.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import {
  Plus,
  FileText,
  Clock,
  Users,
  Globe,
  Lock,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAssessments } from "@/hooks/use-assessment";

interface AssessmentWithOwner {
  id: string;
  title: string;
  description: string | null;
  type: string;
  mode: string;
  timeLimitSeconds: number | null;
  visibility: string;
  status: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  subjects: any[];
  _count: {
    attempts: number;
    questions: number;
  };
  isOwner?: boolean;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AssessmentsPage() {
  const { data: assessments, isLoading, error } = useAssessments();

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
        return <Globe className="size-3" />;
      case "PRIVATE":
        return <Lock className="size-3" />;
      default:
        return <Lock className="size-3" />;
    }
  };

  const ownedAssessments =
    assessments?.filter((a: AssessmentWithOwner) => a.isOwner) || [];
  const publicAssessments =
    assessments?.filter(
      (a: AssessmentWithOwner) => !a.isOwner && a.visibility === "PUBLIC",
    ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-6xl py-8 px-4">
        <Card className="p-8 text-center text-destructive">
          <p>Failed to load assessments</p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Please try again"}
          </p>
        </Card>
      </div>
    );
  }

  const renderAssessmentCard = (assessment: AssessmentWithOwner) => {
    const totalQuestions =
      assessment.subjects?.reduce(
        (sum: number, s: any) => sum + (s.questionCount || 0),
        0,
      ) || 0;

    const timeLimitMinutes = assessment.timeLimitSeconds
      ? Math.floor(assessment.timeLimitSeconds / 60)
      : null;

    return (
      <Link key={assessment.id} href={`/assessments/${assessment.id}`}>
        <Card className="p-6 hover:border-primary/50 transition-colors">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-semibold">{assessment.title}</h3>
                <Badge variant="outline" className="capitalize text-xs">
                  {assessment.type?.toLowerCase() || "quiz"}
                </Badge>
                <Badge className={getStatusColor(assessment.status)}>
                  {assessment.status}
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  {getVisibilityIcon(assessment.visibility)}
                  {assessment.visibility}
                </Badge>
                {!assessment.isOwner && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                  >
                    Public
                  </Badge>
                )}
              </div>
              {assessment.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {assessment.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <FileText className="size-3" />
                  {totalQuestions} questions
                </span>
                <span className="flex items-center gap-1">
                  <Users className="size-3" />
                  {assessment._count?.attempts || 0} attempts
                </span>
                {timeLimitMinutes && (
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {timeLimitMinutes} min
                  </span>
                )}
                {assessment.isOwner && (
                  <span className="text-xs text-muted-foreground">
                    Created by you
                  </span>
                )}
                {!assessment.isOwner && assessment.createdBy && (
                  <span className="text-xs text-muted-foreground">
                    By: {assessment.createdBy.name || "Unknown"}
                  </span>
                )}
              </div>
            </div>
            <div className="text-sm text-muted-foreground shrink-0 ml-4">
              {new Date(assessment.createdAt).toLocaleDateString()}
            </div>
          </div>
        </Card>
      </Link>
    );
  };

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
          <p className="text-muted-foreground">
            Create and manage your assessments, or take public ones
          </p>
        </div>
        <Link href="/assessments/create">
          <Button>
            <Plus className="mr-2 size-4" />
            Create Assessment
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="w-full flex-center flex-col">
        <TabsList className="inline-flex h-9 w-sm items-center justify-start rounded-lg bg-primary/10 backdrop-blur-sm p-1 text-muted-foreground">
          <TabsTrigger
            value="all"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
          >
            All ({assessments?.length || 0})
          </TabsTrigger>
          <TabsTrigger
            value="owned"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
          >
            My Assessments ({ownedAssessments.length})
          </TabsTrigger>
          <TabsTrigger
            value="public"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
          >
            Public ({publicAssessments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="owned" className="mt-6">
          {ownedAssessments.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="size-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No assessments yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first assessment by selecting questions from your
                question bank.
              </p>
              <Link href="/assessments/create">
                <Button>Create Assessment</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-4">
              {ownedAssessments.map(renderAssessmentCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="public" className="mt-6">
          {publicAssessments.length === 0 ? (
            <Card className="p-12 text-center">
              <Globe className="size-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No public assessments
              </h3>
              <p className="text-muted-foreground">
                Other users haven't published any assessments yet.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {publicAssessments.map(renderAssessmentCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          {!assessments || assessments.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="size-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No assessments</h3>
              <p className="text-muted-foreground">
                No assessments available. Create one or wait for others to
                publish.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {assessments.map((assessment: AssessmentWithOwner) =>
                renderAssessmentCard(assessment),
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
