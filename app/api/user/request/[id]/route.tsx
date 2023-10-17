import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
		
        const request = await prisma.request.findUnique({
            where: {
                id: id,
            }
        });

        if (!request) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        return NextResponse.json(request, { status: 200 });
    } catch (error) {
        console.error("Error fetching request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
