"use client";

import { useQuery } from "@tanstack/react-query";

import { getCategories, type Category } from "@/src/lib/api/categories";

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}
