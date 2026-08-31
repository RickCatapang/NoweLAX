// app/api/assessments/[id]/generate/route.ts

import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";

export async function POST(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> },
) {
  try {
    // Get ID from params
    let id: string | undefined;
    const params = context.params;

    if (
      params &&
      typeof params === "object" &&
      "then" in params &&
      typeof params.then === "function"
    ) {
      const resolvedParams = await params;
      id = resolvedParams?.id;
    } else if (params && typeof params === "object" && "id" in params) {
      id = (params as { id: string }).id;
    }

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Assessment ID is required" },
        { status: 400 },
      );
    }

    // Authentication
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

    // Get assessment with subjects
    const assessment = await prisma.assessment.findUnique({
      where: { id: id },
      include: {
        subjects: {
          include: {
            categorySubject: {
              include: {
                category: true,
                subject: true,
              },
            },
            selectionRules: true,
          },
        },
      },
    });

    if (!assessment) {
      return NextResponse.json(
        { success: false, message: "Assessment not found" },
        { status: 404 },
      );
    }

    // Check if user can take this assessment
    const isOwner = assessment.createdById === userId;
    const isPublic =
      assessment.status === "PUBLISHED" && assessment.visibility === "PUBLIC";

    if (!isOwner && !isPublic) {
      return NextResponse.json(
        {
          success: false,
          message: "You don't have permission to take this assessment",
        },
        { status: 403 },
      );
    }

    // Check if user already has an in-progress attempt
    const existingAttempt = await prisma.attempt.findFirst({
      where: {
        assessmentId: id,
        userId: userId,
        status: "IN_PROGRESS",
      },
    });

    if (existingAttempt) {
      return NextResponse.json({
        success: true,
        data: {
          attemptId: existingAttempt.id,
          isResuming: true,
        },
      });
    }

    // Create a new attempt
    const attempt = await prisma.attempt.create({
      data: {
        assessmentId: id,
        userId: userId,
        status: "IN_PROGRESS",
        startedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        attemptId: attempt.id,
        isResuming: false,
      },
    });
  } catch (error) {
    console.error("❌ Error generating assessment:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate assessment",
      },
      { status: 500 },
    );
  }
}
