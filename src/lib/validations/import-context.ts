import { z } from "zod";

export const importContextSchema = z
  .object({
    categoryId: z.string().min(1).optional(),
    categoryName: z.string().trim().min(1).optional(),

    subjectId: z.string().min(1).optional(),
    subjectName: z.string().trim().min(1).optional(),
  })
  .superRefine((data, context) => {
    if (!data.categoryId && !data.categoryName) {
      context.addIssue({
        code: "custom",
        path: ["categoryName"],
        message: "Select an existing category or enter a new category.",
      });
    }

    if (!data.subjectId && !data.subjectName) {
      context.addIssue({
        code: "custom",
        path: ["subjectName"],
        message: "Select an existing subject or enter a new subject.",
      });
    }
  });

export type ImportContextInput = z.infer<typeof importContextSchema>;
