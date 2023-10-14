'use client'
"use client"

import { RequestProps } from "@/app/libs/interfaces"
import { useEffect, useState } from "react"
import { imageMapping } from "@/app/libs/reusables"
import technology from "@/app/images/technology.png"


export const RequestCard = ({ request }: { request: RequestProps }) => {


    return (
        <>
            <div className="shadow-xl border-2 w-[300px] h-auto mb-4 rounded-[10px] hover:ease-in-out duration-300 2xl:w-[410px] 2xl:h-auto md:w-[405px] md:h-auto" style={{ boxShadow: "4px 4px 10px rgba(153, 153, 153, 100%)" }}>

                <img
                    src={imageMapping[request?.category!]}
                    className="rounded-[9px]"
                />
                <div className="flex flex-row">
                    <img
                        src={request?.requesterImage}
                        className="object-cover w-[90px] h-[90px] rounded-full mt-[-30px] ml-4 border-4 border-white"
                    />
                    <div className="flex flex-col justify-center ml-2">
                        <p>{request?.requesterName}</p>
                        <p className="text-gray-500">{request?.requesterCity}</p>
                    </div>
                    <div className="ml-auto mr-4 mt-4 text-rose-500">
                        <p className="font-bold">{request?.category}</p>
                    </div>
                </div>

                <div className="ml-6 mr-6">
                    <p className="text-[20px] font-bold mt-4">{request?.taskname}</p>
                    <p className="text-gray-500 ">
                        {new Date(request?.datetime!).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                    <p className="">{request?.description}</p>
                </div>

                <div className="flex flex-col justify-center items-center mt-4">
                    <button className="text-center bg-orange-500 text-white mb-4 rounded h-[40px] md:w-[360px] hover:bg-white hover:text-yellow-500 hover:border-[2px] hover:border-yellow-500 hover:ease-in-out duration-300">Edit Request</button>
                    <button className="text-center bg-rose-500 text-white  mb-4 rounded h-[40px] md:w-[360px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300">Cancel Request</button>
                </div>

            </div>
        </>
    )
}