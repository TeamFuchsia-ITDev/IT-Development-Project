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
      const { applicationId, requestId, amount, description } = body.data;

      const updatedApplication = await prisma.application.update({
        where: { id: applicationId },
        data: { amount: parseFloat(amount), description },
      });

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
