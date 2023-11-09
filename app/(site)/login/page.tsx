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
import { Input } from "@nextui-org/react";

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
    <div className="flex flex-row ">
      {/* <div>
          <Image
            src={SElogo}
            alt="Login"
            className="w-[200px] h-[200px] m-none absolute mt-[-60px]"
          />
        </div> */}

      {/* <div className="flex flex-col justify-center m-auto">
          <div className="">
            <h1 className="text-4xl font-bold text-center mb-2 mt-4">
              Sign in
            </h1>
            <p className="text-center mb-8">
              Sign in now and start using and exploring our app
            </p>
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
                  <p className="mt-[14px] mr-6">Sign in with google</p>
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
                  <p className="mt-[14px] mr-4">Sign in with Facebook</p>
                </button>
              </div>

              <div className="inline-flex items-center justify-center w-full">
                <hr className="w-[200px] h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                <span className=" font-medium text-gray-900  bg-white ml-4 mr-4">
                  OR
                </span>
                <hr className="w-[200px] h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
              </div>

              <p className="text-center mb-4">Sign in using your credentials</p>
              <p className="ml-2 text-[12px]">Email</p>
              <input
                className="border-2 border-gray-300  h-[45px] m-2"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
              <p className="ml-2 text-[12px]">Password</p>
              <input
                className="border-2 border-gray-300 h-[45px]  m-2"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />

              <div className="flex flex-col  items-center">
                <p className="text-center mt-4 text-[12px]">
                  Don't have an account?{" "}
                  <a href="/register" className="text-blue-500">
                    Sign up
                  </a>{" "}
                  now its free!
                </p>
                <a
                  href="/forgotpassword"
                  className="text-blue-500 text-center mt-2 mb-6 text-[12px]"
                >
                  Forgot Password?
                </a>
                <button
                  className={`${
                    disabled
                      ? "text-center bg-blue-500 opacity-50 text-white font-bold w-[385px] rounded h-[45px] cursor-not-allowed"
                      : "text-center bg-blue-500 text-white font-bold w-[385px] rounded h-[45px] hover:bg-white hover:text-blue-500 hover:border-[2px] hover:border-blue-500 hover:ease-in-out duration-300"
                  }`}
                  onClick={loginUser}
                  disabled={disabled}
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <Image
            src={lsimage}
            alt="Login"
            className="w-[700px] h-screen top-0 left-0 object-cover"
          />
        </div> */}

      <div className="flex flex-row w-[100%]">
        <div className="w-[50%]">
          <div>
            <Image src={SElogo} alt="Login" className="w-[200px] mt-4" />
          </div>
          <div className="flex flex-col h-[660px] justify-center items-center">
            <div className="">
              <h1 className="text-4xl font-bold  mb-2 mt-4 ">
                Welcome back to <span className="text-blue-500">Serve-Ease</span>
              </h1>
              <p className="text-sm">
                Sign in now and start using and exploring our app
              </p>
              <div className="flex flex-col w-[360px] mt-4">
                <input
                  className="border-2 border-gray-300 h-[45px] rounded-md"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
                <input
                  className="border-2 border-gray-300 h-[45px] rounded-md mt-4"
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
                <a className="text-blue-500 text-[12px] mt-4" href="#">Forgot-password?</a>
              <button
                className={`${
                  disabled
                    ? "text-center bg-blue-500 opacity-50 text-white font-bold w-[360px] rounded h-[45px] cursor-not-allowed mt-4"
                    : "text-center bg-blue-500 text-white font-bold w-[360px] rounded h-[45px] hover:bg-white hover:text-blue-500 hover:border-[2px] hover:border-blue-500 hover:ease-in-out duration-300 mt-4"
                }`}
                onClick={loginUser}
                disabled={disabled}
              >
                Sign in
              </button>

              </div>

              
              <div className="inline-flex items-center  w-full">
                <hr className="w-[155px] h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                <span className=" font-medium text-gray-900  bg-white ml-4 mr-4">
                  OR
                </span>
                <hr className="w-[155px] h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
              </div>
              
             <button className="bg-white hover:opacity-80 border-2 font-bold text-[12px] rounded w-[360px] h-[45px] flex flex-row mt-4 items-center justify-center" onClick={loginWithGoogle}>
                <Image src={google} alt="google" className="w-[20px] h-[20px] mr-2" />
                <p className="">Sign in with google</p>
              </button>

              <button className="bg-blue-500 hover:bg-blue-600 border-2 text-white font-bold text-[12px] rounded w-[360px] h-[45px] flex flex-row mt-4 items-center justify-center" onClick={loginWithGoogle}>
                <Image src={facebook} alt="google" className="w-[20px] h-[20px] mr-2" />
                <p className="">Sign in with Facebook</p>
              </button>
             
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  );
}
