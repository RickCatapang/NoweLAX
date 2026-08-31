// app/api/attempts/[id]/submit/route.ts

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

    const attempt = await prisma.attempt.findUnique({
      where: { id: id, userId: userId },
      include: {
        questions: {
          include: {
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
        },
      },
    });

    if (!attempt) {
      return NextResponse.json(
        { success: false, message: "Attempt not found" },
        { status: 404 },
      );
    }

    // Check if already submitted
    if (attempt.status === "COMPLETED") {
      return NextResponse.json(
        { success: false, message: "This attempt has already been submitted" },
        { status: 400 },
      );
    }

    let totalPoints = 0;
    let earnedPoints = 0;

    // Calculate score
    for (const attemptQuestion of attempt.questions) {
      const version = attemptQuestion.question.versions[0];
      const correctChoice = version.choices.find((c: any) => c.isCorrect);
      const isCorrect =
        attemptQuestion.answer?.selectedChoiceId === correctChoice?.id;

      if (isCorrect) {
        earnedPoints += 1;
      }
      totalPoints += 1;

      // Update attempt question
      await prisma.attemptQuestion.update({
        where: { id: attemptQuestion.id },
        data: {
          isCorrect: isCorrect,
          pointsEarned: isCorrect ? 1 : 0,
        },
      });
    }

    const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const durationSeconds = Math.floor(
      (new Date().getTime() - new Date(attempt.startedAt).getTime()) / 1000,
    );

    // Update attempt
    const updatedAttempt = await prisma.attempt.update({
      where: { id: attempt.id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        score: earnedPoints,
        totalPoints: totalPoints,
        percentage: percentage,
        durationSeconds: durationSeconds,
      },
    });

    // Return the attempt ID in the response
    return NextResponse.json({
      success: true,
      data: {
        attemptId: updatedAttempt.id, // Make sure this is included
        attempt: updatedAttempt,
        score: earnedPoints,
        total: totalPoints,
        percentage: percentage,
      },
    });
  } catch (error) {
    console.error("❌ Error submitting attempt:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to submit attempt",
      },
      { status: 500 },
    );
  }
}
