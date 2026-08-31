import { NextResponse } from "next/server";

import prisma from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";
import { multipleChoiceImportSchema } from "@/src/lib/validations/question-import";

export async function POST(request: Request) {
  try {
    // ============================================================
    // AUTHENTICATION
    // ============================================================

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    const userId = session.user.id;

    // ============================================================
    // REQUEST BODY
    // ============================================================

    const body = await request.json();

    const categorySubjectId =
      typeof body.categorySubjectId === "string"
        ? body.categorySubjectId.trim()
        : "";

    if (!categorySubjectId) {
      return NextResponse.json(
        {
          success: false,
          message: "Category subject ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    // ============================================================
    // VALIDATE QUESTIONS
    // ============================================================

    const parsed = multipleChoiceImportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid questions.",
          errors: parsed.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    const { questions } = parsed.data;

    if (questions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one question is required.",
        },
        {
          status: 400,
        },
      );
    }

    // ============================================================
    // VERIFY CATEGORY/SUBJECT CONTEXT
    // ============================================================

    const categorySubject = await prisma.categorySubject.findUnique({
      where: {
        id: categorySubjectId,
      },
      include: {
        category: true,
        subject: true,
      },
    });

    if (!categorySubject) {
      return NextResponse.json(
        {
          success: false,
          message: "The selected category and subject context does not exist.",
        },
        {
          status: 404,
        },
      );
    }

    // ============================================================
    // IMPORT
    // ============================================================

    const result = await prisma.$transaction(async (tx) => {
      // ----------------------------------------------------------
      // CREATE IMPORT BATCH
      // ----------------------------------------------------------

      const importBatch = await tx.importBatch.create({
        data: {
          userId,

          sourceType: "JSON",

          inputMode: "PASTED_TEXT",

          questionType: "MULTIPLE_CHOICE",

          status: "PROCESSING",

          totalItems: questions.length,

          importedItems: 0,

          failedItems: 0,
        },
      });

      const createdQuestions = [];

      // ----------------------------------------------------------
      // CREATE QUESTIONS
      // ----------------------------------------------------------

      for (let index = 0; index < questions.length; index++) {
        const question = questions[index];

        const createdQuestion = await tx.question.create({
          data: {
            categorySubjectId,

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

                questionText: question.question,

                hint: question.hint ?? null,

                explanation: question.explanation ?? null,

                choices: {
                  create: question.choices.map((choice, choiceIndex) => ({
                    label: choice.label,

                    content: choice.content,

                    isCorrect: choice.isCorrect,

                    sortOrder: choiceIndex,
                  })),
                },
              },
            },
          },

          include: {
            versions: {
              include: {
                choices: true,
              },
            },

            categorySubject: {
              include: {
                category: true,
                subject: true,
              },
            },
          },
        });

        // --------------------------------------------------------
        // CREATE IMPORT ITEM
        // --------------------------------------------------------

        await tx.importBatchItem.create({
          data: {
            importBatchId: importBatch.id,

            rowNumber: index + 1,

            status: "IMPORTED",

            rawData: question,

            questionId: createdQuestion.id,
          },
        });

        createdQuestions.push(createdQuestion);
      }

      // ----------------------------------------------------------
      // COMPLETE IMPORT
      // ----------------------------------------------------------

      const completedBatch = await tx.importBatch.update({
        where: {
          id: importBatch.id,
        },

        data: {
          status: "COMPLETED",

          importedItems: createdQuestions.length,

          failedItems: 0,

          completedAt: new Date(),
        },
      });

      return {
        importBatch: completedBatch,

        questions: createdQuestions,
      };
    });

    // ============================================================
    // RESPONSE
    // ============================================================

    return NextResponse.json(
      {
        success: true,

        message: `${result.questions.length} ${
          result.questions.length === 1 ? "question" : "questions"
        } imported successfully.`,

        data: {
          importBatchId: result.importBatch.id,

          questionCount: result.questions.length,

          questionIds: result.questions.map((question) => question.id),

          categorySubject: {
            id: categorySubject.id,

            categoryId: categorySubject.categoryId,

            categoryName: categorySubject.category.name,

            subjectId: categorySubject.subjectId,

            subjectName: categorySubject.subject.name,
          },
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Failed to import questions:", error);

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to import questions.",
      },
      {
        status: 500,
      },
    );
  }
}
