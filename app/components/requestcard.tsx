"use client";

import {
  ApplicationProps,
  RequestCardProps,
  RequestProps,
} from "@/app/libs/interfaces";
import { useState, useEffect } from "react";
import { imageMapping } from "@/app/libs/reusables";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  toggleFormVisibility,
  onEditRequestClick,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [applications, setApplications] = useState([]);

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
      setApplications(data);
    };
    if (request?.id) getApplications();
  }, []);

  const applicationsLength = applications.filter(
    (app: ApplicationProps) => app.status === "Pending"
  ).length;

  const acceptedApplicationsLength = applications.filter(
    (app: ApplicationProps) => app.status === "Accepted"
  ).length;

  const handleEditRequestClick = () => {
    const requestData: RequestProps = {
      id: request?.id!,
      taskname: request?.taskname!,
      category: request?.category!,
      datetime: request?.datetime!,
      description: request?.description!,
      userEmail: request?.userEmail!,
      requesterName: request?.requesterName!,
      requesterImage: request?.requesterImage!,
      requesterCity: request?.requesterCity!,
      status: request?.status!,
      compNeeded: request?.compNeeded!,
    };
    onEditRequestClick(requestData);
    toggleFormVisibility(true);
  };

  return (
    <>
      <div
        className=" h-auto w-[400px] mb-4 rounded-[10px] hover:translate-y-[-20px] mt-5"
        style={{ boxShadow: "2px 2px 6px rgba(153, 153, 153, 100%)" }}
      >
        <div className="flex justify-center items-center">
          {request?.status === "Lapsed" ? (
            <p className="absolute text-red-500 bg-red-500 text-white p-2 rounded-lg ">
              THIS REQUEST HAS LAPSED
            </p>
          ) : null}
          <img
            src={imageMapping[request?.category!]}
            className="rounded-t-lg"
          />
        </div>

        <div className="flex flex-row">
          <img
            src={request?.requesterImage}
            className="object-cover  ml-4 w-[70px] h-[70px]  rounded-full mt-[-30px]  border-4 border-white"
            style={{
              boxShadow: "4px 4px 10px rgba(153, 153, 153, 100%)",
            }}
          />
          <div className="flex flex-col justify-center ml-2">
            <p className="text-[15px]">{request?.requesterName}</p>
            <p className="text-[12px] text-gray-500">
              {request?.requesterCity}
            </p>
          </div>
          <div className="ml-auto mr-2 text-rose-500">
            <p className="font-bold text-[15px]">{request?.category}</p>
            {request?.status !== "Pending" &&
            request?.status !== "Lapsed" ? null : (
              <p className=" text-[12px]">
                Companion needed{" "}
                {`${
                  applications.filter(
                    (app: ApplicationProps) => app.status === "Accepted"
                  ).length
                }/${request?.compNeeded}`}
              </p>
            )}
          </div>
        </div>
        <div className="ml-6 mr-6">
          <p
            className={`text-[20px] font-bold mt-6 ${
              showOptions ? "break-words" : "truncate"
            }`}
          >
            {request?.taskname}
          </p>
          <p className="text-[12px] text-gray-500">
            {new Date(request?.datetime!).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <p
            className={` md:text-[14px] 2xl:text-[18px] ${
              showOptions ? "break-words" : "truncate"
            }`}
          >
            {request?.description}
          </p>
        </div>
        {showOptions && (
          <div className="flex flex-col justify-center items-center mt-4">
            {request?.status === "Pending" || request?.status === "Lapsed" ? (
              <button
                className="text-center bg-orange-500 text-white mb-4 rounded-full h-[35px]  w-[350px] hover:bg-white hover:text-yellow-500 hover:border-[2px] hover:border-yellow-500 hover:ease-in-out duration-300"
                onClick={handleEditRequestClick}
              >
                {request?.status === "Pending"
                  ? "Edit Request"
                  : "Update Request"}
              </button>
            ) : null}

            {request?.status === "Pending" ||
            request?.status === "OnGoing" ||
            request?.status === "Lapsed" ? (
              <button
                className={`text-center bg-rose-500 text-white rounded-full h-[35px]  w-[350px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300 ${
                  disabled ? "pointer-events-none opacity-25" : ""
                }`}
                onClick={() => canceledRequest(request?.id!)}
                disabled={disabled}
              >
                Cancel Request
              </button>
            ) : null}

            {request?.status === "OnGoing" ? (
              <button
                className={`mt-4 text-center bg-blue-500 text-white rounded-full h-[35px]  w-[350px] hover:bg-white hover:text-blue-500 hover:border-[2px] hover:border-blue-500 hover:ease-in-out duration-300 ${
                  disabled ? "pointer-events-none opacity-25" : ""
                }`}
              >
                Request Completed
              </button>
            ) : null}

            {request?.status === "Pending" ? (
              <Link
                href={`/applicants?id=${request?.id}`}
                className={`${
                  applicationsLength > 0
                    ? ""
                    : acceptedApplicationsLength > 0
                    ? ""
                    : "pointer-events-none"
                }`}
              >
                <button
                  className={`text-center ${
                    applicationsLength > 0
                      ? "bg-blue-500"
                      : acceptedApplicationsLength > 0
                      ? "bg-blue-500"
                      : "bg-blue-500 opacity-50 pointer-events-none"
                  } text-white mt-4 rounded-full h-[35px] w-[350px] hover:bg-white hover:text-blue-500 hover:border-[2px] hover:border-blue-500 hover:ease-in-out duration-300`}
                >
                  {applicationsLength > 0
                    ? `View Applications (${applicationsLength})`
                    : acceptedApplicationsLength > 0
                    ? `View Applicants`
                    : "No Applications yet"}
                </button>
              </Link>
            ) : null}
          </div>
        )}
        <div className="flex flex-col justify-center items-center mt-4 mb-4">
          <button
            className="text-center bg-green-500 text-white  mb-4 rounded-full h-[35px]  w-[350px]  hover:bg-white hover:text-green-500 hover:border-[2px] hover:border-green-500 hover:ease-in-out duration-300"
            onClick={() => setShowOptions(!showOptions)}
          >
            {showOptions ? "Hide Options" : "Show Options"}
          </button>
        </div>
      </div>
    </>
  );
};
