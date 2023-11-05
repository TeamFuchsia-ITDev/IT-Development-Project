"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState, FormEvent, ChangeEvent, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import defaultProfileImage from "@/app/images/blank-profile.jpg";
import logo1 from "@/app/images/logov1.svg";
import photo from "@/app/images/photo.svg";
import { LocationData, LocationFeature, FormData } from "@/app/libs/interfaces";

export default function CreateProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [disabled, setDisabled] = useState(false);

  const [data, setData] = useState<FormData>({
    name: "",
    birthday: "",
    ethnicity: "",
    gender: "",
    phonenumber: "",
    location: {
      lng: 0,
      lat: 0,
      address: {
        fullAddress: "",
        pointOfInterest: "",
        city: "",
        country: "",
      },
    },
  });

  const [location, setLocation] = useState<LocationData | undefined>(undefined);
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<LocationFeature[]>([]);

  const ethnicityOptions = [
    "Asian",
    "Black",
    "White",
    "Hispanic/Latino",
    "Native American",
    "Pacific Islander",
    "Middle Eastern",
    "Mixed Race",
    "Other",
  ];

  const genderOptions = ["Male", "Female", "Non-Binary", "Other"];

  //   // Check if the session is still loading
  if (status === "loading") {
    // return <p>Loading...</p>;
	return null;
  }

  if (!session) {
    router.replace("/login");
    return null;
  }

  if (session.user?.isNewUser === false) {
    router.replace("/dashboard");
    return null;
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      // Read the selected image file and convert it to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result?.toString();
        setImageBase64(base64Data!);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  async function handleLocationChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setAddress(val);

    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${val}
      .json?&country=ca&proximity=ip&types=address%2Cpoi&language=en&limit=3&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
    try {
      const response = await axios.get(endpoint);
      setLocation(response.data);
      setSuggestions(response.data?.features);
    } catch (error) {
      console.error("Error getting location suggestions:", error);
      toast.error("Error getting suggestions. Please try again.");
    }
  }

  const submitProfile = async (e: FormEvent) => {
    e.preventDefault();
    setDisabled(true);
    try {
      toast.loading("Creating your profile...", {
        duration: 4000,
      });

      const requestBody = {
        name: data.name,
        birthday: data.birthday,
        ethnicity: data.ethnicity,
        gender: data.gender,
        phonenumber: data.phonenumber,
        location: {
          lng: location?.features[0]?.geometry.coordinates[0],
          lat: location?.features[0]?.geometry.coordinates[1],
          address: {
            fullAddress: location?.features[0]?.place_name,
            pointOfInterest: location?.features[0]?.context[0]?.text,
            city: location?.features[0]?.context[2]?.text,
            country: location?.features[0]?.context[5]?.text,
          },
        },
        image: imageBase64,
      };

      const response = await axios.post(`api/user/profile`, requestBody);

      if (response.data.status !== 200) {
        const errorMessage = response.data?.error || "An error occurred";
        toast.error(errorMessage);
        setTimeout(() => setDisabled(false), 4000);
      } else {
        toast.success("Profile successfully created!");

        setTimeout(() => {
          toast.loading("Redirecting now to your dashboard...", {
            duration: 4000,
          });
        }, 1000);

        setTimeout(() => {
          toast.remove();
          router.push("/dashboard");
        }, 5000);
      }
    } catch (err) {
      const errorMessage = "An error occurred";
      toast.error(errorMessage);
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Allow only letters and spaces in the name field
    const newName = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    setData({ ...data, name: newName });
  };

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let formattedValue: string | RegExpMatchArray | null = value.replace(
      /\D/g,
      ""
    );
    if (formattedValue.length > 0) {
      formattedValue = formattedValue.match(/(\d{1,3})(\d{0,3})(\d{0,4})/); // split into groups of 3 digits
      formattedValue = [
        formattedValue![1],
        formattedValue![2],
        formattedValue![3],
      ]
        .filter((group) => group.length > 0)
        .join("-"); // join groups with dashes
    }
    setData({ ...data, phonenumber: formattedValue });
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-[70px] w-auto"
            src={logo1.src}
            alt="Your Company"
          />
          <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Profile Creation Page
          </h2>
          <p className="text-center mt-4">
            Almost there {session.user.name}, to be able to use our platform we
            need to know more about you
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={submitProfile}>
            {/* Profile Image */}
            <div>
              <label
                htmlFor="profileImage"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Profile Image (note that this will be public to other users)
              </label>
              <div className="mt-2">
                <div onClick={() => fileInputRef.current?.click()}>
                  {imageBase64 ? (
                    <img
                      src={imageBase64}
                      alt="Selected File"
                      className="w-[200px] h-[200px] m-auto rounded-[10px] border-2 border-grey-500 object-cover "
                    />
                  ) : (
                    <div className="flex flex-col items-center">

                      <img
                        src={defaultProfileImage.src}
                        alt="Default Image"
                        className="w-[100px] h-[80px] m-auto object-fit"
                      />
                      <img
                        src={photo.src}
                        alt="Default Image"
                        className="w-[20px] absolute mt-6 object-fit"
                      />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="profileImage"
                  ref={(input) => {
                    fileInputRef.current = input;
                  }}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={data.name}
                  onChange={handleNameChange}
                  className="block w-full h-[45px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* Ethnicity dropdown */}
            <div>
              <label
                htmlFor="ethnicity"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Ethnicity
              </label>
              <div className="mt-2">
                <select
                  id="ethnicity"
                  name="ethnicity"
                  value={data.ethnicity}
                  onChange={(e) =>
                    setData({ ...data, ethnicity: e.target.value })
                  }
                  className="block w-full h-[45px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="" disabled>
                    Select Ethnicity
                  </option>
                  {/* Map through the array to generate options */}
                  {ethnicityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Gender radio buttons */}
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Gender
              </label>
              <div className="mt-2">
                <div className="flex items-center space-x-4 gap-4">
                  {genderOptions.map((option) => (
                    <div key={option}>
                      <input
                        id={option.toLowerCase()}
                        name="gender"
                        type="radio"
                        value={option}
                        checked={data.gender === option}
                        onChange={(e) =>
                          setData({ ...data, gender: e.target.value })
                        }
                        className="form-radio h-4 w-4 text-rose-500 focus:ring-rose-500 "
                      />
                      <label
                        htmlFor={option.toLowerCase()}
                        className="text-sm text-gray-900 ml-2"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Birthday date picker */}
            <div>
              <label
                htmlFor="birthday"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Birthday
              </label>
              <div className="mt-2">
                <input
                  id="birthday"
                  name="birthday"
                  type="date"
                  value={data.birthday}
                  onChange={(e) => {
                    const date = e.target.value;
                    if (!date) return;
                    const formattedDate = new Date(date)
                      .toISOString()
                      .split("T")[0];
                    setData({ ...data, birthday: formattedDate });
                  }}
                  className="block w-full h-[45px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* Phone Number input */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="phonenumber"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Phone Number
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="phonenumber"
                  name="phonenumber"
                  type="text"
                  value={data.phonenumber}
                  onChange={handlePhoneNumberChange}
                  className="block w-full h-[45px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Address
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={address}
                  onChange={handleLocationChange}
                  className="block w-full h-[45px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {suggestions?.length > 0 && (
                <div className="bg-white border border-gray-300 rounded-lg z-10 overflow-auto max-h-40">
                  {suggestions.map((suggestion, index) => (
                    <p
                      className="p-4 cursor-pointer text-sm text-black transition duration-200 ease-in-out bg-gray-100 hover:bg-green-200"
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
            <div className="flex text-center items-center justify-center">Want to continue later? <a className="ml-[4px] text-rose-500 hover:cursor-pointer" onClick={() => signOut()}> Sign Out</a></div>
            <div>
              <button
                type="submit"
                className={`${disabled ? "text-center bg-rose-500 text-white font-bold w-[385px] rounded h-[45px] opacity-50 cursor-not-allowed" : "text-center bg-rose-500 text-white font-bold w-[385px] rounded h-[45px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300"}`}
                disabled={disabled}
              >
                Create your profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
