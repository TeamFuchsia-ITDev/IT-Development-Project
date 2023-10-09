'use client'

import gaming from "../images/gaming.png"
import blankprofile from "../images/blank-profile.jpg"

export const Card = ({ smallCard }) => {
    const cardClasses = `
    border-2 rounded-[20px] shadow-lg 
  
    ${smallCard ? 'w-[180px] h-[180px]' : ''}
  `;
    return (
        <>
            {smallCard ?
                <div className="border-2 w-[300px] h-[360px] rounded-[10px]  hover:ease-in-out duration-300  hover:border-[2px] hover:border-rose-500 ">
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
                    <div className="flex flex-col mt-6 gap-4 text-center items-center">
                        <p className="text-[20px]">Coding With me</p>
                        <p className="text-[11px]"> Technology</p>
                        <p className="text-[11px]">MM/DD/TIME</p>
                        <button
                  className="text-center bg-rose-500 text-white font-bold w-[165px] text-[11px] rounded h-[25px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300">
                  Learn more
                </button>

                    </div>
                    <div>

                    </div>
                </div>


                : <div className="border-2 w-[380px] h-[430px] rounded-[10px] shadow-lg hover:ease-in-out duration-300  hover:border-[2px] hover:border-rose-500 ">
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
                    <div className="flex flex-col mt-6 gap-4 text-center items-center">
                        <p className="text-[30px]">Coding With me</p>
                        <p>Technology</p>
                        <p>MM/DD/TIME</p>
                        <button
                  className="text-center bg-rose-500 text-white font-bold w-[195px] rounded h-[35px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300">
                  Learn more
                </button>

                    </div>
                    <div>

                    </div>
                </div>}
        </>
    )
}