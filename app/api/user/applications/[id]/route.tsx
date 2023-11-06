import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const applications = await prisma.application.findMany({
      where: {
        requestId: id,
      },
    });

    if (!applications) {
      return NextResponse.json(
        { error: "No applications found" },
        { status: 404 }
      );
    }

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const revertApplication = await prisma.application.update({
      where: {
        id: id,
      },
      data: {
        status: "Pending",
      },
    });

    return NextResponse.json(revertApplication, { status: 200 });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
