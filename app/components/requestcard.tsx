"use client";

import { ApplicationProps, RequestProps } from "@/app/libs/interfaces";
import { useState, useEffect } from "react";
import { imageMapping } from "@/app/libs/reusables";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { limitText } from "@/app/libs/actions";

export const RequestCard = ({ request }: { request: RequestProps }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [applications, setApplications] = useState([]);
  const [truncatedDescription, setTruncatedDescription] = useState<string>(
    request?.description ?? ""
  );

  const canceledRequest = async (requestid: string) => {
    setDisabled(true);
    toast.loading("Cancelled request...", {
      duration: 4000,
    });

    const response = await axios.patch(`api/user/request`, {
      data: { requestid },
    });

    if (response.status !== 200) {
      const errorMessage = response.data?.error || "An error occurred";
      toast.error(errorMessage);
    } else {
      toast.success("Request cancelled successfully!");
    }
    setTimeout(() => {
      toast.dismiss();
      window.location.reload();
    }, 2000);
    setTimeout(() => setDisabled(false), 4000);
  };

  useEffect(() => {
    const getApplications = async () => {
      const response = await fetch(`/api/user/applications/${request?.id}`);
      const data = await response.json();
      const filteredData = data.filter(
        (app: ApplicationProps) => app.status === "Pending"
      );
      setApplications(filteredData);
    };
    if (request?.id) getApplications();
  }, []);

  useEffect(() => {
    setTruncatedDescription(limitText(request?.description ?? "", 35));
  }, [request]);

  return (
    <>
      <div
        className="shadow-xl border-2  h-auto w-[390px] mb-4 rounded-[10px] hover:ease-in-out duration-300 "
        style={{ boxShadow: "4px 4px 10px rgba(153, 153, 153, 100%)" }}
      >
        <img src={imageMapping[request?.category!]} className="rounded-t-lg" />
        <div className="flex flex-row">
          <img
            src={request?.requesterImage}
            className="object-cover  ml-4 w-[90px] h-[90px]  rounded-full mt-[-30px]  border-4 border-white"
            style={{
              boxShadow: "4px 4px 10px rgba(153, 153, 153, 100%)",
            }}
          />
          <div className="flex flex-col justify-center ml-2">
            <p className="text-[15px]">{request?.requesterName}</p>
            <p className="text-[12px]">{request?.requesterCity}</p>
          </div>
          <div className="ml-auto mr-2 mt-4 text-rose-500">
            <p className="font-bold text-[12px]">{request?.category}</p>
          </div>
        </div>
        <div className="ml-6 mr-6">
          <p className="text-[20px] font-bold mt-4">{request?.taskname}</p>
          <p className="text-[12px] text-gray-500">
            {new Date(request?.datetime!).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className=" md:text-[14px] 2xl:text-[18px] overflow-hidden">
            {showOptions ? request?.description : truncatedDescription}
          </p>
        </div>
        {showOptions && (
          <div className="flex flex-col justify-center items-center mt-4">
            <button className="text-center bg-orange-500 text-white mb-4 rounded-full h-[40px]  w-[360px] hover:bg-white hover:text-yellow-500 hover:border-[2px] hover:border-yellow-500 hover:ease-in-out duration-300">
              Edit Request
            </button>

            <button
              className={`text-center bg-rose-500 text-white rounded-full h-[40px]  w-[360px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300 ${
                disabled ? "pointer-events-none opacity-25" : ""
              }`}
              onClick={() => canceledRequest(request?.id!)}
              disabled={disabled}
            >
              Cancel Request
            </button>

            <Link
              href={`/applicants?id=${request?.id}`}
              className={`${
                applications.length > 0 ? "" : "pointer-events-none"
              }`}
            >
              <button
                className={`text-center ${
                  applications.length > 0
                    ? "bg-blue-600"
                    : "bg-blue-600 opacity-50 pointer-events-none"
                } text-white mt-4 rounded-full h-[40px]  w-[360px] hover:bg-white hover:text-blue-500 hover:border-[2px] hover:border-blue-500 hover:ease-in-out duration-300`}
              >
                {applications.length > 0
                  ? `View Applications (${applications.length})`
                  : "No Applications Yet"}
              </button>
            </Link>
          </div>
        )}
        <div className="flex flex-col justify-center items-center mt-4 mb-4">
          <button
            className="text-center bg-green-500 text-white  mb-0 rounded-full h-[40px]  w-[360px]  hover:bg-white hover:text-green-500 hover:border-[2px] hover:border-green-500 hover:ease-in-out duration-300"
            onClick={() => setShowOptions(!showOptions)}
          >
            {showOptions ? "Hide Options" : "Show Options"}
          </button>
        </div>
      </div>
    </>
  );
};
