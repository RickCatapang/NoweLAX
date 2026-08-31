// app/api/assessments/[id]/publish/route.ts

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
        { success: false, message: "Assessment ID is required" },
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

    const assessment = await prisma.assessment.findUnique({
      where: { id: id },
    });

    if (!assessment) {
      return NextResponse.json(
        { success: false, message: "Assessment not found" },
        { status: 404 },
      );
    }

    if (assessment.createdById !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: "You don't have permission to publish this assessment",
        },
        { status: 403 },
      );
    }

    if (assessment.status === "PUBLISHED") {
      return NextResponse.json(
        { success: false, message: "Assessment is already published" },
        { status: 400 },
      );
    }

    const updated = await prisma.assessment.update({
      where: { id: id },
      data: {
        status: "PUBLISHED",
        visibility: "PUBLIC",
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("❌ Error publishing assessment:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to publish assessment",
      },
      { status: 500 },
    );
  }
}
