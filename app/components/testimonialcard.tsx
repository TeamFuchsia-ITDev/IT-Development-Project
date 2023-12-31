"use client";

import blankprofile from "@/app/images/blank-profile.jpg";
import quote from "@/app/images/quote.svg";
import Rating from "@mui/material/Rating";
import { TestimonialCardProps } from "@/app/libs/interfaces";

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  image,
  testimonial,
  role,
}) => {
  return (
    <div className="mt-12 md:mt-12 lg:mt-24 ">
      <div className="flex flex-col w-full md:w-full lg:w-[900px] rounded-[10px] border-2 pb-4 pt-4 pl-4 pr-4 ">
        <div className="flex flex-col justify-center items-center gap-4 md:flex-row lg-flex-row xl-flex-row ">
          <img
            src={blankprofile.src}
            alt="Serve-Ease"
            className="rounded-full w-[100px] h-[100px] object-cover border-white border-4"
          />
          <div className="flex flex-col justify-center text-[20px]">
            <h1>{name}</h1>
            <h1>{role}</h1>
          </div>
          <Rating name="size-large" defaultValue={5} size="large"  readOnly />
        </div>
        <div className="flex flex-col">
          <img src={quote.src} width={20} className="opacity-50"/>
          <p className="mt-4 text-left text-[18px] lg:text-[18.5px] md:text-center lg-text-center xl-text-center">
            {testimonial}
          </p>
        </div>
      </div>
    </div>
  );
};
