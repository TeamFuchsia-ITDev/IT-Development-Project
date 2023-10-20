import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { APIErr } from "@/app/libs/interfaces";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      message: "Unauthorized access",
      status: 401,
    });
  } else {
    try {
      const body = await request.json();
      const { requestid, amount, description } = body;

      const existingApplication = await prisma.application.findMany({
        where: {
          requestId: requestid,
          userEmail: session.user.email,
        },
      });

      const userProfile = await prisma.profile.findUnique({
        where: {
          userEmail: session.user?.email!,
        },
        include: {
          location: {
            include: {
              address: true,
            },
          },
        },
      });

      if (existingApplication.length >= 1)
        throw {
          code: 400,
          message: "You already have an existing application for this request",
        };
      if (!amount)
        throw {
          code: 400,
          message: "Please an amount for your service",
        };
      if (isNaN(amount) && amount < 0)
        throw {
          code: 400,
          message: "Please enter a valid amount for your service",
        };
      if (!description)
        throw {
          code: 400,
          message: "Please enter why you will be a good fit for this request",
        };

      const userApplication = await prisma.application.create({
        data: {
          amount: parseFloat(amount),
          description,
          userEmail: userProfile?.userEmail!,
          compName: userProfile?.name!,
          compImage: userProfile?.image!,
          compCity: userProfile?.location?.address?.city!,
          compEthnicity: userProfile?.ethnicity!,
          compBirthday: userProfile?.birthday!,
          compGender: userProfile?.gender!,
          status: "Pending",
          request: {
            connect: {
              id: requestid,
            },
          },
        },
      });

      return NextResponse.json({ userApplication, status: 200 });
    } catch (error) {
      const { code = 500, message = "internal server error" } = error as APIErr;
      return NextResponse.json({
        status: code,
        error: message,
      });
    }
  }
}

export async function GET(request: Request) {
  try {
    const requests = await prisma.request.findMany();
    return NextResponse.json({ requests, status: 200 });
  } catch (error) {
    const { code = 500, message = "internal server error" } = error as APIErr;
    return NextResponse.json({
      status: code,
      error: message,
    });
  }
}

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
      const { applicationId, requestId } = body.data;

      const updatedApplication = await prisma.application.update({
        where: { id: applicationId },
        data: { status: "Accepted" },
      });

      const appliedRequest = await prisma.request.findUnique({
        where: {
          id: requestId,
        },
      });

      const acceptedApplications = await prisma.application.findMany({
        where: {
          requestId: requestId,
          status: "Accepted",
        },
      });

      if (appliedRequest?.compNeeded === acceptedApplications.length) {
        await prisma.request.update({
          where: {
            id: requestId,
          },
          data: {
            status: "OnGoing",
          },
        });

        await prisma.application.updateMany({
          where: {
            requestId: requestId,
            status: "Pending",
          },
          data: {
            status: "NotChosen",
          },
        });
      }

      return NextResponse.json({ updatedApplication, status: 200 });
    } catch (error) {
      const { code = 500, message = "internal server error" } = error as APIErr;
      return NextResponse.json({
        status: code,
        error: message,
      });
    }
  }
}
