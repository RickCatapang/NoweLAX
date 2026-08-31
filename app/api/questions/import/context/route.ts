// import { NextResponse } from "next/server";

// import prisma from "@/src/lib/prisma";
// import { auth } from "@/src/lib/auth";

// interface RequestBody {
//   categoryId?: unknown;
//   categoryName?: unknown;
//   subjectId?: unknown;
//   subjectName?: unknown;
// }

// export async function POST(request: Request) {
//   try {
//     // ============================================================
//     // AUTHENTICATION
//     // ============================================================

//     const session = await auth.api.getSession({
//       headers: request.headers,
//     });

//     if (!session?.user) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Unauthorized.",
//         },
//         {
//           status: 401,
//         },
//       );
//     }

//     const userId = session.user.id;

//     // ============================================================
//     // REQUEST BODY
//     // ============================================================

//     const body = (await request.json()) as RequestBody;

//     const categoryId =
//       typeof body.categoryId === "string" ? body.categoryId.trim() : undefined;

//     const categoryName =
//       typeof body.categoryName === "string"
//         ? body.categoryName.trim()
//         : undefined;

//     const subjectId =
//       typeof body.subjectId === "string" ? body.subjectId.trim() : undefined;

//     const subjectName =
//       typeof body.subjectName === "string"
//         ? body.subjectName.trim()
//         : undefined;

//     // ============================================================
//     // BASIC VALIDATION
//     // ============================================================

//     if (!categoryId && !categoryName) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Category is required.",
//         },
//         {
//           status: 400,
//         },
//       );
//     }

//     if (!subjectId && !subjectName) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Subject is required.",
//         },
//         {
//           status: 400,
//         },
//       );
//     }

//     // ============================================================
//     // RESOLVE CATEGORY
//     // ============================================================

//     const category = await prisma.category.findFirst({
//       where: categoryId
//         ? {
//             id: categoryId,
//           }
//         : {
//             name: categoryName,
//           },
//       select: {
//         id: true,
//         name: true,
//       },
//     });

//     let resolvedCategory = category;

//     // ------------------------------------------------------------
//     // CREATE CATEGORY IF NECESSARY
//     // ------------------------------------------------------------

//     if (!resolvedCategory) {
//       if (!categoryName) {
//         return NextResponse.json(
//           {
//             success: false,
//             message: "The selected category does not exist.",
//           },
//           {
//             status: 404,
//           },
//         );
//       }

//       try {
//         resolvedCategory = await prisma.category.create({
//           data: {
//             name: categoryName,
//             type: "GENERAL",
//           },
//           select: {
//             id: true,
//             name: true,
//           },
//         });
//       } catch (error) {
//         // Handle unique category name race condition.
//         const existingCategory = await prisma.category.findUnique({
//           where: {
//             name: categoryName,
//           },
//           select: {
//             id: true,
//             name: true,
//           },
//         });

//         if (!existingCategory) {
//           throw error;
//         }

//         resolvedCategory = existingCategory;
//       }
//     }

//     // ============================================================
//     // RESOLVE SUBJECT
//     // ============================================================

//     const subject = await prisma.subject.findFirst({
//       where: subjectId
//         ? {
//             id: subjectId,
//           }
//         : {
//             name: subjectName,
//           },
//       select: {
//         id: true,
//         name: true,
//       },
//     });

//     let resolvedSubject = subject;

//     // ------------------------------------------------------------
//     // CREATE SUBJECT IF NECESSARY
//     // ------------------------------------------------------------

//     if (!resolvedSubject) {
//       if (!subjectName) {
//         return NextResponse.json(
//           {
//             success: false,
//             message: "The selected subject does not exist.",
//           },
//           {
//             status: 404,
//           },
//         );
//       }

//       try {
//         resolvedSubject = await prisma.subject.create({
//           data: {
//             name: subjectName,
//           },
//           select: {
//             id: true,
//             name: true,
//           },
//         });
//       } catch (error) {
//         // Handle unique subject name race condition.
//         const existingSubject = await prisma.subject.findUnique({
//           where: {
//             name: subjectName,
//           },
//           select: {
//             id: true,
//             name: true,
//           },
//         });

//         if (!existingSubject) {
//           throw error;
//         }

//         resolvedSubject = existingSubject;
//       }
//     }

