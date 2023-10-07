'use client'

import gaming from "../images/gaming.png"
import blankprofile from "../images/blank-profile.jpg"

export const Card = () => {
    return (
        <>
            <div className="border-2 w-[380px] h-[380px] rounded-[20px] shadow-lg">
                <img
                    src={gaming.src}
                    className="rounded-[5px]"
                />
                <div className="flex flex-col items-center ">
                    <img
                        src={blankprofile.src}
                        className=" object-cover w-[80px] h-[80px] rounded-full mt-[-40px] border-4 border-white"

                    /><p>Michael Chua</p>
                </div>
                <div className="flex flex-col mt-6 gap-6 ml-6">
                    <p>Task Name</p>
                    <p>Category</p>
                    <p>Date and Time</p>
                  
                </div>
               <div>
              
               </div>
            </div>
        </>
    )
}