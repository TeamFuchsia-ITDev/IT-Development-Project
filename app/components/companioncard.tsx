"use client";

import blankprofile from "@/app/images/blank-profile.jpg";

export const CompanionCard = ({}) => {
  return (
    <>
      <div className="shadow-xl border-2  h-auto w-[410px] mb-4 rounded-[10px] hover:ease-in-out duration-300 ">
        <div className="flex flex-row pt-4 pl-4 pr-4 pb-4">
          <img
            src={blankprofile.src}
            className="rounded-[9px] h-[100px] w-[100px] object-cover"
          />
          <div className="flex flex-col justify-center ml-4 mr-6">
            <h1>
              <p>
                Michael Chua <a className="text-gray-400">21</a>
              </p>
            </h1>
            <h1 className="text-gray-400">Vancouver</h1>
            <h1 className="">Filipino</h1> 
            <h1>I am a good fit for this job because i have experience with this before</h1> 
          </div>
        
        
          
          {" "}
          <div className="flex flex-col gap-2 justify-center m-auto align-center items-center">
            <button className="text-center bg-rose-500 text-white text-[15px] rounded-full h-[30px]  w-[100px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300">
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