//     // ============================================================
//     // VERIFY OWNED/VALID CONTEXT
//     // ============================================================
//     //
//     // Category and Subject are global reference data.
//     //
//     // The user does not "own" them.
//     //
//     // We simply resolve/create the valid global records and
//     // establish their relationship.
//     //
//     // ============================================================

//     const categorySubject = await prisma.categorySubject.upsert({
//       where: {
//         categoryId_subjectId: {
//           categoryId: resolvedCategory.id,
//           subjectId: resolvedSubject.id,
//         },
//       },
//       update: {},
//       create: {
//         categoryId: resolvedCategory.id,
//         subjectId: resolvedSubject.id,
//       },
//       select: {
//         id: true,
//         categoryId: true,
//         subjectId: true,
//       },
//     });

//     // ============================================================
//     // RESPONSE
//     // ============================================================

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Import context prepared successfully.",
//         data: {
//           category: resolvedCategory,
//           subject: resolvedSubject,
//           categorySubject,
//         },
//       },
//       {
//         status: 200,
//       },
//     );
//   } catch (error) {
//     console.error("Failed to create import context:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to prepare import context.",
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }
// app/api/questions/import/context/route.ts

import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";
import { normalizeString } from "@/src/lib/utils/normalize";

interface RequestBody {
  categoryId?: unknown;
  categoryName?: unknown;
  subjectId?: unknown;
  subjectName?: unknown;
  questions?: unknown; // Add questions array
}

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

    const body = (await request.json()) as RequestBody;

    const categoryId =
      typeof body.categoryId === "string" ? body.categoryId.trim() : undefined;

    const categoryName =
      typeof body.categoryName === "string"
        ? normalizeString(body.categoryName)
        : undefined;

    const subjectId =
      typeof body.subjectId === "string" ? body.subjectId.trim() : undefined;

    const subjectName =
      typeof body.subjectName === "string"
        ? normalizeString(body.subjectName)
        : undefined;

    const questions = body.questions as any[] | undefined;

    // ============================================================
    // BASIC VALIDATION
    // ============================================================

    if (!categoryId && !categoryName) {
      return NextResponse.json(
        {
          success: false,
          message: "Category is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!subjectId && !subjectName) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!questions || questions.length === 0) {
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
    // RESOLVE CATEGORY (with normalization)
    // ============================================================

    let resolvedCategory;

    if (categoryId) {
      // Try to find by ID first
      resolvedCategory = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { id: true, name: true },
      });

      if (!resolvedCategory) {
        return NextResponse.json(
          {
            success: false,
            message: "The selected category does not exist.",
          },
          {
            status: 404,
          },
        );
      }
    } else if (categoryName) {
      // Try to find by normalized name
      resolvedCategory = await prisma.category.findFirst({
        where: {
          name: {
            equals: categoryName,
            mode: "insensitive", // Case-insensitive search
          },
        },
        select: { id: true, name: true },
      });

      // If not found, create new category with normalized name
      if (!resolvedCategory) {
        // Check for race condition - another request might have created it
        const existingCategory = await prisma.category.findUnique({
          where: { name: categoryName },
          select: { id: true, name: true },
        });

        if (existingCategory) {
          resolvedCategory = existingCategory;
        } else {
          resolvedCategory = await prisma.category.create({
            data: {
              name: categoryName, // Already normalized
              type: "GENERAL",
            },
            select: { id: true, name: true },
          });
        }
      }
    }

    if (!resolvedCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to resolve or create category.",
        },
        {
          status: 500,
        },
      );
    }

    // ============================================================
    // RESOLVE SUBJECT (with normalization)
    // ============================================================

    let resolvedSubject;

    if (subjectId) {
      // Try to find by ID first
      resolvedSubject = await prisma.subject.findUnique({
        where: { id: subjectId },
        select: { id: true, name: true },
      });

      if (!resolvedSubject) {
        return NextResponse.json(
          {
            success: false,
            message: "The selected subject does not exist.",
          },
          {
            status: 404,
          },
        );
      }
    } else if (subjectName) {
      // Try to find by normalized name
      resolvedSubject = await prisma.subject.findFirst({
        where: {
          name: {
            equals: subjectName,
            mode: "insensitive", // Case-insensitive search
          },
        },
        select: { id: true, name: true },
      });

      // If not found, create new subject with normalized name
      if (!resolvedSubject) {
        // Check for race condition
        const existingSubject = await prisma.subject.findUnique({
          where: { name: subjectName },
          select: { id: true, name: true },
        });

        if (existingSubject) {
          resolvedSubject = existingSubject;
        } else {
          resolvedSubject = await prisma.subject.create({
            data: {
              name: subjectName, // Already normalized
            },
            select: { id: true, name: true },
          });
        }
      }
    }

    if (!resolvedSubject) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to resolve or create subject.",
        },
        {
          status: 500,
        },
      );
    }

    // ============================================================
    // CREATE OR GET CATEGORY-SUBJECT RELATIONSHIP
    // ============================================================

    const categorySubject = await prisma.categorySubject.upsert({
      where: {
        categoryId_subjectId: {
          categoryId: resolvedCategory.id,
          subjectId: resolvedSubject.id,
        },
      },
      update: {},
      create: {
        categoryId: resolvedCategory.id,
        subjectId: resolvedSubject.id,
      },
      select: {
        id: true,
        categoryId: true,
        subjectId: true,
      },
    });

    // ============================================================
    // CREATE IMPORT BATCH
    // ============================================================

    const importBatch = await prisma.importBatch.create({
      data: {
        userId: userId,
        sourceType: "JSON",
        inputMode: "PASTED_TEXT",
        questionType: "MULTIPLE_CHOICE",
        status: "PROCESSING",
        totalItems: questions.length,
        importedItems: 0,
        failedItems: 0,
      },
    });

    // ============================================================
    // CREATE QUESTIONS AND IMPORT ITEMS
    // ============================================================

    let importedCount = 0;
    let failedCount = 0;
    const createdQuestions = [];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      try {
        // Create the question
        const question = await prisma.question.create({
          data: {
            categorySubjectId: categorySubject.id,
            createdById: userId,
            visibility: "PUBLIC", // Default to public
            status: "PUBLISHED", // Default to published
            allowReuse: true, // Default to reusable
            source: "JSON_IMPORT",
            importBatchId: importBatch.id,
          },
        });

        // Create the question version
        const questionVersion = await prisma.questionVersion.create({
          data: {
            questionId: question.id,
            version: 1,
            type: "MULTIPLE_CHOICE",
            questionText: q.question,
            hint: q.hint || null,
            explanation: q.explanation || null,
          },
        });

        // Create choices
        if (q.choices && Array.isArray(q.choices)) {
          for (const choice of q.choices) {
            await prisma.choice.create({
              data: {
                questionVersionId: questionVersion.id,
                label: choice.label,
                content: choice.content,
                isCorrect: choice.isCorrect,
                sortOrder: q.choices.indexOf(choice),
              },
            });
          }
        }

        // Create import batch item
        await prisma.importBatchItem.create({
          data: {
            importBatchId: importBatch.id,
            rowNumber: i + 1,
            status: "IMPORTED",
            rawData: q,
            questionId: question.id,
          },
        });

        createdQuestions.push(question);
        importedCount++;
      } catch (error) {
        console.error(`Failed to import question ${i + 1}:`, error);
        failedCount++;

        // Create failed import item
        await prisma.importBatchItem.create({
          data: {
            importBatchId: importBatch.id,
            rowNumber: i + 1,
            status: "FAILED",
            rawData: q,
            errorMessage:
              error instanceof Error ? error.message : "Unknown error",
          },
        });
      }
    }

    // ============================================================
    // UPDATE IMPORT BATCH
    // ============================================================

    await prisma.importBatch.update({
      where: { id: importBatch.id },
      data: {
        status:
          failedCount === 0
            ? "COMPLETED"
            : failedCount === questions.length
              ? "FAILED"
              : "PARTIAL",
        importedItems: importedCount,
        failedItems: failedCount,
        completedAt: new Date(),
      },
    });

    // ============================================================
    // RESPONSE
    // ============================================================

    return NextResponse.json(
      {
        success: true,
        message: "Import completed successfully.",
        data: {
          category: resolvedCategory,
          subject: resolvedSubject,
          categorySubject,
          importBatch: {
            id: importBatch.id,
            totalItems: questions.length,
            importedItems: importedCount,
            failedItems: failedCount,
          },
          questions: createdQuestions,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Failed to create import context:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to prepare import context.",
      },
      {
        status: 500,
      },
    );
  }
}
