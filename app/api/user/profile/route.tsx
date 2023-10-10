import prisma from "../../../libs/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { v2 as cloudinary } from "cloudinary";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface APIErr {
  code: number;
  message: string;
  cause: string | Error;
}

// Validation function for name
const validateName = (name: string) => {
  const nameRegEx = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
  return nameRegEx.test(name);
};

// Validation function for phone number
const validatePhoneNumber = (phonenumber: string) => {
  const phoneNumberRegEx = /^\d{3}-\d{3}-\d{4}$/;
  return phoneNumberRegEx.test(phonenumber);
};

// Validation function for image
const validateImage = (imageBase64: string) => {
  // Check if the base64 string contains common image file extensions
  const validExtensions = [".jpg", ".jpeg", ".png"];
  const regex = /^data:image\/(jpeg|jpg|png);base64,/;

  if (regex.test(imageBase64)) {
    const extension = imageBase64.match(regex)![1];
    if (validExtensions.includes(`.${extension}`)) {
      return true; // Valid image format
    }
  }

  return false; // Invalid image format
};

async function createProfileWithGenericErrorHandling(data: {
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
      const {
        name,
        ethnicity,
        gender,
        birthday,
        phonenumber,
        location,
        image,
      } = body;

      const exist = await prisma.user.findUnique({
        where: {
          email: session.user?.email!,
        },
      });

      if (!exist) {
        throw {
          code: 400,
          message: "User doesn't exist",
        };
      }

      // Validate the image
      if (!validateImage(image)) {
        throw {
          code: 400,
          message: "Invalid image format or type",
        };
      }

      // Validate the name field
      if (!name) {
        throw {
          code: 400,
          message: "Please enter a display name that you like",
        };
      } else if (!validateName(name)) {
        throw {
          code: 400,
          message:
            "Invalid name format. It should contain only letters and spaces, with no leading or trailing spaces.",
        };
      }

      if (!ethnicity) {
        throw { code: 400, message: "Please choose your ethnicity" };
      }
      if (!gender) {
        throw { code: 400, message: "Please select your gender" };

        // Validate the birthday field
      }
      if (!birthday) {
        throw {
          code: 400,
          message: "Please select or enter your birthday using the calendar",
        };
      } else {
        const today = new Date();
        const selectedDate = new Date(birthday);

        if (selectedDate.getFullYear() < 1900 || selectedDate >= today) {
          throw {
            code: 400,
            message:
              "Invalid birthday. It should be between 1900 and the current date.",
          };
        }
      }

      if (!phonenumber) {
        throw {
          code: 400,
          message: "Please enter your phone number",
        };
      }

      // Validate the phone number
      if (!validatePhoneNumber(phonenumber)) {
        throw {
          code: 400,
          message:
            "Invalid phone number format. Please use the format: xxx-xxx-xxxx",
        };
      }

      if (!location) {
        throw {
          code: 400,
          message: "Please enter your address",
        };
      }

      // Upload image to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(image, {
        public_id: `${session.user.email}-profile-image`,
        overwrite: true,
      });
      const imageUrl = cloudinaryResponse.secure_url;

      const userProfile = await createProfileWithGenericErrorHandling({
        data: {
          name,
          ethnicity,
          gender,
          birthday,
          phonenumber,
          image: imageUrl,
          location: {
            create: {
              lng: location.lng,
              lat: location.lat,
              address: {
                create: {
                  fullAddress: location.address.fullAddress,
                  pointOfInterest: location.address.pointOfInterest,
                  city: location.address.city,
                  country: location.address.country,
                },
              },
            },
          },
          user: {
            connect: {
              email: session.user?.email!,
            },
          },
        },
      });

      return NextResponse.json({
        userProfile,
        status: 200,
      });
    } catch (error: any) {
      const { code = 500, message = "Internal server error" } = error as APIErr;
      return NextResponse.json({
        status: code,
        error: message,
      });
    }
  }
}

export async function GET(request: Request) {
  // Get all books from the database...
  const profiles = await prisma.profile.findMany();

  return NextResponse.json({ profiles, status: 200 });
}
