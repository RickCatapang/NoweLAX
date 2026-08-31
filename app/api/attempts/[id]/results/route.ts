// app/api/attempts/[id]/results/route.ts

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

    const attempt = await prisma.attempt.findUnique({
      where: {
        id: id,
        userId: userId,
      },
      include: {
        assessment: {
          select: {
            id: true,
            title: true,
            type: true,
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

    // Check if attempt is completed
    if (attempt.status !== "COMPLETED") {
      return NextResponse.json(
        { success: false, message: "Attempt is not yet completed" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      data: attempt,
    });
  } catch (error) {
    console.error("❌ Error fetching results:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch results",
      },
      { status: 500 },
    );
  }
}
