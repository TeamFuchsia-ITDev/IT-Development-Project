"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserProps, RequestProps, RequestData } from "@/app/libs/interfaces";
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
  const [requests, setRequests] = useState<RequestProps[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

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
      const filteredRequests: RequestProps[] = data.requests.filter(
        (request: { userEmail: string; status: string }) =>
          request.userEmail !== session?.user.email &&
          request.status === "Pending"
      );
      setRequests(filteredRequests);

      const uniqueCities = new Set<string>();

      filteredRequests.forEach((item: RequestProps) => {
        if (item.requesterCity) {
          uniqueCities.add(item.requesterCity);
        }
      });

      setCities(Array.from(uniqueCities));
    };

    if (status !== "loading" && session?.user.email) {
      getUser();
      getRequests();
    }
  }, [session?.user.email, status]);

  const searchFilteredRequests = requests.filter((request) => {
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
      <div className="mt-24">
        <div className="text-center">
          <p className="text-[40px]">Welcome to your Dashboard</p>
          <p className="text-[16px]">
            In here, you will be able to see all requests you have created. Need
            further explanation?{" "}
            <a href="#" className="text-rose-500">
              click here
            </a>
          </p>
        </div>
        <div className="flex items-center justify-center mt-8 mb-4">
          {mode ? (
            <div className="flex flex-row w-[100%] h-[40px]">
              <button
                className={`${
                  page === "Pending"
                    ? "rounded-t-2xl bg-orange-300 w-[25%] text-white font-bold border-b-4 border-orange-500"
                    : "rounded-t-2xl bg-orange-300 w-[25%] text-gray-200"
                }`}
                onClick={() => setPage("Pending")}
              >
                Pending Request
              </button>
              <button
                className={`${
                  page === "Active"
                    ? "rounded-t-2xl bg-green-400 w-[25%] text-white border-b-4 border-green-600 font-bold"
                    : "rounded-t-2xl bg-green-400 w-[25%] text-gray-200"
                }`}
                onClick={() => setPage("Active")}
              >
                Active Request
              </button>
              <button
                className={`${
                  page === "Completed"
                    ? "rounded-t-2xl bg-blue-400 w-[25%] text-white font-bold border-b-4 border-blue-600"
                    : "rounded-t-2xl bg-blue-400 w-[25%] text-gray-200"
                }`}
                onClick={() => setPage("Completed")}
              >
                Completed Request
              </button>
              <button
                className={`${
                  page === "Cancelled"
                    ? "rounded-t-2xl bg-red-400 w-[25%] text-white font-bold border-b-4 border-red-600"
                    : "rounded-t-2xl bg-red-400 w-[25%] text-gray-200"
                }`}
                onClick={() => setPage("Cancelled")}
              >
                Cancelled Request
              </button>
            </div>
          ) : (
            <div
              className={`mt-24 w-[100%] ${
                isFormVisible ? "pointer-events-none blur-sm" : ""
              }`}
            >
              <div className=" flex flex-row  mr-4 mt-12">
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
                <div className="flex flex-row mt-2 ml-2">
                  <h1 className="text-2xl ">
                    Most Recent <a className="text-rose-500">Requests</a>
                  </h1>

                  <div className="flex gap-4 mr-4  mt-4 "></div>
                </div>
              </div>
              <div className="mb-24">
                <Carousel
                  loop={false}
                  slidesPerView={4}
                  cards={searchFilteredRequests.map(
                    (request: RequestProps, index: number) => (
                      <div key={index}>
                        <Card
                          request={request}
                          smallCard={true}
                          toggleFormVisibility={setIsFormVisible}
                          onApplyClick={handleApplyRequest}
                        />
                      </div>
                    )
                  )}
                />
              </div>
            </div>
          )}
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
                  to let the requester know more about you fill up the form
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
        </div>
        {mode ? (
          <>
            {" "}
            {page === "Pending" ? (
              myRequests.filter((request) => request.status === "Pending")
                .length <= 0 ? (
                <p>
                  You have not created a request yet, <a>Create one now</a>
                </p>
              ) : (
                <Carousel
                  loop={false}
                  slidesPerView={3}
                  cards={myRequests
                    .filter((request) => request.status === "Pending")
                    .map((request, index) => (
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
                  .filter((request) => request.status === "OnGoing")
                  .map((request, index) => (
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
                  .filter((request) => request.status === "Completed")
                  .map((request, index) => (
                    <div key={index}>
                      <RequestCard request={request} />
                    </div>
                  ))}
              />
            ) : null}
          </>
        ) : null}
      </div>
    </main>
  );
}
