"use client";

import quote from "@/app/images/quote.svg";
import Rating from "@mui/material/Rating";
import blankprofile from "@/app/images/blank-profile.jpg";

export const ReviewInfoCard = () => {
  return (
    <div className="border-2 w-[350px] h-auto mt-6 rounded-lg pl-4 pr-4">
      <img
        src={quote.src}
        alt=""
        className="inline-block w-[20px]  mt-4 opacity-20"
      />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-center items-center gap-2">
          <h1 className="text-sm text-center">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit
            molestias, repudiandae, sint fugiat illo hic aliquid exercitationem
            libero assumenda illum et. Repellendus accusamus sapiente unde
            impedit voluptatibus veritatis, ea necessitatibus?
            
          </h1>
          <Rating name="size-large" defaultValue={5} size="large" />
        </div>
        <div className="flex flex-row gap-2 justify-center items-center mb-4">
        <img src={blankprofile.src} alt="Serve-Ease"  className="rounded-full w-[50px] h-[50px] object-cover "/>
        <div className="flex flex-col justify-center">
          <p className="text-md font-bold">John Doe</p>
          <p className="text-md ">Senior Citizen</p>
          </div>
        </div>
      </div>
    </div>
  );
};
