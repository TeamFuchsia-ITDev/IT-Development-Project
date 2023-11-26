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
      const { requestid, rating, comment, reviewee, reviewer, reviewType } =
        body.data;

      const existingReview = await prisma.review.findMany({
        where: {
          reviewerEmail: session.user.email,
          requestId: requestid,
          revieweeEmail: reviewee.userEmail,
        },
      });

      if (existingReview.length >= 1)
        throw {
          code: 400,
          message:
            "You already have an existing review for this companion on this specific request",
        };
      if (!rating)
        throw {
          code: 400,
          message: "Please choose a rating for this companion",
        };
      if (!comment)
        throw {
          code: 400,
          message: "Please enter a short comment about this companion",
        };

      const userReview = await prisma.review.create({
        data: {
          requestId: requestid,
          rating: rating,
          comment: comment,
          revieweeEmail: reviewee.userEmail,
          revieweeName: reviewee.name,
          reviewerName: reviewer.name,
          reviewerEmail: reviewer.userEmail,
          reviewType: reviewType,
          profile: {
            connect: {
              id: reviewee.id,
            },
          },
        },
      });

      return NextResponse.json({ userReview, status: 200 });
    } catch (error) {
      const { code = 500, message = "internal server error" } = error as APIErr;
      return NextResponse.json({
        status: code,
        error: message,
      });
    }
  }
}
