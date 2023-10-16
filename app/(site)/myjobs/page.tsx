'use client'

import { Navbar } from "../../components/navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserProps } from "@/app/libs/interfaces";

export default function MyJobs () {
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
            <div className="ml-4 mr-4 mt-24">
                <div className="ml-4 mr-4 text-center">
                  
                        <p className="text-[40px]">Welcome to your Jobs page</p>
                 
                    <p className="text-[20px]  ">In here you will be able to see all of the requests you have applied to </p>
                </div>

            </div>
        </main>
    )
}