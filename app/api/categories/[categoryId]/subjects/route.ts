import { NextResponse } from "next/server";

import prisma from "@/src/lib/prisma";

interface RouteContext {
  params: Promise<{
    categoryId: string;
  }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { categoryId } = await params;

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      select: {
        id: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          message: "Category not found.",
        },
        {
          status: 404,
        },
      );
    }

    const categorySubjects = await prisma.categorySubject.findMany({
      where: {
        categoryId,
      },
      orderBy: {
        subject: {
          name: "asc",
        },
      },
      select: {
        id: true,
        subject: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    const subjects = categorySubjects.map((categorySubject) => ({
      categorySubjectId: categorySubject.id,
      id: categorySubject.subject.id,
      name: categorySubject.subject.name,
      description: categorySubject.subject.description,
    }));

    return NextResponse.json(subjects);
  } catch (error) {
    console.error("Failed to fetch subjects:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch subjects.",
      },
      {
        status: 500,
      },
    );
  }
}
