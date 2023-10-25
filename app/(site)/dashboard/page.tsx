"use client";

import { FormEvent, useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
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
import x from "@/app/images/x.svg";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserProps | undefined>(undefined);
  const [myRequests, setMyRequests] = useState<RequestProps[]>([]);
  const [page, setPage] = useState("Pending");
  const [mode, setMode] = useState(true);
  const [compPage, setCompPage] = useState("Requests");

  const toggleMode = (newMode: boolean) => {
    setMode(newMode);
  };

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
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

    if (status !== "loading" && session?.user.email) {
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
  const [pendingRequests, setPendingRequests] = useState<RequestProps[]>([]);
  const [activeRequests, setActiveRequests] = useState<RequestProps[]>([]);
  const [cancelledRequests, setCancelledRequests] = useState<RequestProps[]>(
    []
  );
  const [completedRequests, setCompletedRequests] = useState<RequestProps[]>(
    []
  );
  const [allRequests, setAllRequests] = useState<RequestProps[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [myApplications, setmyApplications] = useState<ApplicationProps[]>([]);

  const [data, setData] = useState({
    requestid: "",
    amount: "",
    description: "",
  });

  const [applicationData, setapplicationData] = useState({
    taskname: "",
    requesterName: "",
    dateime: "",
  });

  useEffect(() => {
    // Redirect to login page if there is no session
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [session, status, router]);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`/api/user/profile/${session?.user.email}`);
      const data = await response.json();
      setUser(data);
    };

    const getRequests = async () => {
      const response = await axios.get(`/api/user/request`);
      const data = await response.data;
      const allPendingRequests: RequestProps[] = data.requests.filter(
        (request: { userEmail: string; status: string }) =>
          request.userEmail !== session?.user.email &&
          request.status === "Pending"
      );
      const allActiveRequests: RequestProps[] = data.requests.filter(
        (request: { userEmail: string; status: string }) =>
          request.userEmail !== session?.user.email &&
          request.status === "OnGoing"
      );
      const allCancelledRequests: RequestProps[] = data.requests.filter(
        (request: { userEmail: string; status: string }) =>
          request.userEmail !== session?.user.email &&
          request.status === "Cancelled"
      );
      const allCompletedRequests: RequestProps[] = data.requests.filter(
        (request: { userEmail: string; status: string }) =>
          request.userEmail !== session?.user.email &&
          request.status === "Cancelled"
      );
      setAllRequests(data.requests);
      setPendingRequests(allPendingRequests);
      setActiveRequests(allActiveRequests);
      setCancelledRequests(allCancelledRequests);
      setCompletedRequests(allCompletedRequests);

      const uniqueCities = new Set<string>();

      allRequests.forEach((item: RequestProps) => {
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
	Requests: pendingRequests,
    Pending: pendingRequests,
    Active: activeRequests,
    Completed: completedRequests,
    Cancelled: cancelledRequests,
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
        router.push("/myjobs");
      }, 2000);
    }
    setTimeout(() => setDisabled(false), 4000);
  };

  return (
    <main className="pl-24 pr-24">
      <Navbar mode={mode} toggleMode={toggleMode} />
      {mode ? (
        <div className="mt-24">
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
              You are now signed in as a Requester. In here you will be able to
              see all the requests you
            </p>
            <p className=" ">
              have created. Need further explanation?{" "}
              <a href="#" className="text-rose-500">
                click here
              </a>
            </p>
          </div>
          <div className="flex items-center justify-center mt-8 mb-4">
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
              (request: RequestProps) => request.status === "Pending"
            ).length <= 0 ? (
              <div className=" text-center justify-center mt-48">
                <p className="text-2xl">
                  You have not created a request yet{" "}
                  <a href="/post" className="text-rose-500">
                    Create one now
                  </a>
                </p>
              </div>
            ) : (
              <Carousel
                loop={false}
                slidesPerView={3}
                cards={myRequests
                  .filter(
                    (request: RequestProps) => request.status === "Pending"
                  )
                  .map((request: RequestProps, index: number) => (
                    <div key={index}>
                      <RequestCard request={request} />
                    </div>
                  ))}
              />
            )
          ) : null}

          {page === "Active" ? (
            <Carousel
              loop={false}
              slidesPerView={3}
              cards={myRequests
                .filter((request: RequestProps) => request.status === "OnGoing")
                .map((request: RequestProps, index: number) => (
                  <div key={index}>
                    <RequestCard request={request} />
                  </div>
                ))}
            />
          ) : null}

          {page === "Completed" ? (
            <Carousel
              loop={false}
              slidesPerView={3}
              cards={myRequests
                .filter(
                  (request: RequestProps) => request.status === "Completed"
                )
                .map((request: RequestProps, index: number) => (
                  <div key={index}>
                    <RequestCard request={request} />
                  </div>
                ))}
            />
          ) : null}
        </div>
      ) : (
        <>
          <div
            className={`mt-24 w-[100%] ${
              isFormVisible ? "pointer-events-none blur-sm" : ""
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
                <a className="text-blue-500">click here</a>
              </p>
            </div>

            <div className=" flex flex-row  mr-4 mt-12 items-center justify-center">
              <input
                type="text"
                placeholder="Search for a request"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2 border-gray-300  h-[45px] w-[520px] "
              />

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
                  All Requests
                </button>
                <button
                  className={`${
                    compPage === "Pending"
                      ? " bg-white w-[25%] text-yellow-400 font-bold border-t-4 border-yellow-400 rounded-t-2xl"
                      : "  w-[20%] text-gray-400 bg-gray-100 rounded-t-2xl "
                  }`}
                  onClick={() => setCompPage("Pending")}
                >
                  Pending Application
                </button>
                <button
                  className={`${
                    compPage === "Active"
                      ? " bg-white w-[25%] text-green-500 font-bold border-t-4 border-green-500 rounded-t-2xl"
                      : "  w-[20%] text-gray-400 bg-gray-100 rounded-t-2xl "
                  }`}
                  onClick={() => setCompPage("Active")}
                >
                  Active Application
                </button>
                <button
                  className={`${
                    compPage === "Completed"
                      ? " bg-white w-[25%] text-blue-500 font-bold border-t-4 border-blue-500 rounded-t-2xl"
                      : "  w-[20%] text-gray-400 bg-gray-100  rounded-t-2xl "
                  }`}
                  onClick={() => setCompPage("Completed")}
                >
                  Completed Application
                </button>
                <button
                  className={`${
                    compPage === "Cancelled"
                      ? " bg-white w-[25%] text-red-500 font-bold border-t-4 border-red-500 rounded-t-2xl"
                      : "  w-[20%] text-gray-400 bg-gray-100  rounded-t-2xl "
                  }`}
                  onClick={() => setCompPage("Cancelled")}
                >
                  Cancelled Application
                </button>
              </div>
            </div>
          </div>

          {compPage === "Requests" ? (
            <div className="mb-24">
              <Carousel
                loop={false}
                slidesPerView={4}
                cards={searchFilteredRequests.map(
                  (request: RequestProps, index: number) => (
                    <div key={index}>
                      <Card
                        request={request}
                        cardType="allRequests"
                        toggleFormVisibility={setIsFormVisible}
                        onApplyClick={handleApplyRequest}
                      />
                    </div>
                  )
                )}
              />
            </div>
          ) : null}

          {compPage === "Pending" ? (
            <div className="mb-24">
              <Carousel
                loop={false}
                slidesPerView={4}
                cards={searchFilteredRequests
                  .filter((request: RequestProps) =>
                    myApplications.some((app) => app.requestId === request.id && app.status === "Pending")
                  )
                  .map((request: RequestProps, index: number) => (
                    <div key={index}>
                      <Card
                        request={request}
                        cardType="pendingApplication"
                        toggleFormVisibility={setIsFormVisible}
                        onApplyClick={handleApplyRequest}
                      />
                    </div>
                  ))}
              />
            </div>
          ) : null}

          {compPage === "Active" ? <div className="mb-24"></div> : null}

          {compPage === "Completed" ? <div className="mb-24"></div> : null}

          {compPage === "Cancelled" ? <div className="mb-24"></div> : null}

          {isFormVisible && (
            <div
              className="flex flex-col w-[500px] border-2 mt-4 items-center mb-12 bg-white fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 "
              style={{ boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)" }}
            >
              <img
                src={x.src}
                alt="X"
                width={20}
                className="m-2 absolute right-0 top-0 cursor-pointer "
                onClick={() => setIsFormVisible(!isFormVisible)}
              />

              <p className="text-center underline underline-offset-8 decoration-rose-500 decoration-2 mt-6">
                Application Form
              </p>
              <div className="ml-4 mr-4 text-center ">
                <p className="text-[13px] mt-4">
                  To let the requester know more about you fill up the form
                  below
                </p>
                <h1 className="text-[13px] ">
                  You are now applying for {applicationData.requesterName}'s{" "}
                  {applicationData.taskname} at {applicationData.dateime}.{" "}
                </h1>
              </div>

              <div className="">
                <p className="text-[13px] mt-8 mb-4">
                  <a className="text-green-500">Amount</a> ( the amount you want
                  for your service, input 0 if free)
                </p>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  placeholder="$ CAD"
                  step="0.01"
                  min="0"
                  className="border-2 border-gray-300 h-[45px] w-[400px]"
                  value={data.amount}
                  onChange={(e) => setData({ ...data, amount: e.target.value })}
                />
                <p className="text-[13px] mt-4 mb-4">
                  <a className="text-rose-500">Explain</a> Why are you a good
                  fit to apply?
                </p>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Experience, skills, passion, etc."
                  className="border-2 border-gray-300 h-[150px] resize-none w-[400px] mb-4"
                  value={data.description}
                  onChange={(e) =>
                    setData({ ...data, description: e.target.value })
                  }
                />
              </div>
              <button
                className="text-center bg-green-500 text-white font-bold mb-8 rounded h-[45px] w-[400px] hover:bg-white hover:text-green-500 hover:border-[2px] hover:border-green-500 hover:ease-in-out duration-300"
                onClick={postApplication}
                disabled={disabled}
              >
                Apply
              </button>
            </div>
          )}

          {isFormVisible && compPage === "Pending" && (
            <div
              className="flex flex-col w-[500px] border-2 mt-4 items-center mb-12 bg-white fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 "
              style={{ boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)" }}
            >
              <img
                src={x.src}
                alt="X"
                width={20}
                className="m-2 absolute right-0 top-0 cursor-pointer "
                onClick={() => setIsFormVisible(!isFormVisible)}
              />

              <p className="text-center underline underline-offset-8 decoration-rose-500 decoration-2 mt-6">
                Application Form
              </p>
              <div className="ml-4 mr-4 text-center ">
                <p className="text-[13px] mt-4">
                  To let the requester know more about you fill up the form
                  below
                </p>
                <h1 className="text-[13px] ">
                  You are now applying for {applicationData.requesterName}'s{" "}
                  {applicationData.taskname} at {applicationData.dateime}.{" "}
                </h1>
              </div>

              <div className="">
                <p className="text-[13px] mt-8 mb-4">
                  <a className="text-green-500">Amount</a> ( the amount you want
                  for your service, input 0 if free)
                </p>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  placeholder="$ CAD"
                  step="0.01"
                  min="0"
                  className="border-2 border-gray-300 h-[45px] w-[400px]"
                  value={data.amount}
                  onChange={(e) => setData({ ...data, amount: e.target.value })}
                />
                <p className="text-[13px] mt-4 mb-4">
                  <a className="text-rose-500">Explain</a> Why are you a good
                  fit to apply?
                </p>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Experience, skills, passion, etc."
                  className="border-2 border-gray-300 h-[150px] resize-none w-[400px] mb-4"
                  value={data.description}
                  onChange={(e) =>
                    setData({ ...data, description: e.target.value })
                  }
                />
              </div>
              <button
                className="text-center bg-orange-500 text-white font-bold mb-2 rounded h-[45px] w-[400px] hover:bg-white hover:text-orange-500 hover:border-[2px] hover:border-orange-500 hover:ease-in-out duration-300"
                disabled={disabled}
              >
                Edit Application
              </button>
              <button
                className="text-center bg-rose-500 text-white font-bold mb-2 rounded h-[45px] w-[400px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300"
                disabled={disabled}
              >
                Cancel Application
              </button>

              <button
                className="text-center bg-blue-500 text-white font-bold mb-8 rounded h-[45px] w-[400px] hover:bg-white hover:text-blue-500 hover:border-[2px] hover:border-blue-500 hover:ease-in-out duration-300"
                disabled={disabled}
              >
                Save Changes
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
