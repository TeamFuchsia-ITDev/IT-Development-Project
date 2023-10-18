"use client";

import { ApplicationProps } from "@/app/libs/interfaces";
import { useState, useEffect } from "react";
import { limitText } from "@/app/libs/actions";

export const CompanionCard = ({
  application,
}: {
  application: ApplicationProps;
}) => {
  const [showWhy, setShowWhy] = useState(false);

  const [truncatedEthnicity, setTruncatedEthnicity] = useState<string>(
    application?.compEthnicity ?? ""
  );

  
  useEffect(() => {
    setTruncatedEthnicity(limitText(application?.compEthnicity ?? "", 7));
  }, [application]);



  function calculateAge(birthdate: string) {
    const birthYear = new Date(birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    return age;
  }
  return (
    <>
      <div className=" border-2  h-auto w-auto mb-4 rounded-[10px] ">
        <div className="flex flex-col">
          <img
            src={application.compImage}
            className="rounded-[9px] h-[150px] w-auto object-cover"
          />
          <div className="flex flex-row pl-4 pr-4">
            <div className="w-[70%] mt-4">
              <h1 className="font-bold">
                {application.compName}{" "}
                <a className="text-gray-500 font-normal">
                  {calculateAge(application.compBirthday).toString()}
                </a>
              </h1>{" "}
              <h1 className="text-gray-400">{application.compCity}</h1>
            </div>
            <div className="w-[50%] mt-4">
              {" "}
              <h1>
                RATE: <a className="text-rose-500">${application.amount}</a>
              </h1>{" "}
              <h1 className="">{showWhy ? application.compEthnicity : truncatedEthnicity}</h1>
            </div>
          </div>
          <div>
          <h1 className="ml-4 mr-4 mt-2 mb-2">{showWhy ? application.description : ""}</h1>
          </div>
          <div className="flex flex-col pl-4 pr-4 gap-2 mt-2 mb-4">
          <button
              className="text-center bg-rose-500 text-white text-[15px] rounded-full h-[35px]  w-auto hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300"
              onClick={() => setShowWhy(!showWhy)}
            >
              {showWhy ? "Hide" : "Why Hire Me?"}
            </button>
            <button className="text-center bg-lime-500 text-white text-[15px] rounded-full h-[35px]  w-auto hover:bg-white hover:text-green-500 hover:border-[2px] hover:border-green-500 hover:ease-in-out duration-300">
              Accept
            </button>
            </div>
        </div>
      </div>
      
    </>
  );
};
