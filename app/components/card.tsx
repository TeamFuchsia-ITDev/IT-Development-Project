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
                <div className="border-2 w-[300px] h-[260px] rounded-[5px]  hover:ease-in-out duration-300  hover:border-[2px]  2xl:w-[355px] 2xl:h-[290px] md:w-[270px]">
                    <div className="flex items-center justify-center mt-2">
                        <img
                            src={gaming.src}
                            className="rounded-[5px] w-[275px] 2xl:w-[330px] md:w-[250px]"
                        /></div>
                    <div className="flex flex-col items-end ">
                        <img
                            src={request?.requesterImage}
                            className=" object-cover w-[50px] h-[50px] rounded-full mt-[-28px] mr-4 border-4 border-white"

                        />
                    </div>
                    <div className="flex flex-col ml-2 mt-[-20px] 2xl:ml-3">
                        <p className="text-[20px]">{request?.taskname}</p>
                        <p>{request?.requesterName}</p>
                        <p className="text-[11px] mt-2">{request?.category}</p>
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
                            className="text-center bg-rose-500 text-white font-bold w-[280px] text-[11px] rounded h-[25px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300 2xl:w-[330px] 2xl:mt-[7px] md:w-[250px]">
                            Learn more
                        </button>
                    </div>
                </div>


                : <div className="border-2 w-[440px] h-[410px] 2xl:w-[565px] 2xl:h-[450px] ounded-[10px] shadow-lg hover:ease-in-out duration-300  ">
                    <div className="flex items-center justify-center mt-2">
                        <img
                            src={gaming.src}
                            className="rounded-[5px] w-[540px] 2xl:w-[540px] md:w-[415px]"
                        /></div>
                    <div className="flex flex-col items-end">
                        <img
                            src={request?.requesterImage}
                            className=" object-cover w-[80px] h-[80px] rounded-full mt-[-40px] border-4 border-white mr-6"

                        />
                    </div>
                    <div className="flex flex-col mt-4 gap-4 items-start mt-[-35px] ml-4 mb-4">
                        <p className="text-[30px]">{request?.taskname} </p>
                        <p>{request?.requesterName}</p>
                        <p>{request?.category}</p>
                        <p className="text-[11px] mt-2"> {new Date(request?.datetime!).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}</p>

                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            className="text-center bg-rose-500 text-white font-bold w-[410px] rounded h-[35px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300 2xl:w-[525px]">
                            Learn more
                        </button>

                    </div>
                </div>}
        </>
    )
}