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
    throw new Error("Something went wrong");
  }
}
