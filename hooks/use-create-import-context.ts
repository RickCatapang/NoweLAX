// hooks/use-create-import-context.ts

import { useMutation } from "@tanstack/react-query";

interface CreateImportContextInput {
  categoryId?: string;
  categoryName?: string;
  subjectId?: string;
  subjectName?: string;
  questions?: any[];
}

interface CreateImportContextResult {
  category: {
    id: string;
    name: string;
  };
  subject: {
    id: string;
    name: string;
  };
  categorySubject: {
    id: string;
    categoryId: string;
    subjectId: string;
  };
  importBatch: {
    id: string;
    totalItems: number;
    importedItems: number;
    failedItems: number;
    status: string;
  };
  total: number;
  imported: number;
  failed: number;
  status: string;
  importBatchId: string;
  importedQuestions?: string[];
  failedItems?: Array<{ row: number; error: string }>;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: CreateImportContextResult;
}

export function useCreateImportContext() {
  return useMutation({
    mutationFn: async (
      input: CreateImportContextInput,
    ): Promise<CreateImportContextResult> => {
      const response = await fetch("/api/questions/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.message || "Failed to import questions.");
      }

      return result.data;
    },
  });
}
