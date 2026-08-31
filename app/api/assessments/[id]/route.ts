// // // app/api/assessments/[id]/route.ts

// import { NextResponse } from "next/server";
// import prisma from "@/src/lib/prisma";
// import { auth } from "@/src/lib/auth";

// export async function GET(
//   request: Request,
//   context: { params: { id: string } | Promise<{ id: string }> },
// ) {
//   try {
//     // Handle both Promise and direct object
//     let id: string | undefined;

//     // Check if params is a Promise by looking for the 'then' method
//     const params = context.params;
//     if (
//       params &&
//       typeof params === "object" &&
//       "then" in params &&
//       typeof params.then === "function"
//     ) {
//       // It's a Promise, await it
//       const resolvedParams = await params;
//       id = resolvedParams?.id;
//     } else if (params && typeof params === "object" && "id" in params) {
//       // It's a plain object
//       id = (params as { id: string }).id;
//     }

//     // Validate ID
//     if (!id) {
//       console.error("❌ No ID found");
//       return NextResponse.json(
//         { success: false, message: "Assessment ID is required" },
//         { status: 400 },
//       );
//     }

//     // Authentication
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

//     // Get the assessment
//     const assessment = await prisma.assessment.findUnique({
//       where: { id: id },
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
//         _count: {
//           select: {
//             attempts: true,
//             questions: true,
//           },
//         },
//       },
//     });

//     if (!assessment) {
//       return NextResponse.json(
//         { success: false, message: "Assessment not found" },
//         { status: 404 },
//       );
//     }

//     // Check ownership
//     if (assessment.createdById !== userId) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "You don't have permission to view this assessment",
//         },
//         { status: 403 },
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       data: assessment,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching assessment:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message:
//           error instanceof Error ? error.message : "Failed to fetch assessment",
//       },
//       { status: 500 },
//     );
//   }
// }
// app/api/assessments/[id]/route.ts

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
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            attempts: true,
            questions: true,
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

    // Check if user owns this assessment or if it's public
    const isOwner = assessment.createdById === userId;
    const isPublic =
      assessment.status === "PUBLISHED" && assessment.visibility === "PUBLIC";

    if (!isOwner && !isPublic) {
      return NextResponse.json(
        {
          success: false,
          message: "You don't have permission to view this assessment",
        },
        { status: 403 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...assessment,
        isOwner,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching assessment:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch assessment",
      },
      { status: 500 },
    );
  }
}
