"use client";

import { ApplicationProps, CardProps } from "@/app/libs/interfaces";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { imageMapping } from "@/app/libs/reusables";
import { limitText } from "@/app/libs/actions";
import Link from "next/link";
import axios from "axios";

export const Card = ({
  cardType,
  request,
  toggleFormVisibility,
  onApplyClick,
}: CardProps) => {
  const { data: session, status } = useSession();
  const [showDetails, setShowDetails] = useState(false);
  const [applications, setApplications] = useState([]);
  const [applicationStatus, setApplicationStatus] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    const getApplications = async () => {
      const response = await axios.get(`/api/user/application`);
      const data = await response.data.applications;
      setApplications(data);
    };

    if (status !== "loading" && session?.user.email) {
      getApplications();
    }
  }, []);

  useEffect(() => {
    const appStatus: ApplicationProps[] = applications.filter(
      (app: ApplicationProps) =>
        app.requestId === request?.id &&
        app.userEmail === session?.user.email &&
        (app.status === "Pending" || app.status === "Accepted")
    );

    setApplicationStatus(
      appStatus.length > 0 ? appStatus[0].status : "No Status Found"
    );
  }, [applications, request, session]);


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
      {cardType === "allRequests" ? (
        <main className=" border-2 w-[300px] h-auto rounded-[10px] hover:translate-y-[-20px] mt-5">
          <div className="">
            <img
              src={imageMapping[request?.category!]}
              className="rounded-t-lg"
            />
            <div className="ml-2 mr-2">
              <div className="flex flex-row">
                <Link
                  href={{
                    pathname: "/profilepage",
                    query: `user=${request?.userEmail}`,
                  }}
                >
                  <img
                    src={request?.requesterImage}
                    className="w-[50px] h-[50px] rounded-full border-2 object-cover border-white mt-[-20px]"
                    style={{
                      boxShadow: "2px 2px 6px rgba(153, 153, 153, 100%)",
                    }}
                    title={"Click to view profile"}
                  />
                </Link>
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
                <p className={`text-[20px] font-bold mt-4 ${showDetails ? "break-words" : "truncate"}` }>{request?.taskname}</p>
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
      ) : null}

      {cardType === "pendingApplication" ? (
        <main className=" border-2 w-[300px] h-auto rounded-[10px] hover:translate-y-[-20px] mt-5">
          <div className="">
            <img
              src={imageMapping[request?.category!]}
              className="rounded-t-lg"
            />
            <div className="ml-2 mr-2">
              <div className="flex flex-row">
                <Link
                  href={{
                    pathname: "/profilepage",
                    query: `user=${request?.userEmail}`,
                  }}
                >
                  <img
                    src={request?.requesterImage}
                    className="w-[50px] h-[50px] rounded-full border-2 object-cover border-white mt-[-15px]"
                    style={{
                      boxShadow: "2px 2px 6px rgba(153, 153, 153, 100%)",
                    }}
                    title={"Click to view profile"}
                  />
                </Link>
                <div className="flex flex-col justify-center ml-2 pt-1">
                  <p className="text-[12px]">{request?.requesterName}</p>
                  <p className="text-gray-500 text-[12px]">
                    {request?.requesterCity}
                  </p>
                </div>
                <div className="ml-auto mt-2 text-rose-500">
                  <p className="font-bold text-[10px]">{request?.category}</p>
                  <div className=" text-[10px] text-blue-500">
                    {" "}
                    <p
                      className={
                        applicationStatus === "Accepted"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }
                    >
                      {applicationStatus}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col pl-2">
             <p className={`text-[20px] font-bold mt-4 ${showDetails ? "break-words" : "truncate"}` }>{request?.taskname}</p>
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
                    View Application
                  </button>
                </div>
              </div>
            )}
            <div className="flex justify-center mt-2">
              <button
                className="text-center bg-rose-500 text-white text-[11px] font-bold  w-[270px] h-[35px] rounded-full hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300  mb-4"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "Hide Options" : "Show options"}
              </button>
            </div>
          </div>
        </main>
      ) : null}


      {cardType === "ongoingtasks" ? (
        <main className=" border-2 w-[300px] h-auto rounded-[10px] hover:translate-y-[-20px] mt-5">
          <div className="">
            <img
              src={imageMapping[request?.category!]}
              className="rounded-t-lg"
            />
            <div className="ml-2 mr-2">
              <div className="flex flex-row">
                <Link
                  href={{
                    pathname: "/profilepage",
                    query: `user=${request?.userEmail}`,
                  }}
                >
                  <img
                    src={request?.requesterImage}
                    className="w-[50px] h-[50px] rounded-full border-2 object-cover border-white mt-[-15px]"
                    style={{
                      boxShadow: "2px 2px 6px rgba(153, 153, 153, 100%)",
                    }}
                    title={"Click to view profile"}
                  />
                </Link>
                <div className="flex flex-col justify-center ml-2 pt-1">
                  <p className="text-[12px]">{request?.requesterName}</p>
                  <p className="text-gray-500 text-[12px]">
                    {request?.requesterCity}
                  </p>
                </div>
                <div className="ml-auto mt-2 text-rose-500">
                  <p className="font-bold text-[10px]">{request?.category}</p>
                  <div className=" text-[10px] text-blue-500">
                    {" "}
                    <p
                      className={
                        applicationStatus === "Accepted"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }
                    >
                      {applicationStatus}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col pl-2">
             <p className={`text-[20px] font-bold mt-4 ${showDetails ? "break-words" : "truncate"}` }>{request?.taskname}</p>
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
                    className="text-center h-[35px] w-[270px] bg-blue-500 text-white text-[11px] font-bold rounded-full hover:bg-white hover:text-blue-500 hover:border-[2px] hover:border-blue-500 hover:ease-in-out duration-300 "
                  >
                    Get Directions
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    className="text-center h-[35px] w-[270px] bg-red-500 text-white text-[11px] font-bold rounded-full hover:bg-white hover:text-red-500 hover:border-[2px] hover:border-red-500 hover:ease-in-out duration-300 "
                  >
                    Cancel Task
                  </button>
                </div>
              </div>
            )}
            <div className="flex justify-center mt-2">
              <button
                className="text-center bg-rose-500 text-white text-[11px] font-bold  w-[270px] h-[35px] rounded-full hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300  mb-4"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "Hide Options" : "Show options"}
              </button>
            </div>
          </div>
        </main>
      ) : null}


       {cardType === "cancelledRequest" ? (
        <main className=" border-2 w-[300px] h-auto rounded-[10px] hover:translate-y-[-20px] mt-5">
          <div className="">
            <img
              src={imageMapping[request?.category!]}
              className="rounded-t-lg"
            />
            <div className="ml-2 mr-2">
              <div className="flex flex-row">
                <Link
                  href={{
                    pathname: "/profilepage",
                    query: `user=${request?.userEmail}`,
                  }}
                >
                  <img
                    src={request?.requesterImage}
                    className="w-[50px] h-[50px] rounded-full border-2 object-cover border-white mt-[-15px]"
                    style={{
                      boxShadow: "2px 2px 6px rgba(153, 153, 153, 100%)",
                    }}
                    title={"Click to view profile"}
                  />
                </Link>
                <div className="flex flex-col justify-center ml-2 pt-1">
                  <p className="text-[12px]">{request?.requesterName}</p>
                  <p className="text-gray-500 text-[12px]">
                    {request?.requesterCity}
                  </p>
                </div>
                <div className="ml-auto mt-2 text-rose-500">
                  <p className="font-bold text-[10px]">{request?.category}</p>
                  <div className=" text-[10px] text-blue-500">
                    {" "}
                    <p
                      className={
                        applicationStatus === "Accepted"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }
                    >
                      {applicationStatus}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col pl-2">
             <p className={`text-[20px] font-bold mt-4 ${showDetails ? "break-words" : "truncate"}` }>{request?.taskname}</p>
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
                    className="text-center h-[35px] w-[270px] bg-red-500 text-white text-[11px] font-bold rounded-full hover:bg-white hover:text-red-500 hover:border-[2px] hover:border-red-500 hover:ease-in-out duration-300 "
                  >
                    Remove to Dashboard
                  </button>
                </div>
              </div>
            )}
            <div className="flex justify-center mt-2">
              <button
                className="text-center bg-rose-500 text-white text-[11px] font-bold  w-[270px] h-[35px] rounded-full hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300  mb-4"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "Hide Options" : "Show options"}
              </button>
            </div>
          </div>
        </main>
      ) : null}
    </>
  );
};
