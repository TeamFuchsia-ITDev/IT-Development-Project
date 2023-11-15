"use client";

import blankprofile from "@/app/images/blank-profile.jpg";
import quote from "@/app/images/quote.svg";

export const TestimonialCard = () => {
  return (
    <div className="mt-4">
     {/* <div className="flex flex-col w-[350px] rounded-[10px]"
     style={{ boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)" }}>
      
      <div className="flex  h-[80px] justify-center rounded-t-[10px]"  >
      <img src={blankprofile.src} alt="Serve-Ease"  className="rounded-full w-[70px] h-[70px] object-cover border-white border-4"/>
      </div>
        <div className="flex flex-col ">
        <img src={quote.src} alt="" className="inline-block w-[20px] ml-4 mt-4"/>
            <p className=" text-[15px] mt-4 "> Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quibusdam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quibusdam</p>
            </div>   
            <div className="text-center mt-4">
             <p className="text-xl font-bold mt-2">John Doe</p>
            <p className="mb-4">Senior Citizen</p>
            </div>
     </div> */}
     <div className="flex flex-col w-[350px] rounded-[10px] border-2">
    <div>
    <img src={blankprofile.src} alt="Serve-Ease"  className="rounded-full w-[70px] h-[70px] object-cover border-white border-4"/>
    
    </div>
     </div>
    </div>
  );
};
