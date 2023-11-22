import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { APIErr } from "@/app/libs/interfaces";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

      const updatedRequest = await prisma.request.update({
        where: {
          id: requestid,
        },
        data: {
          status: "Completed",
        },
      });

      const updatePendingApplications = await prisma.application.updateMany({
        where: {
          requestId: requestid,
          status: "Pending",
        },
        data: {
          status: "NotChosen",
        },
      });

      const updateAcceptedApplications = await prisma.application.updateMany({
        where: {
          requestId: requestid,
          status: "Accepted",
        },
        data: {
          status: "RequestCompleted",
        },
      });

      return NextResponse.json(
        {
          updatedRequest,
          updatePendingApplications,
          updateAcceptedApplications,
        },
        { status: 200 }
      );
    } catch (error) {
      const { code = 500, message = "internal server error" } = error as APIErr;
      return NextResponse.json({
        status: code,
        error: message,
      });
    }
  }
}
