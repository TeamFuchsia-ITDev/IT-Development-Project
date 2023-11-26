"use client";

import { useState } from "react";
import { HiredApplicantsCardProps } from "@/app/libs/interfaces";
import { calculateAge } from "@/app/libs/actions";

export const HiredApplicantsCard = ({
  application,
  toggleReviewCardVisibility,
  onLeaveReviewClick,
}: HiredApplicantsCardProps) => {
  const [disabled, setDisabled] = useState(false);

  const handleLeaveRequesterReview = () => {
    if (toggleReviewCardVisibility) {
      toggleReviewCardVisibility(true);
    }
    onLeaveReviewClick(application?.userEmail!);
  };

  return (
    <div
      className=" border-[1px]  h-auto w-auto mb-4 rounded-[10px] hover:translate-y-[-20px] mt-5"
      style={{ boxShadow: "4px 4px 10px rgba(153, 153, 153, 100%)" }}
    >
      <div className="flex flex-col">
        <img
          src={application?.compImage}
          className="rounded-t-lg h-[150px] w-auto object-cover"
        />
        <div className="flex flex-row pl-4 pr-4">
          <div className="w-[70%] mt-4">
            <h1 className="font-bold">
              {application?.compName}{" "}
              <a className="text-gray-500 font-normal">
                {calculateAge(application?.compBirthday!).toString()}
              </a>
            </h1>{" "}
            <h1 className="text-gray-400">{application?.compCity}</h1>
          </div>
          <div className="w-[50%] mt-4">
            {" "}
            <h1>
              RATE: <a className="text-rose-500">${application?.amount}</a>
            </h1>{" "}
            <h1 className="">{application?.compEthnicity}</h1>
          </div>
        </div>
        <div></div>
        <div className="flex flex-col pl-4 pr-4 gap-2 mt-2 mb-4">
          <button
            className={"text-center bg-green-500 text-white text-[15px] rounded-full h-[35px]  w-auto hover:bg-white hover:text-green-500 hover:border-[2px] hover:border-green-500 hover:ease-in-out duration-300"}
            onClick={handleLeaveRequesterReview}
          >
            Leave a Review
          </button>
        </div>
      </div>
    </div>
  );
};
