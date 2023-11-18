"use client";

import { FormEvent, useEffect, useState, Suspense, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import {
  UserProps,
  RequestProps,
  RequestData,
  ApplicationProps,
  CompPageData,
} from "@/app/libs/interfaces";
import { Navbar } from "@/app/components/navbar";
import { RequestCard } from "@/app/components/requestcard";
import Carousel from "@/app/components/carousel";
import toast from "react-hot-toast";
import { CategoryOptions } from "@/app/libs/reusables";
import { Card } from "@/app/components/card";
import ApplicationFormPopUp from "@/app/components/applicationform";
import { useMode } from "@/app/context/ModeContext";
import UpdateApplicationForm from "@/app/components/applicationEdit";
import EditRequest from "@/app/components/editRequest";
import search from "@/app/images/Search.svg";
import Dialogbox from "@/app/components/dialogbox";
import ReviewCard from "@/app/components/reviewcard";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserProps | undefined>(undefined);
  const [myRequests, setMyRequests] = useState<RequestProps[]>([]);
  const [page, setPage] = useState("Pending");
  const { mode } = useMode();
  const [compPage, setCompPage] = useState("Requests");

  const [isMounted, setisMounted] = useState(false);
  const searchParams = useSearchParams();
  const providerParams = searchParams.get("provider");
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (isMounted && session) {
      if (providerParams === "google" && !toastShownRef.current) {
        toast.success("Google successful login");
        toastShownRef.current = true;
      }
      if (providerParams === "facebook" && !toastShownRef.current) {
        toast.success("Facebook successful login");
        toastShownRef.current = true;
      }
      if (providerParams === "credentials" && !toastShownRef.current) {
        toast.success("Credentials successful login");
        toastShownRef.current = true;
      }
    }
  }, [isMounted, providerParams, session]);

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
    if (session?.user.isNewUser) {
      router.push("/create-profile");
    }
    setisMounted(true);
  }, [session, status, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `/api/user/profile/${session?.user.email}`
        );
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchUserRequests = async () => {
      try {
        const response = await axios.get(`/api/user/request`);
        const data = response.data;
        const filteredRequests = data.requests.filter(
          (request: RequestProps) => request.userEmail === session?.user.email
        );
        setMyRequests(filteredRequests);
      } catch (error) {
        console.error("Error fetching user requests:", error);
      }
    };

    if (
      status !== "loading" &&
      session?.user.email &&
      session.user.isNewUser === false
    ) {
      fetchUserData();
      fetchUserRequests();
    }
  }, [session?.user.email, status]);

  /** HOMEPAGE STUFF */

  /** Search Related useStates */
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [editable, setEditable] = useState(false);
  const [requestsData, setRequestsData] = useState({
    pendingRequests: [],
    activeRequests: [],
    cancelledRequests: [],
    completedRequests: [],
  });
  const [completedRequestData, setCompletedRequestData] =
    useState<RequestProps>();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDialogboxVisible, setIsDialogboxVisible] = useState(false);
  const [myApplications, setmyApplications] = useState<ApplicationProps[]>([]);
  const [myApplication, setMyApplication] = useState<ApplicationProps>();
  const [isReviewcardVisible, setIsReviewcardVisible] = useState(false);

  const [data, setData] = useState({
    requestid: "",
    amount: "",
    description: "",
    status: "",
  });

  const [applicationData, setapplicationData] = useState({
    taskname: "",
    requesterName: "",
    dateime: "",
  });

  const [editRequestData, setEditRequestData] = useState<RequestProps>({
    id: "",
    taskname: "",
    category: "",
    datetime: "",
    description: "",
    userEmail: "",
    requesterName: "",
    requesterImage: "",
    requesterCity: "",
    status: "",
    compNeeded: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`/api/user/profile/${session?.user.email}`);
      const data = await response.json();
      setUser(data);
    };

    const getRequests = async () => {
      const response = await axios.get(`/api/user/request`);
      const data = await response.data;

      const filterRequests = (status: string) => {
        return data.requests.filter(
          (request: RequestProps) =>
            request.userEmail !== session?.user.email &&
            request.status === status
        );
      };
      setRequestsData({
        pendingRequests: filterRequests("Pending"),
        activeRequests: filterRequests("OnGoing"),
        cancelledRequests: filterRequests("Cancelled"),
        completedRequests: filterRequests("Completed"),
      });

      const compPageData: CompPageData = {
        Requests: filterRequests("Pending"),
        Pending: filterRequests("Pending"),
        Active: filterRequests("OnGoing"),
        Completed: filterRequests("Completed"),
        Cancelled: filterRequests("Cancelled"),
        CancelledRequests: filterRequests("Cancelled"),
      };

      const uniqueCities = new Set<string>();

      const sourceArray = compPageData[compPage] || [];

      sourceArray.forEach((item: RequestProps) => {
        if (item.requesterCity) {
          uniqueCities.add(item.requesterCity);
        }
      });

      setCities(Array.from(uniqueCities));
    };

    const getApplications = async () => {
      const response = await axios.get(`/api/user/application`);
      const data = await response.data;
      const filtereredApplicationsByUser: ApplicationProps[] =
        data.applications.filter(
          (request: { userEmail: string; status: string }) =>
            request.userEmail === session?.user.email
        );
      setmyApplications(filtereredApplicationsByUser);
    };

    if (status !== "loading" && session?.user.email) {
      getUser();
      getRequests();
      getApplications();
    }
  }, [session?.user.email, status]);

  const compPageData: CompPageData = {
    Requests: requestsData.pendingRequests,
    Pending: requestsData.pendingRequests,
    Active: requestsData.activeRequests,
    Completed: requestsData.completedRequests,
    Cancelled: requestsData.cancelledRequests,
    CancelledRequests: requestsData.cancelledRequests,
  };

  const sourceArray = compPageData[compPage] || [];

  const searchFilteredRequests = sourceArray.filter((request: RequestProps) => {
    return (
      (request.taskname.includes(searchTerm) ||
        request.description.includes(searchTerm)) &&
      (selectedCategory === "" || request.category === selectedCategory) &&
      (selectedCity === "" || request.requesterCity === selectedCity)
    );
  });

  const handleApplyRequest = (requestData: RequestData) => {
    setData({ ...data, requestid: requestData.id });
    setapplicationData({
      taskname: requestData.taskname!,
      requesterName: requestData.requesterName!,
      dateime: requestData.datetime!,
    });
  };

  const handleViewApplication = (requestData: RequestData) => {
    setData({ ...data, requestid: requestData.id });
    setapplicationData({
      taskname: requestData.taskname!,
      requesterName: requestData.requesterName!,
      dateime: requestData.datetime!,
    });
    const applicationData = myApplications.find(
      (app) =>
        app.requestId === requestData.id &&
        (app.status === "Pending" || app.status === "Accepted")
    );
    setMyApplication(applicationData);
    setData({
      ...data,
      amount: applicationData?.amount.toString()!,
      description: applicationData?.description!,
      status: applicationData?.status!,
    });
  };

  const handleEditRequest = (requestData: RequestProps) => {
    setEditRequestData({
      id: requestData?.id!,
      taskname: requestData?.taskname!,
      category: requestData?.category!,
      datetime: requestData?.datetime!,
      description: requestData?.description!,
      userEmail: requestData?.userEmail!,
      requesterName: requestData?.requesterName!,
      requesterImage: requestData?.requesterImage!,
      requesterCity: requestData?.requesterCity!,
      status: requestData?.status!,
      compNeeded: requestData?.compNeeded!,
    });
  };

  const handleMarkAsCompleted = (requestData: RequestProps) => {
    setCompletedRequestData(requestData);
  };

  const postApplication = async (e: FormEvent) => {
    setDisabled(true);
    e.preventDefault();
    toast.loading("Sending application...", {
      duration: 4000,
    });

    const response = await axios.post(`api/user/application`, data);
    if (response.data.status !== 200) {
      const errorMessage = response.data?.error || "An error occurred";
      toast.error(errorMessage);
    } else {
      toast.success("Application successful!");
      setTimeout(
        () =>
          toast.loading("Redirecting now to the your jobs page...", {
            duration: 4000,
          }),
        1000
      );
      setTimeout(() => {
        toast.dismiss();
        window.location.reload();
      }, 2000);
    }
    setTimeout(() => setDisabled(false), 4000);
  };

  const updateApplication = async (e: FormEvent) => {
    setDisabled(true);
    toast.loading("Updating application...", {
      duration: 4000,
    });

    const response = await axios.patch(`api/user/applications`, {
      data: {
        requestId: myApplication?.requestId,
        applicationId: myApplication?.id,
        amount: data.amount,
        description: data.description,
      },
    });
    if (response.data.status !== 200) {
      const errorMessage = response.data?.error || "An error occurred";
      toast.error(errorMessage);
      setTimeout(() => setDisabled(false), 2000);
    } else {
      toast.success("Application successfully updated");
      setTimeout(() => {
        toast.dismiss();
        window.location.reload();
      }, 2000);
    }
  };

  const cancelApplication = async (e: FormEvent) => {
    setDisabled(true);
    toast.loading("Cancelling application...", {
      duration: 4000,
    });

    const response = await axios.patch(`api/user/application/cancel`, {
      data: {
        requestId: myApplication?.requestId,
        applicationId: myApplication?.id,
      },
    });
    if (response.data.status !== 200) {
      const errorMessage = response.data?.error || "An error occurred";
      toast.error(errorMessage);
      setTimeout(() => setDisabled(false), 2000);
    } else {
      toast.success("Application successfully cancelled");
      setTimeout(() => {
        toast.dismiss();
        window.location.reload();
      }, 2000);
    }
  };

  const updateRequest = async () => {
    setDisabled(true);
    toast.loading("Updating request...", {
      duration: 4000,
    });

    try {
      const response = await axios.patch(
        `/api/user/request/${editRequestData.id}`,
        {
          data: {
            taskname: editRequestData.taskname,
            category: editRequestData.category,
            compNeeded: editRequestData.compNeeded,
            datetime: editRequestData.datetime,
            description: editRequestData.description,
          },
        }
      );
      if (response.status !== 200) {
        const errorMessage = response.data?.error || "An error occurred";
        toast.error(errorMessage);
        setTimeout(() => setDisabled(false), 2000);
      } else {
        toast.success("Request successfully updated");
        setTimeout(() => {
          toast.dismiss();
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      toast.error("Something went wrong while updating your request");
    }
  };

  return (
    session?.user.isNewUser === false && (
      <main className="pl-24 pr-24">
        <Navbar />
        {mode ? (
          <div className={`mt-24`}>
            <div
              className={`text-center ${
                isFormVisible || isDialogboxVisible
                  ? "pointer-events-none blur-sm"
                  : ""
              }`}
            >
              <p className="text-[40px]">
                Welcome to your Dashboard{" "}
                {user?.name !== undefined ? user.name.split(" ")[0] : ""}
              </p>
              <p className="text-[16px] ">
                You are now signed in as a Requester. In here you will be able
                to see all the requests you
              </p>
              <p className=" ">
                have created. Need further explanation?{" "}
                <a href="#" className="text-blue-500 font-bold">
                  click here
                </a>
              </p>
            </div>
            <div
              className={`flex items-center justify-center mt-8 mb-4 ${
                isFormVisible || isDialogboxVisible
                  ? "pointer-events-none blur-sm"
                  : ""
              }`}
            >
              <div className="flex flex-row w-[100%] h-[40px]">
                <button
                  className={`${
                    page === "Pending"
                      ? " bg-white w-[25%] text-orange-500 font-bold border-t-4 border-orange-500 rounded-t-2xl"
                      : "  w-[25%] text-gray-400 bg-gray-100  rounded-t-2xl "
                  }`}
                  onClick={() => setPage("Pending")}
                >
                  Pending Request
                </button>
                <button
                  className={`${
                    page === "Active"
                      ? " bg-white w-[25%] text-green-500 font-bold border-t-4 border-green-500 rounded-t-2xl"
                      : "  w-[25%] text-gray-400 bg-gray-100 rounded-t-2xl "
                  }`}
                  onClick={() => setPage("Active")}
                >
                  Active Request
                </button>
                <button
                  className={`${
                    page === "Completed"
                      ? " bg-white w-[25%] text-blue-500 font-bold border-t-4 border-blue-500 rounded-t-2xl"
                      : "  w-[25%] text-gray-400 bg-gray-100  rounded-t-2xl "
                  }`}
                  onClick={() => setPage("Completed")}
                >
                  Completed Request
                </button>
                <button
                  className={`${
                    page === "Cancelled"
                      ? " bg-white w-[25%] text-red-500 font-bold border-t-4 border-red-500 rounded-t-2xl"
                      : "  w-[25%] text-gray-400 bg-gray-100  rounded-t-2xl "
                  }`}
                  onClick={() => setPage("Cancelled")}
                >
                  Cancelled Request
                </button>
              </div>
            </div>
            {page === "Pending" ? (
              myRequests.filter(
                (request: RequestProps) =>
                  request.status === "Pending" || request.status === "Lapsed"
              ).length <= 0 ? (
                <div className=" text-center justify-center mt-48">
                  <p className="text-2xl">
                    You have not created a request yet{" "}
                    <a href="/post" className="text-blue-500">
                      Create one now
                    </a>
                  </p>
                </div>
              ) : (
                <div
                  className={`mb-24 ${
                    isFormVisible || isDialogboxVisible
                      ? "pointer-events-none blur-sm"
                      : ""
                  }`}
                >
                  <Carousel
                    loop={false}
                    slidesPerView={3}
                    cards={myRequests
                      .filter(
                        (request: RequestProps) =>
                          request.status === "Pending" ||
                          request.status === "Lapsed"
                      )
                      .map((request: RequestProps, index: number) => (
                        <div key={index}>
                          <RequestCard
                            request={request}
                            toggleFormVisibility={setIsFormVisible}
                            onEditRequestClick={handleEditRequest}
                          />
                        </div>
                      ))}
                  />
                </div>
              )
            ) : null}

            {page === "Active" ? (
              <div
                className={`mb-24 ${
                  isFormVisible || isDialogboxVisible
                    ? "pointer-events-none blur-sm"
                    : ""
                }`}
              >
                <Carousel
                  loop={false}
                  slidesPerView={3}
                  cards={myRequests
                    .filter(
                      (request: RequestProps) => request.status === "OnGoing"
                    )
                    .map((request: RequestProps, index: number) => (
                      <div key={index}>
                        <RequestCard
                          request={request}
                          toggleFormVisibility={setIsFormVisible}
                          onEditRequestClick={handleEditRequest}
                          toggleDialogboxVisibility={setIsDialogboxVisible}
                          onMarkAsCompletedClick={handleMarkAsCompleted}
                        />
                      </div>
                    ))}
                />
              </div>
            ) : null}

            {page === "Completed" ? (
              <div
                className={`mb-24 ${
                  isFormVisible || isDialogboxVisible
                    ? "pointer-events-none blur-sm"
                    : ""
                }`}
              >
                <Carousel
                  loop={false}
                  slidesPerView={3}
                  cards={myRequests
                    .filter(
                      (request: RequestProps) => request.status === "Completed"
                    )
                    .map((request: RequestProps, index: number) => (
                      <div key={index}>
                        <RequestCard
                          request={request}
                          toggleFormVisibility={setIsFormVisible}
                          onEditRequestClick={handleEditRequest}
                        />
                      </div>
                    ))}
                />
              </div>
            ) : null}

            {page === "Cancelled" ? (
              <div
                className={`mb-24 ${
                  isFormVisible || isDialogboxVisible
                    ? "pointer-events-none blur-sm"
                    : ""
                }`}
              >
                <Carousel
                  loop={false}
                  slidesPerView={3}
                  cards={myRequests
                    .filter(
                      (request: RequestProps) => request.status === "Cancelled"
                    )
                    .map((request: RequestProps, index: number) => (
                      <div key={index}>
                        <RequestCard
                          request={request}
                          toggleFormVisibility={setIsFormVisible}
                          onEditRequestClick={handleEditRequest}
                        />
                      </div>
                    ))}
                />
              </div>
            ) : null}

            <EditRequest
              isFormVisible={isFormVisible}
              setIsFormVisible={setIsFormVisible}
              disabled={disabled}
              editRequestData={editRequestData}
              setEditRequestData={setEditRequestData}
              editable={editable}
              setEditable={setEditable}
              updateRequest={updateRequest}
            />

            <Dialogbox
              isDialogboxVisible={isDialogboxVisible}
              setIsDialogboxVisible={setIsDialogboxVisible}
              disabled={disabled}
              setDisabled={setDisabled}
			  request={completedRequestData!}
            />
          </div>
        ) : (
          <>
            <div
              className={`mt-24 w-[100%] ${
                isFormVisible || isReviewcardVisible
                  ? "pointer-events-none blur-sm"
                  : ""
              }`}
            >
              <div className=" text-center">
                {user ? (
                  <>
                    <p className="text-[40px]">
                      Welcome to your Dashboard {user.name.split(" ")[0]}
                    </p>
                  </>
                ) : (
                  <p className="text-[40px]">Welcome to your Dashboard</p>
                )}
                <p className="text-[16px] ">
                  You are now signed in as a Companion. In here you will be able
                  to see latest requests
                </p>
                <p className="text-[16px]">
                  need further explantion?{" "}
                  <a className="text-blue-500 font-bold " href="#">
                    click here
                  </a>
                </p>
              </div>

              <div className=" flex flex-row  mr-4 mt-12 items-center justify-center">
                <div className="flex flex-row">
                  <input
                    type="text"
                    placeholder="Search by task name or description"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-2 border-gray-300  h-[45px] w-[520px] pl-10 "
                  />
                  <img
                    src={search.src}
                    className="w-[35px] h-[30px] absolute pl-2 pt-3"
                  />
                </div>

                <select
                  className="border-2 border-gray-300  h-[45px] w-[250px] ml-4"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  <option value="">All Categories</option>
                  {/* Map through the array to generate options */}
                  {CategoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <select
                  className="border-2 border-gray-300  h-[45px] w-[250px] ml-4"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="" disabled>
                    Select City
                  </option>
                  <option value="">All Cities</option>
                  {/* Map through the array to generate options */}
                  {cities.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-12 mb-12">
                <div className="flex flex-row w-[100%] h-[40px] rounded-t-2xl">
                  <button
                    className={`${
                      compPage === "Requests"
                        ? " bg-white w-[25%] text-orange-500 font-bold border-t-4 border-orange-500 rounded-t-2xl"
                        : "  w-[20%] text-gray-400 bg-gray-100  rounded-t-2xl "
                    }`}
                    onClick={() => setCompPage("Requests")}
                  >
                    View Requests
                  </button>
                  <button
                    className={`${
                      compPage === "Pending"
                        ? " bg-white w-[25%] text-yellow-400 font-bold border-t-4 border-yellow-400 rounded-t-2xl"
                        : "  w-[20%] text-gray-400 bg-gray-100 rounded-t-2xl "
                    }`}
                    onClick={() => setCompPage("Pending")}
                  >
                    Pending Applications
                  </button>
                  <button
                    className={`${
                      compPage === "Active"
                        ? " bg-white w-[25%] text-green-500 font-bold border-t-4 border-green-500 rounded-t-2xl"
                        : "  w-[20%] text-gray-400 bg-gray-100 rounded-t-2xl "
                    }`}
                    onClick={() => setCompPage("Active")}
                  >
                    Ongoing Tasks
                  </button>
                  <button
                    className={`${
                      compPage === "Completed"
                        ? " bg-white w-[25%] text-blue-500 font-bold border-t-4 border-blue-500 rounded-t-2xl"
                        : "  w-[20%] text-gray-400 bg-gray-100  rounded-t-2xl "
                    }`}
                    onClick={() => setCompPage("Completed")}
                  >
                    Completed Tasks
                  </button>
                  <button
                    className={`${
                      compPage === "Cancelled"
                        ? " bg-white w-[25%] text-red-500 font-bold border-t-4 border-red-500 rounded-t-2xl"
                        : "  w-[20%] text-gray-400 bg-gray-100  rounded-t-2xl "
                    }`}
                    onClick={() => setCompPage("Cancelled")}
                  >
                    Cancelled Applications
                  </button>

                  <button
                    className={`${
                      compPage === "CancelledRequests"
                        ? " bg-white w-[25%] text-red-500 font-bold border-t-4 border-red-500 rounded-t-2xl"
                        : "  w-[20%] text-gray-400 bg-gray-100  rounded-t-2xl "
                    }`}
                    onClick={() => setCompPage("CancelledRequests")}
                  >
                    Cancelled Requests
                  </button>
                </div>
              </div>
            </div>

            {compPage === "Requests" ? (
              <div
                className={`mb-24 ${
                  isFormVisible ? "pointer-events-none blur-sm" : ""
                }`}
              >
                <Carousel
                  loop={false}
                  slidesPerView={4}
                  cards={searchFilteredRequests
                    .filter(
                      (request: RequestProps) =>
                        !myApplications.some(
                          (app) =>
                            app.requestId === request.id &&
                            (app.status === "Pending" ||
                              app.status === "Accepted")
                        )
                    )
                    .map((request: RequestProps, index: number) => (
                      <div key={index}>
                        <Card
                          request={request}
                          cardType="allRequests"
                          toggleFormVisibility={setIsFormVisible}
                          onApplyClick={handleApplyRequest}
                        />
                      </div>
                    ))}
                />
              </div>
            ) : null}

            {compPage === "Pending" ? (
              <div
                className={`mb-24 ${
                  isFormVisible ? "pointer-events-none blur-sm" : ""
                }`}
              >
                <Carousel
                  loop={false}
                  slidesPerView={4}
                  cards={searchFilteredRequests
                    .filter((request: RequestProps) =>
                      myApplications.some(
                        (app) =>
                          app.requestId === request.id &&
                          (app.status === "Pending" ||
                            app.status === "Accepted")
                      )
                    )
                    .map((request: RequestProps, index: number) => (
                      <div key={index}>
                        <Card
                          request={request}
                          cardType="pendingApplication"
                          toggleFormVisibility={setIsFormVisible}
                          onApplyClick={handleViewApplication}
                        />
                      </div>
                    ))}
                />
              </div>
            ) : null}

            {compPage === "Active" ? (
              <div
                className={`mb-24 ${
                  isFormVisible ? "pointer-events-none blur-sm" : ""
                }`}
              >
                <Carousel
                  loop={false}
                  slidesPerView={4}
                  cards={searchFilteredRequests
                    .filter((request: RequestProps) =>
                      myApplications.some(
                        (app) =>
                          app.requestId === request.id &&
                          (app.status === "Pending" ||
                            app.status === "Accepted")
                      )
                    )
                    .map((request: RequestProps, index: number) => (
                      <div key={index}>
                        <Card
                          request={request}
                          cardType="ongoingtasks"
                          toggleFormVisibility={setIsFormVisible}
                          onApplyClick={handleViewApplication}
                        />
                      </div>
                    ))}
                />
              </div>
            ) : null}

            {compPage === "Completed" ? (
              <div
                className={`mb-24 ${
                  isFormVisible || isReviewcardVisible
                    ? "pointer-events-none blur-sm"
                    : ""
                }`}
              >
                <Carousel
                  loop={false}
                  slidesPerView={4}
                  cards={searchFilteredRequests
                    .filter((request: RequestProps) =>
                      myApplications.some(
                        (app) =>
                          app.requestId === request.id &&
                          (app.status === "Pending" ||
                            app.status === "Accepted")
                      )
                    )
                    .map((request: RequestProps, index: number) => (
                      <div key={index}>
                        <Card
                          request={request}
                          cardType="completedTasks"
                          toggleFormVisibility={setIsFormVisible}
                          onApplyClick={handleViewApplication}
                          toggleReviewcardVisibility={setIsReviewcardVisible}
                        />
                      </div>
                    ))}
                />
              </div>
            ) : null}

            {compPage === "Cancelled" ? <div className="mb-24"></div> : null}

            {compPage === "CancelledRequests" ? (
              <div
                className={`mb-24 ${
                  isFormVisible ? "pointer-events-none blur-sm" : ""
                }`}
              >
                <Carousel
                  loop={false}
                  slidesPerView={4}
                  cards={searchFilteredRequests
                    .filter((request: RequestProps) =>
                      myApplications.some(
                        (app) =>
                          app.requestId === request.id &&
                          app.status === "Requester-Cancelled"
                      )
                    )
                    .map((request: RequestProps, index: number) => (
                      <div key={index}>
                        <Card
                          request={request}
                          cardType="cancelledRequest"
                          toggleFormVisibility={setIsFormVisible}
                          onApplyClick={handleViewApplication}
                        />
                      </div>
                    ))}
                />
              </div>
            ) : null}

            <ApplicationFormPopUp
              isFormVisible={isFormVisible}
              setIsFormVisible={setIsFormVisible}
              applicationData={applicationData}
              data={data}
              setData={setData}
              disabled={disabled}
              postApplication={postApplication}
            />

            <UpdateApplicationForm
              isFormVisible={isFormVisible}
              setIsFormVisible={setIsFormVisible}
              applicationData={applicationData}
              data={data}
              setData={setData}
              disabled={disabled}
              updateApplication={updateApplication}
              cancelApplication={cancelApplication}
              compPage={compPage}
              editable={editable}
              setEditable={setEditable}
            />

            <ReviewCard
              isReviewcardVisible={isReviewcardVisible}
              setIsReviewcardVisible={setIsReviewcardVisible}
              disabled={disabled}
              setDisabled={setDisabled}
            />
          </>
        )}
      </main>
    )
  );
}
