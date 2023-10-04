'use client'
import { Navbar } from "../../components/navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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


export default function MyRequest () {
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
                    <p className="text-[60px]">Welcome to your Requests page</p>
                    <p className="text-[20px] w-[900px] ">In here you will be able to see all the requests that you have created</p>
                </div>

            </div>
        </>
    )
}