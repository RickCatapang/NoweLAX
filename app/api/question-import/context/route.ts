import { NextResponse } from "next/server";

import prisma from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";

interface RequestBody {
  categoryId?: unknown;
  categoryName?: unknown;
  subjectId?: unknown;
  subjectName?: unknown;
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
        ? body.categoryName.trim()
        : undefined;

    const subjectId =
      typeof body.subjectId === "string" ? body.subjectId.trim() : undefined;

    const subjectName =
      typeof body.subjectName === "string"
        ? body.subjectName.trim()
        : undefined;

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

    // ============================================================
    // RESOLVE CATEGORY
    // ============================================================

    const category = await prisma.category.findFirst({
      where: categoryId
        ? {
            id: categoryId,
          }
        : {
            name: categoryName,
          },
      select: {
        id: true,
        name: true,
      },
    });

    let resolvedCategory = category;

    // ------------------------------------------------------------
    // CREATE CATEGORY IF NECESSARY
    // ------------------------------------------------------------

    if (!resolvedCategory) {
      if (!categoryName) {
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

      try {
        resolvedCategory = await prisma.category.create({
          data: {
            name: categoryName,
            type: "GENERAL",
          },
          select: {
            id: true,
            name: true,
          },
        });
      } catch (error) {
        // Handle unique category name race condition.
        const existingCategory = await prisma.category.findUnique({
          where: {
            name: categoryName,
          },
          select: {
            id: true,
            name: true,
          },
        });

        if (!existingCategory) {
          throw error;
        }

        resolvedCategory = existingCategory;
      }
    }

    // ============================================================
    // RESOLVE SUBJECT
    // ============================================================

    const subject = await prisma.subject.findFirst({
      where: subjectId
        ? {
            id: subjectId,
          }
        : {
            name: subjectName,
          },
      select: {
        id: true,
        name: true,
      },
    });

    let resolvedSubject = subject;

    // ------------------------------------------------------------
    // CREATE SUBJECT IF NECESSARY
    // ------------------------------------------------------------

    if (!resolvedSubject) {
      if (!subjectName) {
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

      try {
        resolvedSubject = await prisma.subject.create({
          data: {
            name: subjectName,
          },
          select: {
            id: true,
            name: true,
          },
        });
      } catch (error) {
        // Handle unique subject name race condition.
        const existingSubject = await prisma.subject.findUnique({
          where: {
            name: subjectName,
          },
          select: {
            id: true,
            name: true,
          },
        });

        if (!existingSubject) {
          throw error;
        }

        resolvedSubject = existingSubject;
      }
    }

    // ============================================================
    // VERIFY OWNED/VALID CONTEXT
    // ============================================================
    //
    // Category and Subject are global reference data.
    //
    // The user does not "own" them.
    //
    // We simply resolve/create the valid global records and
    // establish their relationship.
    //
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
    // RESPONSE
    // ============================================================

    return NextResponse.json(
      {
        success: true,
        message: "Import context prepared successfully.",
        data: {
          category: resolvedCategory,
          subject: resolvedSubject,
          categorySubject,
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
