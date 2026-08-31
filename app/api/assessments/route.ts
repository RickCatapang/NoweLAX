// // app/api/assessments/route.ts

// import { NextResponse } from "next/server";
// import prisma from "@/src/lib/prisma";
// import { auth } from "@/src/lib/auth";

// export async function POST(request: Request) {
//   try {
//     const session = await auth.api.getSession({
//       headers: request.headers,
//     });

//     if (!session?.user) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized." },
//         { status: 401 },
//       );
//     }

//     const userId = session.user.id;
//     const body = await request.json();

//     const { title, description, type, mode, timeLimitSeconds, subjects } = body;

//     // Validate
//     if (!title?.trim()) {
//       return NextResponse.json(
//         { success: false, message: "Title is required" },
//         { status: 400 },
//       );
//     }

//     if (!subjects || subjects.length === 0) {
//       return NextResponse.json(
//         { success: false, message: "At least one subject is required" },
//         { status: 400 },
//       );
//     }

//     // Create assessment with subjects
//     const assessment = await prisma.assessment.create({
//       data: {
//         title: title.trim(),
//         description: description?.trim() || null,
//         type: type || "QUIZ",
//         mode: mode || "DYNAMIC",
//         timeLimitSeconds: timeLimitSeconds || null,
//         visibility: "PRIVATE",
//         status: "DRAFT",
//         createdById: userId,
//         subjects: {
//           create: await Promise.all(
//             subjects.map(async (s: any) => {
//               // Get or create category subject relationship
//               const categorySubject = await prisma.categorySubject.upsert({
//                 where: {
//                   categoryId_subjectId: {
//                     categoryId: s.categoryId,
//                     subjectId: s.subjectId,
//                   },
//                 },
//                 update: {},
//                 create: {
//                   categoryId: s.categoryId,
//                   subjectId: s.subjectId,
//                 },
//               });

//               return {
//                 categorySubjectId: categorySubject.id,
//                 questionCount: s.questionCount || 10,
//                 selectionRules: {
//                   create: {
//                     publicOnly: true,
//                     reusableOnly: true,
//                     randomize: true,
//                     excludePreviouslyAttempted: true,
//                   },
//                 },
//               };
//             }),
//           ),
//         },
//       },
//       include: {
//         subjects: {
//           include: {
//             categorySubject: {
//               include: {
//                 category: true,
//                 subject: true,
//               },
//             },
//             selectionRules: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       data: assessment,
//     });
//   } catch (error) {
//     console.error("Error creating assessment:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to create assessment",
//       },
//       { status: 500 },
//     );
//   }
// }

// export async function GET(request: Request) {
//   try {
//     const session = await auth.api.getSession({
//       headers: request.headers,
//     });

//     if (!session?.user) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized." },
//         { status: 401 },
//       );
//     }

//     const userId = session.user.id;

//     const assessments = await prisma.assessment.findMany({
//       where: { createdById: userId },
//       include: {
//         subjects: {
//           include: {
//             categorySubject: {
//               include: {
//                 category: true,
//                 subject: true,
//               },
//             },
//           },
//         },
//         _count: {
//           select: { attempts: true },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json({
//       success: true,
//       data: assessments,
//     });
//   } catch (error) {
//     console.error("Error fetching assessments:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to fetch assessments" },
//       { status: 500 },
//     );
//   }
// }
// app/api/assessments/route.ts

import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";

export async function POST(request: Request) {
  try {
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

    const { title, description, type, mode, timeLimitSeconds, subjects } = body;

    // Validate
    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, message: "Title is required" },
        { status: 400 },
      );
    }

    if (!subjects || subjects.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one subject is required" },
        { status: 400 },
      );
    }

    // Create assessment with subjects
    const assessment = await prisma.assessment.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        type: type || "QUIZ",
        mode: mode || "DYNAMIC",
        timeLimitSeconds: timeLimitSeconds || null,
        visibility: "PRIVATE",
        status: "DRAFT",
        createdById: userId,
        subjects: {
          create: await Promise.all(
            subjects.map(async (s: any) => {
              const categorySubject = await prisma.categorySubject.upsert({
                where: {
                  categoryId_subjectId: {
                    categoryId: s.categoryId,
                    subjectId: s.subjectId,
                  },
                },
                update: {},
                create: {
                  categoryId: s.categoryId,
                  subjectId: s.subjectId,
                },
              });

              return {
                categorySubjectId: categorySubject.id,
                questionCount: s.questionCount || 10,
                selectionRules: {
                  create: {
                    publicOnly: true,
                    reusableOnly: true,
                    randomize: true,
                    excludePreviouslyAttempted: true,
                  },
                },
              };
            }),
          ),
        },
      },
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

    return NextResponse.json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    console.error("Error creating assessment:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create assessment",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
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

    // Get all assessments (owned + public)
    const assessments = await prisma.assessment.findMany({
      where: {
        OR: [
          { createdById: userId },
          {
            status: "PUBLISHED",
            visibility: "PUBLIC",
          },
        ],
      },
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
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: { attempts: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Add isOwner flag
    const assessmentsWithOwner = assessments.map((assessment) => ({
      ...assessment,
      isOwner: assessment.createdById === userId,
    }));

    return NextResponse.json({
      success: true,
      data: assessmentsWithOwner,
    });
  } catch (error) {
    console.error("Error fetching assessments:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch assessments" },
      { status: 500 },
    );
  }
}
