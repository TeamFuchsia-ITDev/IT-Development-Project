"use client";

import { useState, FormEvent, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import lsimage from "../../images/lsimage.png";
import SElogo from "../../images/Serve-ease.svg";
import google from "../../images/googleIcon.svg";
import facebook from "../../images/facebookIcon.svg";
import { handleEnterKeyPress } from "@/app/libs/actions";
import Link from "next/link";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParams = searchParams.get("error");
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Check if the session is still loading
    if (status === "loading") {
      return;
    }

    // If there is a session, redirect to the login page
    if (session) {
      if (session?.user.isNewUser) {
        router.replace("/create-profile");
      } else {
        if (session?.user.provider === "credentials") {
          router.push("/dashboard?provider=credentials");
        }
      }
    }

    // Handle errorParams
    if (errorParams) {
      toast.error(
        "Email already exists, please login using the provider you initially used to register"
      );
      router.replace("/login");
    }
  }, [session, status, router]);

  const loginWithFacebook = async () => {
    const response = signIn("facebook", {
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?provider=facebook`,
    });

    response
      .then(() => {
        toast.loading("Logging in using your facebook account...", {
          duration: 4000,
        });
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  const loginWithGoogle = async () => {
    toast.loading("Logging in...", {
      duration: 4000,
    });

    setTimeout(() => {
      toast.loading("Redirecting to Google Sign up", {
        duration: 4000,
      });
    }, 4000);

    setTimeout(() => {
      const response = signIn("google", {
        callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?provider=google`,
      });

      response
        .then(() => {})
        .catch((error) => {
          toast.error("Something went wrong", error);
        });
    }, 4000);
  };

  const loginUser = async (e: FormEvent) => {
    setDisabled(true);
    e.preventDefault();

    toast.loading("Logging in...", {
      duration: 2000,
    });
    setTimeout(() => setDisabled(false), 5000);
    setTimeout(() => {
      signIn("credentials", {
        ...data,
        redirect: false,
      }).then((callback) => {
        if (callback?.error) {
          toast.error(callback.error);
        }
      });
    }, 2000);
  };

  return (
    <div className="flex">
      <div className="flex w-full justify-center items-center ">
        <div className="flex justify-center w-max max-w-[300px] md:max-w-full md:w-full lg:w-1/2 xl:w-1/2 ">
          <div className="">
            <Link href="/">
              <Image
                src={SElogo}
                alt="Login"
                className="hidden md:hidden lg:block xl:block absolute top-[10px] w-[150px] left-[25px] mt-4"
              />
            </Link>
          </div>
          {/* <div className="flex flex-col h-screen w-screen lg:w-full mt-12 xl:mt-0 lg:mt-0 md:justify-center lg:justify-center xl:justify-center items-center "> */}
          <div className=" flex justify-center ">
            {/* <div className="flex flex-col"> */}
            <div className="">
              <Link href="/">
                <img
                  src={SElogo.src}
                  alt="Login"
                  className="block md:block lg:hidden xl:hidden w-[200px] ml-[-23px]"
                />
              </Link>
              <h1 className="text-4xl font-bold mb-2 mt-4">
                Welcome back to{" "}
                <span className="text-blue-500 block">Serve-Ease</span>
              </h1>
              <p className="text-sm">
                Sign in now and start using and exploring our app
              </p>
              <div
                className="flex flex-col mt-4 xl:w-[350px]"
                onKeyDown={(e) =>
                  handleEnterKeyPress(e, loginUser, disabled, setDisabled)
                }
              >
                <input
                  className="border-2 border-gray-300 h-[45px] rounded-md pl-4"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
                <input
                  className="border-2 border-gray-300 h-[45px] rounded-md mt-4 pl-4"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                />
                <a className="text-blue-500 text-[12px] mt-4" href="#">
                  Forgot-password?
                </a>
                <button
                  className={`${
                    disabled
                      ? "text-center bg-blue-500 opacity-50 text-white font-bold w-auto rounded h-[45px] cursor-not-allowed mt-4"
                      : "text-center bg-blue-500 text-white font-bold w-auto rounded h-[45px] hover:bg-white hover:text-blue-500 hover:border-[2px] hover:border-blue-500 hover:ease-in-out duration-300 mt-4"
                  }`}
                  onClick={loginUser}
                  disabled={disabled}
                >
                  Sign in
                </button>
              </div>

              <div className="inline-flex items-center w-full">
                <hr className="w-full h-px my-8 bg-gray-200 border-0 bg-gray-700"></hr>
                <span className=" text-[12px] text-gray-900  bg-white ml-4 mr-4">
                  OR
                </span>
                <hr className="w-full h-px my-8 bg-gray-200 border-0 bg-gray-700"></hr>
              </div>
              <div className="flex flex-col ">
                <button
                  className="bg-white hover:opacity-80 border-2 font-bold text-[12px] rounded w-auto h-[45px] flex flex-row items-center justify-center"
                  onClick={loginWithGoogle}
                >
                  <Image
                    src={google}
                    alt="google"
                    className="w-[20px] h-[20px] mr-2"
                  />
                  <p className="">Sign in with google</p>
                </button>

                <button
                  className="bg-blue-500 hover:bg-blue-600 border-2 text-white font-bold text-[12px] rounded w-auto h-[45px] flex flex-row mt-4 items-center justify-center mb-2"
                  onClick={loginWithFacebook}
                >
                  <Image
                    src={facebook}
                    alt="google"
                    className="w-[20px] h-[20px] mr-2"
                  />
                  <p className="">Sign in with Facebook</p>
                </button>
                <a className="text-blue-600 text-[12px] " href="/register">
                  Dont have an account? Sign up
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[0%] lg:w-1/2 relative">
          <img
            src={lsimage.src}
            alt="Login"
            className=" h-screen w-screen object-cover hidden md:block lg:block xl:block"
          />
        </div>
      </div>
    </div>
  );
}
