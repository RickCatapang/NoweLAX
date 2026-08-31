"use client";

import { useQuery } from "@tanstack/react-query";

import { getSubjects, type Subject } from "@/src/lib/api/subjects";

export function useSubjects(categoryId?: string) {
  return useQuery<Subject[], Error>({
    queryKey: ["categories", categoryId, "subjects"],

    queryFn: () => {
      if (!categoryId) {
        throw new Error("Category ID is required.");
      }

      return getSubjects(categoryId);
    },

    enabled: Boolean(categoryId),
  });
}
