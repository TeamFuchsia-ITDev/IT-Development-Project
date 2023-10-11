'use client'

import gaming from "../images/gaming.png"
import blankprofile from "../images/blank-profile.jpg"
import { RequestProps } from "../libs/interfaces"
import { useEffect, useState } from "react"


interface CardProps {
    smallCard?: boolean
    request?: RequestProps

}

export const Card = ({ smallCard, request }: CardProps) => {

    const [truncatedTaskName, setTruncatedTaskName] = useState<string>(request?.taskname ?? "");

    // Function to limit the text length
    const limitText = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + "...";
        }
        return text;
    };

    // Use useEffect to update truncatedTaskName when request changes
    useEffect(() => {
        setTruncatedTaskName(limitText(request?.taskname ?? "", 20));
    }, [request]);

    return (
        <>
            {smallCard ?
                <div className="shadow-xl border-2 w-[300px] h-[260px] rounded-[5px] hover:ease-in-out duration-300  2xl:w-[410px] 2xl:h-[365px] md:w-[325px] md:h-[310px]">
                    <div className="flex items-center justify-center mt-2">
                        <img
                            src={gaming.src}
                            className="rounded-[5px] w-[275px] 2xl:w-[385px] md:w-[307px]"
                        /></div>
                    <div className="flex flex-col items-end ">
                        <img
                            src={request?.requesterImage}
                            className=" object-cover w-[60px] h-[60px] rounded-full mt-[-35px] mr-4 border-4 border-white"

                        />
                    </div>
                    <div className="flex flex-col ml-3 mt-[-20px] 2xl:ml-3 gap-2">
                        <p className="text-[20px] font-bold">{truncatedTaskName}</p>
                        <p className="text-[13px]">{request?.requesterName}</p>
                        <p className="text-[13px]">{request?.category}</p>
						{/* <p className="text-[11px] mt-2">{request?.requesterCity}</p> */}
						<p className="text-[13px]">$ {request?.amount} CAD</p>
                        <p className="text-[13px]"> {new Date(request?.datetime!).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}</p>
                    
                        


                    </div>
                    <div className="flex justify-center mt-2">
                        <button
                            className="text-center bg-rose-500 text-white font-bold w-[280px] text-[11px] rounded h-[25px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300 2xl:w-[390px] 2xl:h-[40px] 2xl:mt-[7px] md:w-[305px]">
                            Learn more
                        </button>
                    </div>
                </div>


                : <div className="border-2 border-gray-200 w-[440px] h-[410px] md:h-[410px] 2xl:w-[565px] 2xl:h-[465px] rounded-[10px] shadow-lg hover:transform hover:scale-105 hover:shadow-xl transition-transform duration-300 ease-in-out">
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
                    <div className="flex flex-col mt-4 gap-2 items-start mt-[-35px] ml-4 mb-4">
                        <p className="text-[30px] font-bold">{truncatedTaskName} </p>
                        <p>{request?.requesterName}</p>
                        <p>{request?.category}</p>
						<p>$ {request?.amount} CAD</p>
                        <p className=" "> {new Date(request?.datetime!).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}</p>

                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            className="text-center bg-rose-500 text-white font-bold w-[410px] rounded h-[35px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300 2xl:w-[535px] 2xl:h-[45px]">
                            Learn more
                        </button>

                    </div>
                </div>}
        </>
    )
}