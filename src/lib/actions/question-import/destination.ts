"use server";

import prisma from "../../prisma";

function normalizeName(value: string) {
  return value.trim().toLowerCase();
}

export async function getImportCategories() {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function getImportSubjects() {
  return prisma.subject.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function createImportCategory(name: string) {
  const normalizedName = normalizeName(name);

  if (!normalizedName) {
    return {
      success: false as const,
      message: "Category name is required.",
    };
  }

  const existing = await prisma.category.findUnique({
    where: {
      name: normalizedName,
    },
  });

  if (existing) {
    return {
      success: false as const,
      message: "This category already exists.",
      category: existing,
    };
  }

  const category = await prisma.category.create({
    data: {
      name: normalizedName,
    },
  });

  return {
    success: true as const,
    category,
  };
}

export async function createImportSubject(name: string) {
  const normalizedName = normalizeName(name);

  if (!normalizedName) {
    return {
      success: false as const,
      message: "Subject name is required.",
    };
  }

  const existing = await prisma.subject.findUnique({
    where: {
      name: normalizedName,
    },
  });

  if (existing) {
    return {
      success: false as const,
      message: "This subject already exists.",
      subject: existing,
    };
  }

  const subject = await prisma.subject.create({
    data: {
      name: normalizedName,
    },
  });

  return {
    success: true as const,
    subject,
  };
}

export async function ensureCategorySubject(
  categoryId: string,
  subjectId: string,
) {
  return prisma.categorySubject.upsert({
    where: {
      categoryId_subjectId: {
        categoryId,
        subjectId,
      },
    },
    update: {},
    create: {
      categoryId,
      subjectId,
    },
  });
}
