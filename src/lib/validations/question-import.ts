import { z } from "zod";

// ============================================================
// MULTIPLE CHOICE IMPORT VALIDATION
// ============================================================

const multipleChoiceLabelSchema = z.enum(["A", "B", "C", "D"]);

const multipleChoiceChoiceSchema = z.object({
  label: multipleChoiceLabelSchema,

  content: z.string().trim().min(1, "Choice content is required."),

  isCorrect: z.boolean(),
});

const multipleChoiceQuestionSchema = z.object({
  question: z.string().trim().min(1, "Question is required."),

  choices: z
    .array(multipleChoiceChoiceSchema)
    .length(4, "A multiple-choice question must have exactly 4 choices.")
    .superRefine((choices, context) => {
      const labels = choices.map((choice) => choice.label);

      const expectedLabels = ["A", "B", "C", "D"];

      if (
        labels.length !== expectedLabels.length ||
        labels.some((label, index) => label !== expectedLabels[index])
      ) {
        context.addIssue({
          code: "custom",
          message: "Choices must be labeled A, B, C, and D in order.",
        });
      }

      const correctAnswers = choices.filter((choice) => choice.isCorrect);

      if (correctAnswers.length !== 1) {
        context.addIssue({
          code: "custom",
          message:
            "A multiple-choice question must have exactly one correct answer.",
        });
      }
    }),

  explanation: z
    .string()
    .trim()
    .min(1, "Explanation cannot be empty.")
    .optional(),

  hint: z.string().trim().min(1, "Hint cannot be empty.").optional(),
});

// ============================================================
// IMPORT JSON
// ============================================================

export const multipleChoiceImportSchema = z.object({
  questions: z
    .array(multipleChoiceQuestionSchema)
    .min(1, "At least one question is required."),
});

// ============================================================
// CATEGORY / SUBJECT
// ============================================================

export const importCategorySubjectSchema = z.object({
  categoryId: z.string().cuid().optional(),

  categoryName: z
    .string()
    .trim()
    .min(1, "Category is required.")
    .max(150, "Category name is too long."),

  subjectId: z.string().cuid().optional(),

  subjectName: z
    .string()
    .trim()
    .min(1, "Subject is required.")
    .max(150, "Subject name is too long."),
});

// ============================================================
// COMPLETE IMPORT REQUEST
// ============================================================

export const multipleChoiceImportRequestSchema = z.object({
  categoryId: z.string().cuid().optional(),

  categoryName: z
    .string()
    .trim()
    .min(1, "Category is required.")
    .max(150, "Category name is too long."),

  subjectId: z.string().cuid().optional(),

  subjectName: z
    .string()
    .trim()
    .min(1, "Subject is required.")
    .max(150, "Subject name is too long."),

  questions: multipleChoiceImportSchema.shape.questions,
});

// ============================================================
// TYPES
// ============================================================

export type MultipleChoiceImport = z.infer<typeof multipleChoiceImportSchema>;

export type MultipleChoiceQuestion = z.infer<
  typeof multipleChoiceQuestionSchema
>;

export type MultipleChoiceChoice = z.infer<typeof multipleChoiceChoiceSchema>;

export type ImportCategorySubject = z.infer<typeof importCategorySubjectSchema>;

export type MultipleChoiceImportRequest = z.infer<
  typeof multipleChoiceImportRequestSchema
>;
