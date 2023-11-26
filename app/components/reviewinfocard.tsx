"use client";

import quote from "@/app/images/quote.svg";
import Rating from "@mui/material/Rating";
import blankprofile from "@/app/images/blank-profile.jpg";
import { ReviewInfoCardProps } from "@/app/libs/interfaces";

export const ReviewInfoCard: React.FC<ReviewInfoCardProps> = ({
  comment,
  rating,
  reviewerName,
  reviewerImage,
}) => {
  return (
    <div className="border-2 w-[350px] h-auto mt-6 rounded-lg pl-4 pr-4">
      <img
        src={quote.src}
        alt=""
        className="inline-block w-[20px]  mt-4 opacity-20"
      />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-center items-center gap-2">
          <h1 className="text-sm text-center">{comment}</h1>
          <Rating name="size-large" value={rating} size="large" readOnly />
        </div>
        <div className="flex flex-row gap-2 justify-center items-center mb-4">
          <img
            src={reviewerImage}
            alt="Serve-Ease"
            className="rounded-full w-[50px] h-[50px] object-cover "
          />
          <div className="flex flex-col justify-center">
            <p className="text-md font-bold">{reviewerName}</p>
            <p className="text-md ">Senior Citizen</p>
          </div>
        </div>
      </div>
    </div>
  );
};
