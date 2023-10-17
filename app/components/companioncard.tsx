"use client";

import { ApplicationProps } from "@/app/libs/interfaces";
import { useState } from "react";

export const CompanionCard = ({
  application,
}: {
  application: ApplicationProps;
}) => {
  const [showWhy, setShowWhy] = useState(false);

  function calculateAge(birthdate: string) {
    const birthYear = new Date(birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    return age;
  }
  return (
    <>
      <div className=" border-2  h-auto w-[410px] mb-4 rounded-[10px] hover:ease-in-out duration-300 ">
        <div className="flex flex-row pt-4 pl-4 pr-4 pb-4">
          <img
            src={application.compImage}
            className="rounded-[9px] h-[100px] w-[100px] object-cover"
          />
          <div className="flex flex-col justify-center ml-4 mr-6">
            <h1>
              <p>
                {application.compName}
                <br />
                <h1 className="text-gray-400">{application.compCity}</h1>
                <a className="">
                  {calculateAge(application.compBirthday).toString()}
                </a>
              </p>
            </h1>

            <h1 className="">{application.compEthnicity}</h1>
            <h1>
              RATE: <a className="text-rose-500">${application.amount}</a>
            </h1>
            <h1>{showWhy ? application.description : ""}</h1>
          </div>{" "}
          <div className="flex flex-col gap-2 justify-center m-auto align-center items-center">
            <button
              className="text-center bg-rose-500 text-white text-[15px] rounded-full h-[30px]  w-[100px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300"
              onClick={() => setShowWhy(!showWhy)}
            >
              why hire
            </button>
            <button className="text-center bg-green-500 text-white text-[15px] rounded-full h-[30px]  w-[100px] hover:bg-white hover:text-green-500 hover:border-[2px] hover:border-green-500 hover:ease-in-out duration-300">
              Accept
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
