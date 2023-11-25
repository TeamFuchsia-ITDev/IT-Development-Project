import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { APIErr } from "@/app/libs/interfaces";
import { futureDateTime } from "@/app/libs/reusables";

export async function GET(
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
      const { id } = params;

      const request = await prisma.request.findUnique({
        where: {
          id: id,
        },
      });

      if (!request) {
        return NextResponse.json(
          { error: "Request not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(request, { status: 200 });
    } catch (error) {
      const { code = 500, message = "internal server error" } = error as APIErr;
      return NextResponse.json({
        status: code,
        error: message,
      });
    }
  }
}

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
      const { id } = params;
      const body = await request.json();

      const { taskname, category, compNeeded, datetime, description } =
        body.data;

      const userRequests = await prisma.request.count({
        where: {
          userEmail: session.user.email,
          status: {
            in: ["Pending", "OnGoing"],
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
      if (new Date(datetime) < futureDateTime)
        throw {
          code: 400,
          message:
            "Please enter a date and time with a 30-minute buffer from the current date and time",
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

      const updateRequest = await prisma.request.update({
        where: {
          id: id,
        },
        data: {
          taskname,
          category,
          datetime: new Date(datetime),
          description,
          status: "Pending",
          compNeeded: +compNeeded,
        },
      });

      return NextResponse.json(updateRequest, { status: 200 });
    } catch (error) {
      const { code = 500, message = "internal server error" } = error as APIErr;
      return NextResponse.json({
        status: code,
        error: message,
      });
    }
  }
}
