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


export async function updateProfile(data: {
  where: Prisma.ProfileWhereUniqueInput;
  data: Prisma.ProfileUpdateInput;
  select?: Prisma.ProfileSelect<DefaultArgs> | null | undefined;
}) {
  try {
    const userProfile = await prisma.profile.update(data);
    return userProfile;
  } catch (error) {
    throw new Error("Failed to update the profile");
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
