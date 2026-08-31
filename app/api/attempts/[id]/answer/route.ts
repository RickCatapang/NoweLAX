// app/api/attempts/[id]/answer/route.ts

import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";

export async function POST(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> },
) {
  try {
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
        { success: false, message: "Attempt ID is required" },
        { status: 400 },
      );
    }

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
    const { questionId, selectedChoiceId } = body;

    if (!questionId) {
      return NextResponse.json(
        { success: false, message: "Question ID is required" },
        { status: 400 },
      );
    }

    // Find the attempt question with answer included
    const attemptQuestion = await prisma.attemptQuestion.findFirst({
      where: {
        attemptId: id,
        questionId: questionId,
      },
      include: {
        attempt: {
          include: {
            assessment: true,
          },
        },
        question: {
          include: {
            versions: {
              where: { version: 1 },
              include: {
                choices: true,
              },
            },
          },
        },
        answer: true,
      },
    });

    if (!attemptQuestion) {
      return NextResponse.json(
        { success: false, message: "Question not found in this attempt" },
        { status: 404 },
      );
    }

    // Check if user owns this attempt
    if (attemptQuestion.attempt.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );
    }

    // Check if attempt is still in progress
    if (attemptQuestion.attempt.status !== "IN_PROGRESS") {
      return NextResponse.json(
        { success: false, message: "This attempt has already been completed" },
        { status: 400 },
      );
    }

    // Check if already answered
    if (attemptQuestion.answer) {
      // Update existing answer
      await prisma.attemptAnswer.update({
        where: {
          id: attemptQuestion.answer.id,
        },
        data: {
          selectedChoiceId: selectedChoiceId || null,
          submittedAt: new Date(),
        },
      });
    } else {
      // Create new answer
      await prisma.attemptAnswer.create({
        data: {
          attemptQuestionId: attemptQuestion.id,
          selectedChoiceId: selectedChoiceId || null,
          submittedAt: new Date(),
        },
      });
    }

    // Update attempt question
    await prisma.attemptQuestion.update({
      where: {
        id: attemptQuestion.id,
      },
      data: {
        answered: true,
        answeredAt: new Date(),
        timeSpentSeconds: Math.floor(
          (new Date().getTime() -
            new Date(attemptQuestion.presentedAt || new Date()).getTime()) /
            1000,
        ),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Answer saved successfully",
    });
  } catch (error) {
    console.error("❌ Error saving answer:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to save answer",
      },
      { status: 500 },
    );
  }
}
