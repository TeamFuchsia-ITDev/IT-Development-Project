"use client";

import { ApplicationProps, CompanionCardProps } from "@/app/libs/interfaces";
import { calculateAge } from "@/app/libs/actions";
import toast from "react-hot-toast";
import { useState, useEffect, FormEvent } from "react";
import { limitText } from "@/app/libs/actions";
import axios from "axios";

export const CompanionCard = ({ application }: CompanionCardProps) => {
  const [showWhy, setShowWhy] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [truncatedEthnicity, setTruncatedEthnicity] = useState<string>(
    application?.compEthnicity ?? ""
  );

  useEffect(() => {
    setTruncatedEthnicity(limitText(application?.compEthnicity ?? "", 7));
  }, [application]);

  const handleAcceptClick = async (
    e: FormEvent,
    applicationData: ApplicationProps
  ) => {
    setDisabled(true);
    toast.loading("Sending application...", {
      duration: 4000,
    });

    const response = await axios.patch(`api/user/application`, {
      data: {
        requestId: applicationData.requestId,
        applicationId: applicationData.id,
      },
    });
    if (response.data.status !== 200) {
      const errorMessage = response.data?.error || "An error occurred";
      toast.error(errorMessage);
      setTimeout(() => setDisabled(false), 2000);
    } else {
      toast.success("Application accepted");
      setTimeout(() => {
        toast.dismiss();
        window.location.reload();
      }, 2000);
    }
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
            <h1 className="">
              {showWhy ? application?.compEthnicity : truncatedEthnicity}
            </h1>
          </div>
        </div>
        <div>
          <h1 className="ml-4 mr-4 mt-2 mb-2 break-words">
            {showWhy ? application?.description : ""}
          </h1>
        </div>
        <div className="flex flex-col pl-4 pr-4 gap-2 mt-2 mb-4">
          <button
            className="text-center bg-rose-500 text-white text-[15px] rounded-full h-[35px]  w-auto hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300"
            onClick={() => setShowWhy(!showWhy)}
          >
            {showWhy ? "Hide" : "Why Hire Me?"}
          </button>
          <button
            className={`${
              disabled
                ? "text-center bg-green-500 text-white text-[15px] rounded-full h-[35px]  w-auto opacity-50 cursor-not-allowed"
                : "text-center bg-green-500 text-white text-[15px] rounded-full h-[35px]  w-auto hover:bg-white hover:text-green-500 hover:border-[2px] hover:border-green-500 hover:ease-in-out duration-300"
            }`}
            onClick={(e) => handleAcceptClick(e, application!)}
            disabled={disabled}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};
