"use client";

import { Navbar } from "../../components/navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApplicationProps, RequestProps } from "@/app/libs/interfaces";
import { CompanionCard } from "@/app/components/companioncard";
import Carousel from "@/app/components/carousel";

export default function MyJobs() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const requestIDParams = searchParams.get("id");
  const [applications, setApplications] = useState([]);
  const [request, setRequest] = useState<RequestProps | undefined>(undefined);

  useEffect(() => {
    const getApplications = async () => {
      const response = await fetch(`/api/user/applications/${requestIDParams}`);
      const data = await response.json();
      setApplications(data);
    };
    const getRequest = async () => {
      const response = await fetch(`/api/user/request/${requestIDParams}`);
      const data = await response.json();
      setRequest(data);
    };
    if (requestIDParams) {
      getApplications();
      getRequest();
    }
  }, [session?.user.email, requestIDParams]);

  return (
    <main className="pl-24 pr-24">
      <Navbar />
      <div>
        <div className="mt-6 text-center">
          <p className="text-[40px] mt-12">
            These are the applicants for {request?.taskname}
          </p>
          <p className="text-[20px]  ">
            In here you will be able to see al the companions that have applied
            to your request
          </p>
          <div className="flex flex-row gap-4  justify-center mt-4">
            <select className="">
              {" "}
              <option value="" disabled>
                Select Ethnicity
              </option>
            </select>
            <select className="">
              {" "}
              <option value="" disabled>
                Select Gender
              </option>
            </select>
            <input type="text" placeholder="Input age" />
          </div>
        </div>

        <div>
          <h1 className="font-bold mt-4 mb-4">Applicants</h1>
          <Carousel
            loop={false}
            slidesPerView={4}
            cards={applications.filter((application: ApplicationProps) => application.status === "Pending").map(
              (application: ApplicationProps, index: number) => (
                <div key={index}>
                  <CompanionCard application={application} />
                </div>
              )
            )}
          />
        </div>
      </div>
    </main>
  );
}
