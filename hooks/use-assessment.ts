// // // hooks/use-assessment.ts

// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// interface CreateAssessmentInput {
//   title: string;
//   description: string | null;
//   type: "QUIZ" | "EXAM";
//   mode: "FIXED" | "DYNAMIC";
//   timeLimitSeconds: number | null;
//   subjects: Array<{
//     categoryId: string;
//     subjectId: string;
//     questionCount: number;
//   }>;
// }

// interface Assessment {
//   id: string;
//   title: string;
//   description: string | null;
//   type: string;
//   mode: string;
//   timeLimitSeconds: number | null;
//   visibility: string;
//   status: string;
//   createdById: string;
//   createdAt: string;
//   updatedAt: string;
//   subjects: any[];
//   _count: {
//     attempts: number;
//     questions: number;
//   };
// }

// export function useCreateAssessment() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (input: CreateAssessmentInput): Promise<Assessment> => {
//       const response = await fetch("/api/assessments", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(input),
//       });

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(result.message || "Failed to create assessment");
//       }

//       return result.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["assessments"] });
//     },
//   });
// }

// export function useAssessments() {
//   return useQuery({
//     queryKey: ["assessments"],
//     queryFn: async (): Promise<Assessment[]> => {
//       const response = await fetch("/api/assessments");

//       if (!response.ok) {
//         throw new Error("Failed to fetch assessments");
//       }

//       const result = await response.json();

//       if (!result.success) {
//         throw new Error(result.message || "Failed to fetch assessments");
//       }

//       return result.data;
//     },
//     staleTime: 0, // Always refetch when key changes
//   });
// }

// export function useAssessment(id: string | undefined) {
//   return useQuery({
//     queryKey: ["assessment", id],
//     queryFn: async (): Promise<Assessment> => {
//       // Check if ID exists
//       if (!id) {
//         throw new Error("Assessment ID is required");
//       }

//       console.log("🔄 Fetching assessment with ID:", id);

//       const response = await fetch(`/api/assessments/${id}`);

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || "Failed to fetch assessment");
//       }

//       const result = await response.json();

//       if (!result.success) {
//         throw new Error(result.message || "Failed to fetch assessment");
//       }

//       console.log("✅ Assessment data received for ID:", id);
//       return result.data;
//     },
//     // Only enable the query if we have an ID
//     enabled: !!id,
//     staleTime: 0,
//     gcTime: 1000 * 60 * 5,
//     refetchOnMount: true,
//     refetchOnWindowFocus: false,
//   });
// }
// hooks/use-assessment.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateAssessmentInput {
  title: string;
  description: string | null;
  type: "QUIZ" | "EXAM";
  mode: "FIXED" | "DYNAMIC";
  timeLimitSeconds: number | null;
  subjects: Array<{
    categoryId: string;
    subjectId: string;
    questionCount: number;
  }>;
}

interface Assessment {
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

export function useCreateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateAssessmentInput): Promise<Assessment> => {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create assessment");
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });
}

export function useAssessments() {
  return useQuery({
    queryKey: ["assessments"],
    queryFn: async (): Promise<Assessment[]> => {
      const response = await fetch("/api/assessments");

      if (!response.ok) {
        throw new Error("Failed to fetch assessments");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch assessments");
      }

      return result.data;
    },
    staleTime: 0,
  });
}

export function useAssessment(id: string | undefined) {
  return useQuery({
    queryKey: ["assessment", id],
    queryFn: async (): Promise<Assessment> => {
      if (!id) {
        throw new Error("Assessment ID is required");
      }

      console.log("🔄 Fetching assessment with ID:", id);

      const response = await fetch(`/api/assessments/${id}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch assessment");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch assessment");
      }

      console.log("✅ Assessment data received for ID:", id);
      return result.data;
    },
    enabled: !!id,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}
