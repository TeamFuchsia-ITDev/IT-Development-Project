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
      const { taskname, category, datetime, description } = body;

      const userRequests = await prisma.request.count({
        where: {
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

      if (!taskname)
        throw {
          code: 400,
          message: "Please enter the taskname for your request",
        };
      if (!category)
        throw {
          code: 400,
          message: "Please select a category for your request",
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
          status: "Waiting",
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

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      message: "Unauthorized access",
      status: 401,
    });
  } else {
    try {
      const body = await request.json();
      const { requestid } = body;
      const userRequest = await prisma.request.delete({
        where: {
          id: requestid,
        },
      });

      return NextResponse.json({ message: "deleted", status: 200 });
    } catch (error) {
      const { code = 500, message = "internal server error" } = error as APIErr;
      return NextResponse.json({
        status: code,
        error: message,
      });
    }
  }
}
