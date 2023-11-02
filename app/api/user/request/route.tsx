import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { APIErr } from "@/app/libs/interfaces";
import { lapseChecker } from "@/app/libs/actions";

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
      const { taskname, category, compNeeded, datetime, description } = body;

      const userRequests = await prisma.request.count({
        where: {
          userEmail: session.user.email,
          status: {
            in: ["Pending", "OnGoing"],
          },
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

      if (!category)
        throw {
          code: 400,
          message: "Please select a category for your request",
        };
      if (!compNeeded)
        throw {
          code: 400,
          message:
            "Please select the number of companions you need for your request",
        };
      if (!taskname)
        throw {
          code: 400,
          message: "Please enter the taskname for your request",
        };
      if (!datetime)
        throw {
          code: 400,
          message:
            "Please select a date and time for when you want the requested service",
        };
      if (!description)
        throw {
          code: 400,
          message:
            "Please enter a brief description or detail for your requested service",
        };

      if (userRequests === 5)
        throw {
          code: 400,
          message: "You cannot have more than five requests",
        };

      const userRequest = await prisma.request.create({
        data: {
          taskname,
          category,
          datetime: new Date(datetime),
          description,
          requesterName: userProfile?.name!,
          requesterImage: userProfile?.image!,
          requesterCity: userProfile?.location?.address?.city!,
          status: "Pending",
          compNeeded: +compNeeded,
          user: {
            connect: {
              email: session.user.email,
            },
          },
        },
      });

      return NextResponse.json({ userRequest, status: 200 });
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
	lapseChecker();
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
      const { requestid } = body.data;

      const canceledRequest = await prisma.request.update({
        where: {
          id: requestid,
        },
        data: {
          status: "Cancelled",
        },
      });

      const applications = await prisma.application.findMany({
        where: {
          requestId: requestid,
        },
      });

      if (applications.length > 0) {
        await prisma.application.updateMany({
          where: {
            requestId: requestid,
          },
          data: {
            status: "Requester-Cancelled",
          },
        });
      }

      return NextResponse.json(canceledRequest, { status: 200 });
    } catch (error) {
      const { code = 500, message = "internal server error" } = error as APIErr;
      return NextResponse.json({
        status: code,
        error: message,
      });
    }
  }
}
