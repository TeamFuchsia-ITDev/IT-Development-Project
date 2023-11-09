"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import getGeolocation from "@/app/libs/geolocation";
import Map from "@/app/components/map";
import ChatComponent from "@/app/components/chat";
import { SocketReference } from "@/app/libs/interfaces";

import io, { Socket } from "socket.io-client";

const MapChatPage = () => {
  const socket: SocketReference = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [room, setRoom] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userRole, setUserRole] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    requestid: "",
    username: "",
    userType: "",
    startLocation: {
      lat: 0,
      lng: 0,
    },
    endLocation: {
      lat: 0,
      lng: 0,
    },
  });

  useEffect(() => {
    const requestid = searchParams.get(`requestid`);
    const username = searchParams.get(`username`);
    const userType = searchParams.get(`usertype`);

    setData((prevData) => ({
      ...prevData,
      requestid: requestid!,
      username: username!,
      userType: userType!,
    }));

    if (userType === "Companion") {
      getGeolocation()
        .then((location) => {
          setData((prevData) => ({
            ...prevData,
            startLocation: {
              lat: location.lat,
              lng: location.lng,
            },
            endLocation: { lat: 49.215401, lng: -122.950891 },
          }));
        })
        .catch((error) => {
          console.error(error);
        });
    }
    if (userType === "Requester") {
      setData((prevData) => ({
        ...prevData,
        startLocation: {
          lat: 49.215401,
          lng: -122.950891,
        },
      }));

      getGeolocation()
        .then((location) => {
          setData((prevData) => ({
            ...prevData,
            endLocation: { lat: location.lat, lng: location.lng },
          }));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [session, searchParams, data]);

  // Set loading to false once data is loaded
  useEffect(() => {
    if (
      data.startLocation.lat !== 0 &&
      data.startLocation.lng !== 0 &&
      data.endLocation.lat !== 0 &&
      data.endLocation.lng !== 0
    ) {
      setLoading(false);
    }
  }, [data]);

  return (
    <div className="w-full mx-auto max-w-4xl text-center">
      {loading ? (
        // Display a loading indicator here
        <p>Loading...</p>
      ) : (
        // Display the map when data is ready
        <Map
          startLocation={data.startLocation}
          endLocation={data.endLocation}
        />
      )}
      {/* <ChatComponent
        requestid={data.requestid}
        username={data.username}
        userType={data.userType}
      /> */}
    </div>
  );
};

export default MapChatPage;
