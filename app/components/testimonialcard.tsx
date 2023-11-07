"use client";

import blankprofile from "@/app/images/blank-profile.jpg";
import quote from "@/app/images/quote.svg";

export const TestimonialCard = () => {
  return (
    <div>
     <div className="flex flex-col border-2 w-[300px] rounded-[10px]">
      <div className="flex bg-blue-500 h-[80px] justify-center rounded-t-[10px]" >
      <img src={blankprofile.src} alt="Serve-Ease"  className="rounded-full w-[70px] h-[70px] object-cover mt-[40px] border-white border-4"/>
      </div>
        <div className="flex flex-col ">
        <img src={quote.src} alt="" className="inline-block w-[20px] ml-4 mt-4"/>
            <p className="text-center text-[15px] mt-4"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quibusdam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quibusdam</p>
            </div>   
            <div className="text-center mt-4">
             <p className="text-xl font-bold mt-2">John Doe</p>
            <p className="mb-4">Senior Citizen</p>
            </div>
     </div>
    </div>
  );
};
