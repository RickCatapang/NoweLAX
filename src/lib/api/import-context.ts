import type { ImportContextInput } from "@/src/lib/validations/import-context";

export interface ImportContextResponse {
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
  };
}

interface ImportContextApiResponse {
  success: boolean;
  data?: ImportContextResponse;
  message?: string;
}

export async function createImportContext(
  input: ImportContextInput,
): Promise<ImportContextResponse> {
  const response = await fetch("/api/question-import/context", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(input),
  });

  const result: ImportContextApiResponse = await response.json();

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.message ?? "Failed to prepare import context.");
  }

  return result.data;
}
