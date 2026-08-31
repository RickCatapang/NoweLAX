import { z } from "zod";

export const questionImportDestinationSchema = z.object({
  categoryId: z.string().cuid().min(1, "Category is required."),
  subjectId: z.string().cuid().min(1, "Subject is required."),
});

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required.")
    .max(100, "Category name is too long."),
});

export const createSubjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Subject name is required.")
    .max(100, "Subject name is too long."),
});

export type QuestionImportDestination = z.infer<
  typeof questionImportDestinationSchema
>;
