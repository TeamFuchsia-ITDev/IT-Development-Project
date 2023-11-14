"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useState,
  useRef,
  ChangeEvent,
  FormEvent,
  useMemo,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";
import getGeolocation from "@/app/libs/geolocation";
import Map from "@/app/components/map";
import ChatComponent from "@/app/components/chat";
import { LocationFeature, SocketReference } from "@/app/libs/interfaces";

import io, { Socket } from "socket.io-client";
import axios from "axios";
import toast from "react-hot-toast";
import { Navbar } from "@/app/components/navbar";

const MapChatPage = () => {
  const socket: SocketReference = useRef<Socket | null>(null);
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<LocationFeature[]>([]);
  const [coordinates, setCoordinates] = useState({
    lat: 0,
    lng: 0,
  });

  const [whoSharedLocation, setWhoSharedLocation] = useState<string[]>([]);
  const [whoJoinedRoom, setWhoJoinedRoom] = useState<string[]>([]);
  const [sharedLocation, setSharedLocation] = useState<string[]>([]);
  const [selectedCompanionLocation, setSelectedCompanionLocation] = useState<
    string | null
  >(null);
  const [hasSharedLocation, setHasSharedLocation] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [isMeetingPointSet, setIsMeetingPointSet] = useState(false);
  const [data, setData] = useState({
    startLocation: {
      lat: 0,
      lng: 0,
    },
    endLocation: {
      lat: 0,
      lng: 0,
    },
  });

  // Used to store and get values from the params
  const queryParams = useMemo(() => {
    return {
      requestid: searchParams.get(`requestid`),
      username: searchParams.get(`username`),
      userType: searchParams.get(`usertype`),
    };
  }, [searchParams]);

  // Connect to WebSocket Server
  const setupSocket = () => {
    const wsServerUrl =
      process.env.NEXT_PUBLIC_WS_SERVER ||
      "ws://serve-ease-websocket-server-1b42068c72f6.herokuapp.com";
    socket.current = io(wsServerUrl);

    socket.current?.on("share", (message: string) => {
      setWhoSharedLocation((prevMessages) => [...prevMessages, message]);
    });

    socket.current?.on("location", (message: string) => {
      setSharedLocation((prevMessages) => [...prevMessages, message]);
    });

    socket.current?.on("joinroom", (message: string) => {
      setWhoJoinedRoom((prevMessages) => [...prevMessages, message]);
    });
  };

  const joinRoom = useCallback(() => {
    if (queryParams.requestid && queryParams.username) {
      socket.current?.emit(
        "shareLocation",
        queryParams.requestid,
        queryParams.username
      );
    }
  }, [queryParams]);

  useEffect(() => {
    setupSocket();
    if (queryParams.userType === "Requester") joinRoom();
    return () => {
      // Clean up the socket connection when the component unmounts
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        const response = await axios.get(
          `/api/user/request/${queryParams?.requestid}`
        );
        const res = response.data;

        // Applies to both companion and requester
        if (res.coordinates.length > 0) {
          setIsMeetingPointSet(true);
          setData((prevData) => ({
            ...prevData,
            endLocation: {
              lat: res.coordinates[0],
              lng: res.coordinates[1],
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching user requests:", error);
      }
    };

    // Check if queryParams is available before making the request
    if (queryParams?.requestid) {
      fetchUserRequests();
    }
    if (queryParams.userType === "Companion") {
      setData((prevData) => ({
        ...prevData,
        startLocation: {
          lat: data.startLocation.lat,
          lng: data.startLocation.lng,
        },
      }));
    }
  }, [queryParams, selectedCompanionLocation]);

  // Loading useEffect to make sure map has values already before rendering
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

  async function handleLocationChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setAddress(val);

    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${val}
      .json?&country=ca&proximity=ip&types=address%2Cpoi&language=en&limit=3&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
    try {
      const response = await axios.get(endpoint);
      setSuggestions(response.data?.features);
      if (response.data?.features.length > 0) {
        const center = response.data.features[0].center;
        setCoordinates((prevData) => ({
          ...prevData,
          lat: center[1],
          lng: center[0],
        }));
      }
    } catch (error) {
      console.error("Error getting location suggestions:", error);
      toast.error("Error getting suggestions. Please try again.");
    }
  }

  const setMeetingPoint = async (e: FormEvent) => {
    if (isMeetingPointSet) {
      socket.current?.emit(
        "changeLocation",
        queryParams.requestid,
        queryParams.username
      );
    }
    setDisabled(true);
    toast.loading("Setting the meeting point...", {
      duration: 4000,
    });

    const requestBody = {
      requestid: queryParams.requestid,
      coordinates: coordinates,
    };

    const response = await axios.post(
      `api/user/request/coordinates`,
      requestBody
    );
    if (response.data.status !== 200) {
      const errorMessage = response.data?.error || "An error occurred";
      toast.error(errorMessage);
      setTimeout(() => setDisabled(false), 2000);
    } else {
      toast.success("Meeting point successfully updated");
      setTimeout(() => {
        toast.dismiss();
        window.location.reload();
      }, 2000);
    }
  };

  const handleShareLocation = async () => {
    setHasSharedLocation(true);
    joinRoom();
    const currentLocation = await getGeolocation();
    if (queryParams.userType === "Companion") {
      socket.current?.emit("sendLocation", queryParams.requestid, {
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        email: session?.user?.email,
      });
    }
    setData((prevData) => ({
      ...prevData,
      startLocation: {
        lat: currentLocation.lat,
        lng: currentLocation.lng,
      },
    }));
  };

  return (
    <div className="flex flex-col pl-24 pr-24">
      <Navbar />
      {queryParams.userType === "Requester" && (
        <div className="flex flex-row gap-4 pt-12">
          <div className="flex flex-col">
            <div className="">
              <input
                id="address"
                name="address"
                type="text"
                value={address}
                onChange={handleLocationChange}
                placeholder="Enter meeting point"
                className={`border-1 border-gray-300 h-[45px] w-[400px]  mb-4  focus:ring-blue-400
          }`}
              />
            </div>
            {suggestions?.length > 0 && (
              <div className="bg-white border border-gray-300 rounded-lg z-10 overflow-auto max-h-20 w-[400px] mb-2 absolute mt-12">
                {suggestions.map((suggestion, index) => (
                  <p
                    // className="p-4 cursor-pointer text-sm text-black transition duration-200 ease-in-out bg-gray-100 hover:bg-green-200"
                    className="p-4 cursor-pointer text-sm text-black transition duration-200 ease-in-out hover:bg-green-200"
                    key={index}
                    onClick={() => {
                      setAddress(suggestion.place_name);
                      setSuggestions([]);
                    }}
                  >
                    {suggestion.place_name}
                  </p>
                ))}
              </div>
            )}
          </div>
          <button
            className={`${
              disabled
                ? " text-center bg-blue-500 opacity-50 text-white font-bold w-[400px] rounded mb-4 h-[45px] cursor-not-allowed"
                : "text-center bg-blue-500 text-white font-bold w-[200px] rounded mb-4 h-[45px] hover:bg-white hover:text-blue-500 hover:border-[2px] hover:border-blue-500 hover:ease-in-out duration-300"
            } ${disabled && "cursor-not-allowed"}`}
            onClick={setMeetingPoint}
            disabled={disabled}
          >
            Set Meeting Point
          </button>
        </div>
      )}
      <div className="flex flex-row w-[100%] gap-4">
        <div className=" w-[70%] ">
          <ChatComponent
            requestid={queryParams.requestid}
            username={queryParams.username}
            userType={queryParams.userType}
          />
        </div>
        <div className="flex flex-col w-[30%] gap-4">
          <div className="flex flex-col border-2 h-[500px] pl-4 pr-4">
            {/* <div>
              <p>Chat Members</p>
              {queryParams.userType === "Requester" && (
                <>
                  <p>Requester: {queryParams.username}</p>
                  <p>
                    Companion:{" "}
                    {whoJoinedRoom
                      .map(
                        (message) => message.split("[Companion]")[1]!.split(" has joined the room.")
                      )
                      .join(",")}
                  </p>
                </>
              )}
            </div> */}
            <div className="overflow-auto">
              <p>Event Logs:</p>
              {whoSharedLocation.map((message, index) => (
                <p key={index}>{message}</p>
              ))}
			   {whoJoinedRoom.map((message, index) => (
                <p key={index}>{message}</p>
              ))}
            </div>

            {/* <div>
              <p>Meeting point</p>
            </div> */}
          </div>
          <div className="flex justify-center  "></div>
        </div>
      </div>

      {isMeetingPointSet &&
        sharedLocation.length > 0 &&
        (loading ? (
          <>
            <p>Loading...</p>
          </>
        ) : (
          <Map
            key={`${selectedCompanionLocation}`}
            startLocation={data.startLocation}
            endLocation={data.endLocation}
          />
        ))}
      {queryParams.userType === "Requester" && (
        <div className="mt-4">
          <label>Select Companion:</label>
          <select
            onChange={(e) => {
              setSelectedCompanionLocation(e.target.value);
              const value = e.target.value;
              setData((prevData) => ({
                ...prevData,
                startLocation: {
                  lat: parseFloat(value.split("+")[1]),
                  lng: parseFloat(value.split("+")[2]),
                },
              }));
            }}
          >
            <option value="">Select a Companion</option>
            {sharedLocation.map((companion, index) => {
              const companionName = companion.split("+")[0];
              if (companionName !== queryParams.username) {
                return (
                  <option key={index} value={sharedLocation[index]}>
                    {companionName}
                  </option>
                );
              }
              return null;
            })}
          </select>
        </div>
      )}

      {queryParams.userType === "Companion" && (
        <button onClick={handleShareLocation}>
          {hasSharedLocation ? "Location Shared" : "SHARE LOCATION"}
        </button>
      )}
      {/* {selectedCompanionLocation && (
        <div>
          Selected Companion's Location:{" "}
          {`lat:${selectedCompanionLocation.split("+")[1]} lng:${
            selectedCompanionLocation.split("+")[2]
          }`}
        </div>
      )} */}
    </div>
  );
};

export default MapChatPage;
