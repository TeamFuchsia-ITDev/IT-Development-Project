"use client";

import { Navbar } from "../../components/navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import leftarrow from "../../images/leftarrow.svg";
import rightarrow from "../../images/rightarrow.svg";
import { Card } from "@/app/components/card";
import Carousel from "@/app/components/carousel"

interface UserProps {
    id: string;
    name: string;
    ethnicity: string;
    gender: string;
    birthday: string;
    phonenumber: string;
    image: string;
    userEmail: string;
    location: {
        lng: number;
        lat: number;
        address: {
            fullAddress: string;
            pointOfInterest: string;
            city: string;
            country: string;
        };
    };
}


export default function homepage() {
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
        <>
            <Navbar />
            <div className="ml-4 mr-4 mt-24">
                <div className="ml-4 mr-4">
                    {user ? (
                        <>
                            <p className="text-[60px]">Welcome to your Homepage {user.name.split(" ")[0]}</p>
                        </>
                    ) : (
                        <p className="text-[60px]">Welcome to your Homepage</p>
                    )}
                    <p className="text-[20px] w-[900px] ">In here you will be able to see latest requests and also allows you to search certain requests you want to help someone with</p>
                </div>

                <div className=" flex flex-row ml-4 mr-4 mt-12">
                    <input type="text" placeholder="Search for a request" className="border-2 border-gray-300  h-[45px] w-[500px] " />

                    <select className="border-2 border-gray-300  h-[45px] w-[200px] ml-4" />
                    <select className="border-2 border-gray-300  h-[45px] w-[200px] ml-4" />
                    <select className="border-2 border-gray-300  h-[45px] w-[200px] ml-4" />

                </div>

                <div className="ml-4 mr-4 border-2 border-gray-300 rounded-[5px] mt-12 overflow-hidden mb-12">
                    <div className="flex flex-row justify-between mt-2 ml-2">
                        <h1 className="text-2xl"> Latest requests</h1>

                        <div className="flex gap-4 mr-4">
                            <img src={leftarrow.src} width={20} />
                            <img src={rightarrow.src} width={20} />
                        </div>

                    </div>
                    <div className="mt-4 ml-12 mb-6 gap-12">
                        <Card />
                       
                    </div>
                </div>
            </div>
        </>
    );
}
