import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { APIErr } from "@/app/libs/interfaces";

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      message: "Unauthorized access",
      status: 401,
    });
  } else {
    try {
      const body = await request.json();
      const { requestid } = body.data;

      const currentRequest = await prisma.request.findUnique({
        where: {
          id: requestid,
        },
      });

      const canceledOngoingTask = await prisma.application.updateMany({
        where: {
          requestId: requestid,
          status: "Accepted",
          userEmail: session.user.email,
        },
        data: { status: "Cancelled" },
      });

      if (canceledOngoingTask !== null || canceledOngoingTask !== undefined) {
        const currNumberOfAcceptedApplications =
          await prisma.application.findMany({
            where: {
              requestId: requestid,
              status: "Accepted",
            },
          });

        if (
          currNumberOfAcceptedApplications.length < currentRequest?.compNeeded!
        ) {
          await prisma.request.update({
            where: {
              id: requestid,
            },
            data: {
              status: "Pending",
            },
          });
        }
      }

      return NextResponse.json({ canceledOngoingTask, status: 200 });
    } catch (error) {
      const { code = 500, message = "internal server error" } = error as APIErr;
      return NextResponse.json({
        status: code,
        error: message,
      });
    }
  }
}
