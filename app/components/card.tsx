'use client'

import gaming from "../images/gaming.png"
import blankprofile from "../images/blank-profile.jpg"
import { RequestProps } from "../libs/interfaces"

interface CardProps {
    smallCard?: boolean
    request?: RequestProps

}

export const Card = ({ smallCard, request }: CardProps) => {

    return (
        <>
            {smallCard ?
                <div className="border-2 w-[300px] h-[260px] rounded-[10px] bg-neutral-900 text-white hover:ease-in-out duration-300  hover:border-[2px]  ">
                    <div className="flex items-center justify-center mt-2">
                        <img
                            src={gaming.src}
                            className="rounded-[5px] w-[275px]"
                        /></div>
                    <div className="flex flex-col items-end ">
                        <img
                            src={request?.requesterImage}
                            className=" object-cover w-[50px] h-[50px] rounded-full mt-[-28px] mr-4 border-4 border-neutral-900"

                        />
                    </div>
                    <div className="flex flex-col ml-2 mt-[-20px]">
                        <p className="text-[20px]">{request?.taskname}</p>
                        <p>{request?.requesterName}</p>
                        <p className="text-[11px] mt-2"> {request?.category}</p>
                        <p className="text-[11px] mt-2"> {new Date(request?.datetime!).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}</p>


                    </div>
                    <div className="flex justify-center mt-2">
                        <button
                            className="text-center bg-rose-500 text-white font-bold w-[280px] text-[11px] rounded h-[25px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300">
                            Learn more
                        </button>
                    </div>
                </div>


                : <div className="border-2 w-[420px] h-[440px] bg-neutral-900 text-white rounded-[10px] shadow-lg hover:ease-in-out duration-300  hover:border-[2px] hover:border-rose-500 ">
                    <div className="flex items-center justify-center mt-2">
                        <img
                            src={gaming.src}
                            className="rounded-[5px] w-[400px]"
                        /></div>
                    <div className="flex flex-col items-center ">
                        <img
                            src={blankprofile.src}
                            className=" object-cover w-[80px] h-[80px] rounded-full mt-[-40px] border-4 border-neutral-900"

                        /><p>Michael Chua</p>
                    </div>
                    <div className="flex flex-col mt-4 gap-4 items-center">
                        <p className="text-[30px]">Coding With me</p>
                        <p>Technology</p>
                        <p>October 20 2023 at 9:00 PM</p>
                        <button
                            className="text-center bg-rose-500 text-white font-bold w-[305px] rounded h-[35px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300">
                            Learn more
                        </button>

                    </div>
                    <div>

                    </div>
                </div>}
        </>
    )
}