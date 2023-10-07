import prisma from "../../../libs/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export interface APIErr {
  code: number;
  message: string;
  cause: string | Error;
}

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
      const { taskname, category, amount, datetime, description } = body;

      const userRequest = await prisma.request.create({
        data: {
          taskname,
          category,
          amount,
          datetime,
          description,
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
