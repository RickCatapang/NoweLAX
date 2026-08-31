// app/api/attempts/[id]/questions/route.ts

import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";

export async function GET(
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

    // Get attempt with questions
    const attempt = await prisma.attempt.findUnique({
      where: {
        id: id,
        userId: userId,
      },
      include: {
        assessment: {
          include: {
            subjects: {
              include: {
                categorySubject: {
                  include: {
                    category: true,
                    subject: true,
                  },
                },
              },
            },
          },
        },
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
          orderBy: {
            sortOrder: "asc",
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

    // If no questions generated yet, generate them
    if (attempt.questions.length === 0) {
      const assessmentSubjects = attempt.assessment.subjects;
      let sortOrder = 0;

      for (const subject of assessmentSubjects) {
        const questionCount = subject.questionCount || 10;

        const eligibleQuestions = await prisma.question.findMany({
          where: {
            categorySubjectId: subject.categorySubjectId,
            status: "PUBLISHED",
            visibility: "PUBLIC",
            allowReuse: true,
          },
          include: {
            versions: {
              where: { version: 1 },
              include: {
                choices: true,
              },
            },
          },
        });

        const shuffled = eligibleQuestions.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(
          0,
          Math.min(questionCount, shuffled.length),
        );

        for (const question of selected) {
          const latestVersion = question.versions[0];

          await prisma.attemptQuestion.create({
            data: {
              attemptId: attempt.id,
              questionId: question.id,
              questionVersionId: latestVersion.id,
              assessmentSubjectId: subject.id,
              sortOrder: sortOrder,
              presentedAt: new Date(),
            },
          });

          sortOrder++;
        }
      }

      // Refetch the attempt with questions
      const updatedAttempt = await prisma.attempt.findUnique({
        where: { id: attempt.id },
        include: {
          assessment: {
            include: {
              subjects: {
                include: {
                  categorySubject: {
                    include: {
                      category: true,
                      subject: true,
                    },
                  },
                },
              },
            },
          },
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
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      });

      if (!updatedAttempt) {
        return NextResponse.json(
          { success: false, message: "Failed to generate questions" },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          attempt: updatedAttempt,
          questions: updatedAttempt.questions.map((q: any) => ({
            id: q.questionId,
            text: q.question.versions[0].questionText,
            choices: q.question.versions[0].choices.map((c: any) => ({
              id: c.id,
              label: c.label,
              content: c.content,
            })),
            sortOrder: q.sortOrder,
            answered: !!q.answer,
            selectedChoiceId: q.answer?.selectedChoiceId || null,
          })),
        },
      });
    }

    // Return existing questions
    return NextResponse.json({
      success: true,
      data: {
        attempt: attempt,
        questions: attempt.questions.map((q: any) => ({
          id: q.questionId,
          text: q.question.versions[0].questionText,
          choices: q.question.versions[0].choices.map((c: any) => ({
            id: c.id,
            label: c.label,
            content: c.content,
          })),
          sortOrder: q.sortOrder,
          answered: !!q.answer,
          selectedChoiceId: q.answer?.selectedChoiceId || null,
        })),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching attempt questions:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch questions",
      },
      { status: 500 },
    );
  }
}
