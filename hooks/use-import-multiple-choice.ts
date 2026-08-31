"use client";

import { useMutation } from "@tanstack/react-query";

import type { MultipleChoiceImport } from "@/src/lib/validations/question-import";

interface ImportMultipleChoiceInput {
  categorySubjectId: string;
  questions: MultipleChoiceImport["questions"];
}

interface ImportMultipleChoiceResult {
  importBatchId: string;
  questionCount: number;
  questionIds: string[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: ImportMultipleChoiceResult;
}

export function useImportMultipleChoice() {
  return useMutation({
    mutationFn: async (
      input: ImportMultipleChoiceInput,
    ): Promise<ImportMultipleChoiceResult> => {
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
