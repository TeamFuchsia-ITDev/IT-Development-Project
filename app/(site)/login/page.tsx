"use client";

import { useState, FormEvent, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import lsimage from "../../images/lsimage.png";
import SElogo from "../../images/logov3.svg";
import google from "../../images/googleIcon.svg";
import facebook from "../../images/facebookIcon.svg";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParams = searchParams.get("error");
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Check if the session is still loading
    if (status === "loading") {
      return; // Return early to prevent rendering more hooks
    }

    // If there is no session, redirect to the login page
    // if (session) {
    //   router.replace("/"); // Use router.replace to avoid extra rendering
    //   return; // Return early to prevent rendering more hooks
    // }

    // Handle errorParams
    // if (errorParams) {
    //   toast.error(
    //     "Email already exists, please login using the provider you initially used to register"
    //   );
    //   router.replace("/login"); // Use router.replace to avoid extra rendering
    // }
  }, [errorParams, session, status, router]);

  const loginWithFacebook = async () => {
    toast.loading("Logging in...", {
      duration: 4000,
    });

    const response = signIn("facebook", {
      callbackUrl: "http://localhost:3000/",
    });

    response.then(() => {
      toast.remove();
      toast.success("Logged in successfully!");
      setTimeout(() => {
        toast.dismiss();
        toast.loading("Redirecting now to the user dashboard", {
          duration: 4000,
        });
      }, 1000);

      setTimeout(() => {
        toast.remove();
        router.replace("/");
      }, 5000);
    })
	.catch(() => {
		toast.error("Something went wrong")
	});
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

  const loginUser = async (e: FormEvent) => {
    e.preventDefault();

    signIn("credentials", { ...data, redirect: false }).then((callback) => {
      if (callback?.error) {
        toast.error(callback.error);
      }

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
    });
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
                  <a href="/register" className="text-purple-700">
                    Sign up
                  </a>{" "}
                  now its free!
                </p>
                <a
                  href="/forgotpassword"
                  className="text-purple-700 text-center  mb-6 text-[12px]"
                >
                  Forgot Password?
                </a>
                <button
                  className="text-center bg-rose-500 text-white font-bold w-[385px] rounded h-[45px] hover:bg-white hover:text-rose-500 hover:border-[2px] hover:border-rose-500 hover:ease-in-out duration-300"
                  onClick={loginUser}
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
        </div>
      </div>
    </>
  );
}
