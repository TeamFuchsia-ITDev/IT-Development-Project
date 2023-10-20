"use client";

import { CardProps } from "@/app/libs/interfaces";
import { useEffect, useState } from "react";
import { imageMapping } from "@/app/libs/reusables";
import { limitText } from "@/app/libs/actions";

export const Card = ({
  smallCard,
  request,
  toggleFormVisibility,
  onApplyClick,
}: CardProps) => {
  const [truncatedTaskName, setTruncatedTaskName] = useState<string>(
    request?.taskname ?? ""
  );

  const [truncatedTNsmall, setTruncatedTNsmall] = useState<string>(
    request?.taskname ?? ""
  );

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setTruncatedTNsmall(limitText(request?.taskname ?? "", 25));
  }, [request]);

  // Use useEffect to update truncatedTaskName when request changes
  useEffect(() => {
    setTruncatedTaskName(limitText(request?.taskname ?? "", 20));
  }, [request]);

  const handleApplyClick = () => {
    const requestData = {
      id: request?.id!,
      taskname: request?.taskname!,
      requesterName: request?.requesterName!,
      datetime: new Date(request?.datetime!).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    onApplyClick(requestData);
    toggleFormVisibility(true);
  };

  return (
    <>
      {smallCard ? (
        <main className=" border-2 w-[300px] h-auto rounded-[10px]">
          <div className="">
            <img src={imageMapping[request?.category!]} className="rounded-t-lg" />				
            <div className="ml-2 mr-2" >
              <div className="flex flex-row">
                <img
                  src={request?.requesterImage}
                  className="w-[50px] h-[50px] rounded-full border-2 object-cover border-white mt-[-20px]"
                  style={{
                    boxShadow: "4px 4px 10px rgba(153, 153, 153, 100%)",
                  }}
                />
                <div className="flex flex-col justify-center ml-2">
                  <p className="text-[12px]">{request?.requesterName}</p>
                  <p className="text-gray-500 text-[12px]">
                    {request?.requesterCity}
                  </p>
                  
                </div>
                <div className="ml-auto  mt-4 text-rose-500">
                  <p className="font-bold text-[10px]">{request?.category}</p>
                </div>
              </div>
              <div className="flex flex-col pl-2">
                <p className="text-[20px] font-bold mt-4">{truncatedTNsmall}</p>
                <p className="  text-gray-500 text-[12px]">
                  {new Date(request?.datetime!).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            {showDetails && (
              <div className="flex flex-col gap-2 ">
                <p className="pl-4">{request?.description}</p>

                <div className="flex justify-center">
                  <button
                    className="text-center h-[35px] w-[270px] bg-green-500 text-white text-[11px] font-bold rounded-full hover:bg-white hover:text-green-500 hover:border-[2px] hover:border-green-500 hover:ease-in-out duration-300 "
                    onClick={handleApplyClick}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
            <div className="flex justify-center mt-2">
              <button
                className="text-center bg-rose-500 text-white text-[11px] font-bold  w-[270px] h-[35px] rounded-full hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300  mb-4"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "Hide Description" : "Show Task Description"}
              </button>
            </div>
          </div>
        </main>
      ) : (
        <div
          className="border-2 border-gray-300  h-[410px] md:w-[448px] md:h-auto 2xl:w-[571px] 2xl:h-auto rounded-[10px] hover:transform hover:scale-105 transition-transform duration-300 ease-in-out"
          style={{ boxShadow: "4px 4px 10px rgba(153, 153, 153, 100%)" }}
        >
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
          <p className="text-[35px] font-bold ml-4 ">{truncatedTaskName} </p>
          <p className="mb-6 ml-4 text-gray-500 text-[17px]">
            {new Date(request?.datetime!).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          {/* <div className={`flex flex-col mt-4 gap-2 items-start mt-[-35px] ml-4 mb-4 transition-all transform duration-300 ${showDetails ? 'scale-y-200' : 'scale-y-0'}`}></div> */}
          <div className="flex flex-col mt-4 gap-2 items-start mt-[-35px] ml-4 mb-4">
            {showDetails && (
              <div className="flex flex-col  mt-4 gap-2 ">
                <p className="">{request?.description}</p>
                <div className="flex items-center justify-center">
                  <button
                    className="text-center bg-green-500 text-white font-bold md:w-[410px]  h-[40px] hover:bg-white hover:text-green-500 hover:border-[2px] hover:border-green-500 hover:ease-in-out duration-300 2xl:w-[535px] 2xl:h-[45px] "
                    onClick={handleApplyClick}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center">
            <button
              className="text-center bg-rose-500 text-white font-bold md:w-[410px] h-[40px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300 2xl:w-[535px] 2xl:h-[45px] mb-4 shadow-xl"
              onClick={() => setShowDetails(!showDetails)}             
            >
              {showDetails ? "Hide Description" : "Show Task Description"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
