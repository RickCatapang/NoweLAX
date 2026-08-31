// app/api/questions/import/route.ts

import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";
import { multipleChoiceImportSchema } from "@/src/lib/validations/question-import";
import { normalizeString } from "@/src/lib/utils/normalize";

export async function POST(request: Request) {
  try {
    // 1. Authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 },
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { categoryId, categoryName, subjectId, subjectName, questions } =
      body;

    // 2. Validate questions
    const validated = multipleChoiceImportSchema.safeParse({ questions });
    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid questions data",
          errors: validated.error.issues,
        },
        { status: 400 },
      );
    }

    // 3. Resolve/Create Category
    let category = null;
    if (categoryId) {
      category = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        return NextResponse.json(
          { success: false, message: "Category not found" },
          { status: 404 },
        );
      }
    } else if (categoryName) {
      const normalized = normalizeString(categoryName);
      category = await prisma.category.findFirst({
        where: { name: { equals: normalized, mode: "insensitive" } },
      });

      if (!category) {
        category = await prisma.category.create({
          data: { name: normalized, type: "GENERAL" },
        });
      }
    }

    // 4. Resolve/Create Subject
    let subject = null;
    if (subjectId) {
      subject = await prisma.subject.findUnique({
        where: { id: subjectId },
      });
      if (!subject) {
        return NextResponse.json(
          { success: false, message: "Subject not found" },
          { status: 404 },
        );
      }
    } else if (subjectName) {
      const normalized = normalizeString(subjectName);
      subject = await prisma.subject.findFirst({
        where: { name: { equals: normalized, mode: "insensitive" } },
      });

      if (!subject) {
        subject = await prisma.subject.create({
          data: { name: normalized },
        });
      }
    }

    // 5. Check if both category and subject exist
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category is required" },
        { status: 400 },
      );
    }

    if (!subject) {
      return NextResponse.json(
        { success: false, message: "Subject is required" },
        { status: 400 },
      );
    }

    // 6. Create CategorySubject
    const categorySubject = await prisma.categorySubject.upsert({
      where: {
        categoryId_subjectId: {
          categoryId: category.id,
          subjectId: subject.id,
        },
      },
      update: {},
      create: {
        categoryId: category.id,
        subjectId: subject.id,
      },
    });

    // 7. Create Import Batch
    const importBatch = await prisma.importBatch.create({
      data: {
        userId,
        sourceType: "JSON",
        inputMode: "PASTED_TEXT",
        questionType: "MULTIPLE_CHOICE",
        status: "PROCESSING",
        totalItems: questions.length,
      },
    });

    // 8. Import Questions with proper error handling
    let imported = 0;
    let failed = 0;
    const importedQuestions = [];
    const failedItems = [];

    for (let i = 0; i < questions.length; i++) {
      try {
        const q = questions[i];

        // Check for duplicate question (optional - skip duplicates)
        const existing = await prisma.question.findFirst({
          where: {
            categorySubjectId: categorySubject.id,
            versions: {
              some: {
                questionText: q.question,
                version: 1,
              },
            },
          },
        });

        if (existing) {
          // Skip duplicate
          await prisma.importBatchItem.create({
            data: {
              importBatchId: importBatch.id,
              rowNumber: i + 1,
              status: "FAILED",
              errorMessage: "Duplicate question already exists",
              rawData: q,
            },
          });
          failed++;
          failedItems.push({ row: i + 1, error: "Duplicate question" });
          continue;
        }

        // Create Question
        const question = await prisma.question.create({
          data: {
            categorySubjectId: categorySubject.id,
            createdById: userId,
            visibility: "PUBLIC",
            status: "PUBLISHED",
            allowReuse: true,
            source: "JSON_IMPORT",
            importBatchId: importBatch.id,
          },
        });

        // Create Question Version
        const version = await prisma.questionVersion.create({
          data: {
            questionId: question.id,
            version: 1,
            type: "MULTIPLE_CHOICE",
            questionText: q.question,
            hint: q.hint || null,
            explanation: q.explanation || null,
          },
        });

        // Create Choices
        await prisma.choice.createMany({
          data: q.choices.map((choice: any, index: number) => ({
            questionVersionId: version.id,
            label: choice.label,
            content: choice.content,
            isCorrect: choice.isCorrect,
            sortOrder: index,
          })),
        });

        // Create Import Item
        await prisma.importBatchItem.create({
          data: {
            importBatchId: importBatch.id,
            rowNumber: i + 1,
            status: "IMPORTED",
            questionId: question.id,
            rawData: q,
          },
        });

        imported++;
        importedQuestions.push(question.id);
      } catch (error) {
        await prisma.importBatchItem.create({
          data: {
            importBatchId: importBatch.id,
            rowNumber: i + 1,
            status: "FAILED",
            errorMessage:
              error instanceof Error ? error.message : "Unknown error",
            rawData: questions[i],
          },
        });
        failed++;
        failedItems.push({
          row: i + 1,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // 9. Update Import Batch
    const status =
      failed === 0
        ? "COMPLETED"
        : failed === questions.length
          ? "FAILED"
          : "PARTIAL";

    await prisma.importBatch.update({
      where: { id: importBatch.id },
      data: {
        status,
        importedItems: imported,
        failedItems: failed,
        completedAt: new Date(),
      },
    });

    // 10. Return detailed result
    return NextResponse.json({
      success: true,
      data: {
        category: {
          id: category.id,
          name: category.name,
        },
        subject: {
          id: subject.id,
          name: subject.name,
        },
        categorySubject: {
          id: categorySubject.id,
          categoryId: categorySubject.categoryId,
          subjectId: categorySubject.subjectId,
        },
        importBatch: {
          id: importBatch.id,
          totalItems: questions.length,
          importedItems: imported,
          failedItems: failed,
          status: status,
        },
        total: questions.length,
        imported,
        failed,
        status,
        importBatchId: importBatch.id,
        importedQuestions,
        failedItems: failedItems.length > 0 ? failedItems : undefined,
      },
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Import failed",
      },
      { status: 500 },
    );
  }
}
