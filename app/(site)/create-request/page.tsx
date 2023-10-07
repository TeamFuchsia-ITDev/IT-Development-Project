"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, FormEvent, ChangeEvent, useRef } from "react";
import logo1 from "../../images/logov1.svg";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function CreateRequest() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  //   // Check if the session is still loading
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    router.replace("/login");
    return null;
  }

  if (session.user?.isNewUser === false) {
    router.replace("/");
    return null;
  }

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
            Create Request Page
          </h2>
          <p className="text-center mt-4">
            Welcome to Request Creation page {session.user.name}!
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={submitProfile}>
            

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
                    console.log(formattedDate);
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

            <div>
              <button
                type="submit"
                className="text-center bg-rose-500 text-white font-bold w-[385px] rounded h-[45px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300"
                disabled={isLoading}
              >
                Create your profile
              </button>
            </div>
          </form>
        </div>
      </div>
	</>
  )
}
