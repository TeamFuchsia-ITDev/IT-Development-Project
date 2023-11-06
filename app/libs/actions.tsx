import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import prisma from "@/app/libs/prismadb";

export async function createProfile(data: {
  select?: Prisma.ProfileSelect<DefaultArgs> | null | undefined;
  include?: Prisma.ProfileInclude<DefaultArgs> | null | undefined;
  data:
    | (Prisma.Without<
        Prisma.ProfileCreateInput,
        Prisma.ProfileUncheckedCreateInput
      > &
        Prisma.ProfileUncheckedCreateInput)
    | (Prisma.Without<
        Prisma.ProfileUncheckedCreateInput,
        Prisma.ProfileCreateInput
      > &
        Prisma.ProfileCreateInput);
}) {
  try {
    const userProfile = await prisma.profile.create(data);
    return userProfile;
  } catch (error) {
    throw new Error("Please enter your complete address");
  }
}

export async function updateProfile(
	id: string,
	updateData: Prisma.ProfileUncheckedUpdateInput,
	image: string,
	userEmail: string
  ) {
	try {
	  await prisma.$transaction([
		prisma.profile.update({
		  where: {
			id: id,
		  },
		  data: updateData,
		}),
		prisma.request.updateMany({
		  where: {
			userEmail: userEmail,
		  },
		  data: {
			requesterImage: image,
		  },
		}),
		prisma.application.updateMany({
		  where: {
			userEmail: userEmail,
		  },
		  data: {
			compImage: image,
		  },
		}),
	  ]);
  
	  const updatedUserProfile = await prisma.profile.findUnique({
		where: {
		  id: id,
		},
	  });
  
	  return updatedUserProfile;
	} catch (error) {
	  throw new Error("Please enter your complete address");
	}
  }
  

export const limitText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};

export async function lapseChecker() {
  const currentDate = new Date();

  // Find requests where the request date has passed and status is not "Lapsed"
  const expiredRequests = await prisma.request.findMany({
    where: {
      datetime: {
        lt: currentDate,
      },
      status: {
        not: "Lapsed",
      },
    },
  });

  // Update the status of expired requests to "Lapsed"
  for (const request of expiredRequests) {
    await prisma.request.update({
      where: { id: request.id },
      data: { status: "Lapsed" },
    });
  }
}
