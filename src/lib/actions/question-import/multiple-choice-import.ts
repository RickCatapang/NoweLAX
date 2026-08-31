"use server";

import {
  multipleChoiceImportSchema,
  type MultipleChoiceImport,
} from "@/src/lib/validations/question-import";

import { questionImportDestinationSchema } from "@/src/lib/validations/question-import-destination";

// IMPORTANT:
// Replace this with however you currently retrieve the
// authenticated Better Auth user.
import { auth } from "@/src/lib/auth";
import prisma from "../../prisma";

type ImportMultipleChoiceResult =
  | {
      success: true;
      importBatchId: string;
      importedCount: number;
    }
  | {
      success: false;
      message: string;
    };

function normalizeName(value: string) {
  return value.trim().toLowerCase();
}

export async function importMultipleChoiceQuestions(
  data: MultipleChoiceImport,
  destination: {
    categoryId: string;
    subjectId: string;
  },
): Promise<ImportMultipleChoiceResult> {
  // ----------------------------------------------------------
  // AUTHENTICATION
  // ----------------------------------------------------------

  const session = await auth.api.getSession({
    headers: await import("next/headers").then(({ headers }) => headers()),
  });

  if (!session?.user) {
    return {
      success: false,
      message: "You must be logged in to import questions.",
    };
  }

  const userId = session.user.id;

  // ----------------------------------------------------------
  // VALIDATE INPUT
  // ----------------------------------------------------------

  const questionsResult = multipleChoiceImportSchema.safeParse(data);

  if (!questionsResult.success) {
    return {
      success: false,
      message: "The imported questions are invalid.",
    };
  }

  const destinationResult =
    questionImportDestinationSchema.safeParse(destination);

  if (!destinationResult.success) {
    return {
      success: false,
      message: "Please select a valid category and subject.",
    };
  }

  const { categoryId, subjectId } = destinationResult.data;

  // ----------------------------------------------------------
  // VERIFY CATEGORY + SUBJECT
  // ----------------------------------------------------------

  const categorySubject = await prisma.categorySubject.findUnique({
    where: {
      categoryId_subjectId: {
        categoryId,
        subjectId,
      },
    },
    include: {
      category: true,
      subject: true,
    },
  });

  if (!categorySubject) {
    return {
      success: false,
      message: "The selected category and subject combination does not exist.",
    };
  }

  // ----------------------------------------------------------
  // CREATE IMPORT BATCH + QUESTIONS
  // ----------------------------------------------------------

  try {
    const result = await prisma.$transaction(async (tx) => {
      const importBatch = await tx.importBatch.create({
        data: {
          userId,
          sourceType: "JSON",
          inputMode: "PASTED_TEXT",
          questionType: "MULTIPLE_CHOICE",
          status: "PROCESSING",
          totalItems: questionsResult.data.questions.length,
        },
      });

      let importedCount = 0;

      for (const [
        index,
        importedQuestion,
      ] of questionsResult.data.questions.entries()) {
        const question = await tx.question.create({
          data: {
            categorySubjectId: categorySubject.id,
            createdById: userId,

            visibility: "PRIVATE",
            status: "DRAFT",

            allowReuse: false,

            source: "JSON_IMPORT",

            importBatchId: importBatch.id,

            versions: {
              create: {
                version: 1,
                type: "MULTIPLE_CHOICE",

                questionText: importedQuestion.question,

                hint: importedQuestion.hint,
                explanation: importedQuestion.explanation,

                choices: {
                  create: importedQuestion.choices.map(
                    (choice, choiceIndex) => ({
                      label: choice.label,
                      content: choice.content,
                      isCorrect: choice.isCorrect,
                      sortOrder: choiceIndex,
                    }),
                  ),
                },
              },
            },
          },
        });

        await tx.importBatchItem.create({
          data: {
            importBatchId: importBatch.id,

            rowNumber: index + 1,

            status: "IMPORTED",

            rawData: importedQuestion,

            questionId: question.id,
          },
        });

        importedCount++;
      }

      await tx.importBatch.update({
        where: {
          id: importBatch.id,
        },
        data: {
          status: "COMPLETED",
          importedItems: importedCount,
          failedItems: 0,
          completedAt: new Date(),
        },
      });

      return {
        importBatchId: importBatch.id,
        importedCount,
      };
    });

    return {
      success: true,
      ...result,
    };
  } catch (error) {
    console.error("Multiple-choice import failed:", error);

    return {
      success: false,
      message: "Failed to import questions. Please try again.",
    };
  }
}
