"use client";

import { Navbar } from "../../components/navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserProps } from "@/app/libs/interfaces";
import { CompanionCard } from "@/app/components/companioncard";

export default function MyJobs() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProps | undefined>(undefined);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`/api/user/profile/${session?.user.email}`);
      const data = await response.json();
      setUser(data);
    };
    if (session?.user.email) getUser();
  }, [session?.user.email]);

  return (
    <main className="pl-24 pr-24">
      <Navbar />
      <div>
        <div className="mt-6 text-center">
          <p className="text-[40px]">
            These are the applicants for (task name)
          </p>
          <p className="text-[20px]  ">
            In here you will be able to see al the companions that have applied
            to your request
          </p>
          <div>
            <select className="mt-4">
              {" "}
              <option value="" disabled>
                Select Ethnicity
              </option>
            </select>
            <input type="text" placeholder="Input age" />
          </div>
        </div>

        <div>
            <h1>Applicants</h1>
            <CompanionCard />
        </div>
      </div>
    </main>
  );
}
