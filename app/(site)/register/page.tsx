"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import lsimage from "../../images/lsimage.png";
import SElogo from "../../images/logov3.svg";
import google from "../../images/googleIcon.svg";
import facebook from "../../images/facebookIcon.svg";
import { signIn } from "next-auth/react";

export default function Register() {
  const router = useRouter();

  // useStates
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const registerUser = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`api/register`, data);

      if (response.data.status !== 200) {
        const errorMessage = response.data?.error || "An error occurred";
        toast.error(errorMessage);
      } else {
        toast.success("User successfully registered!");
        setTimeout(
          () =>
            toast.loading("Redirecting now to the login page...", {
              duration: 4000,
            }),
          1000
        );
        setTimeout(() => {
          toast.dismiss();
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      const errorMessage = "An error occurred";
      toast.error(errorMessage);
    }
  };

  const loginWithFacebook = async () => {
    signIn("facebook", { callbackUrl: "http://localhost:3000/" }).then(
      (callback) => {
        if (callback?.ok && !callback?.error) {
          toast.success("Logged in successfully!");
          setTimeout(
            () =>
              toast.loading("Redirecting now to the user dashboard", {
                duration: 4000,
              }),
            1000
          );
          setTimeout(() => {
            toast.dismiss();
            router.replace("/");
          }, 2000);
        }
      }
    );
  };

  const loginWithGoogle = async () => {
    signIn("google", { callbackUrl: "http://localhost:3000/" }).then(
      (callback) => {
        if (callback?.ok && !callback?.error) {
          toast.success("Logged in successfully!");
          setTimeout(
            () =>
              toast.loading("Redirecting now to the user dashboard", {
                duration: 4000,
              }),
            1000
          );
          setTimeout(() => {
            toast.dismiss();
            router.replace("/");
          }, 2000);
        }
      }
    );
  };

  return (
    <>
      <div className="flex flex-row ">
        <div>
          <Image
            src={SElogo}
            alt="Login"
            className="w-[200px] h-[200px] m-none absolute mt-[-60px]"
          />
        </div>

        <div className="flex flex-col justify-center m-auto w-[400px]">
          <div className="">
            <h1 className="text-4xl font-bold text-center mb-2 mt-4">
              Sign up
            </h1>
            <p className="text-center mb-6">
              Create free account now and start meeting others
            </p>

            <div className="flex flex-col">
              <div className="flex flex-col">
                <div className="flex flex-row gap-3">
                  <button
                    className="bg-black hover: text-white font-bold text-[12px] rounded w-[500px] h-[45px] flex flex-row"
                    onClick={loginWithGoogle}
                  >
                    <Image
                      src={google}
                      alt="google"
                      className="w-[20px] h-[20px] m-auto"
                    />
                    <p className="mt-[14px] mr-6">Sign up with google</p>
                  </button>

                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-[12px] rounded w-[500px] h-[45px] flex flex-row"
                    onClick={loginWithFacebook}
                  >
                    <Image
                      src={facebook}
                      alt="facebook"
                      className="w-[20px] h-[20px] m-auto"
                    />
                    <p className="mt-[14px] mr-4">Sign up with Facebook</p>
                  </button>
                </div>

                <div className="inline-flex items-center justify-center w-full">
                  <hr className="w-[200px] h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                  <span className=" font-medium text-gray-900  bg-white ml-4 mr-4">
                    OR
                  </span>
                  <hr className="w-[200px] h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                </div>
              </div>

              <p className="ml-2 text-[13px]">Name</p>
              <input
                type="text"
                placeholder=""
                className="border-2 border-gray-300  h-[45px] m-2"
                id="name"
                name="name"
                //   required
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />

              <p className="ml-2 text-[13px]">Email</p>
              <input
                type="text"
                placeholder=""
                className="border-2 border-gray-300  h-[45px] m-2"
                id="email"
                name="email"
                autoComplete="email"
                //   required
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />

              <p className="ml-2 text-[13px]">Password</p>
              <input
                type="password"
                placeholder=""
                className="border-2 border-gray-300 h-[45px]  m-2"
                id="password"
                name="password"
                autoComplete="current-password"
                //   required
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />

              <p className="ml-2 text-[13px]">Confirm Password</p>
              <input
                placeholder=""
                className="border-2 border-gray-300  h-[45px] m-2"
                id="confirmpassword"
                name="confirmpassword"
                type="password"
                //   required
                value={data.confirmpassword}
                onChange={(e) =>
                  setData({ ...data, confirmpassword: e.target.value })
                }
              />

              <div className="flex flex-row justify-center mt-6 m-auto mb-8">
                <input
                  type="checkbox"
                  className="mr-2 ml-2 mt-[0.9px]"
                  id="rules"
                />
                <p className="text-center text-[13px] ">
                  By signing up, you agree with the
                  <a href="rules" className="text-purple-700">
                    {" "}
                    terms and rules{" "}
                  </a>
                  of using this platform. If you already have an account{" "}
                  <a href="/login" className="text-purple-700">
                    Sign in
                  </a>
                </p>
              </div>
              <div className="flex flex-col  items-center">
                <button
                  className="text-center bg-rose-500 text-white font-bold w-[385px] rounded h-[45px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300"
                  onClick={registerUser}
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          {/* <Image
            src={logov3}
            alt="Login"
            className="w-[200px] h-[200px] m-4 absolute top-0 left-0"
          /> */}

          <Image
            src={lsimage}
            alt="Login"
            className="w-[700px] h-screen top-0 left-0 object-cover"
          />
        </div>
      </div>
    </>
  );
}