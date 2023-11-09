"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import lsimage from "../../images/lsimage.png";
import SElogo from "../../images/Serve-ease.svg";
import google from "../../images/googleIcon.svg";
import facebook from "../../images/facebookIcon.svg";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);

  // useStates
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const registerUser = async (e: FormEvent) => {
    setDisabled(true);
    e.preventDefault();
    try {
      const response = await axios.post(`api/register`, data);

      if (response.data.status !== 200) {
        const errorMessage = response.data?.error || "An error occurred";
        toast.error(errorMessage);
        setTimeout(() => setDisabled(false), 4000);
      } else {
        toast.success("Registration successful!");
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
    const response = signIn("facebook", {
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?provider=facebook`,
    });

    response
      .then(() => {
        toast.loading("Signing in using your facebook account...", {
          duration: 4000,
        });
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  const loginWithGoogle = async () => {
    toast.loading("Signing in...", {
      duration: 4000,
    });

    setTimeout(() => {
      toast.loading("Redirecting to Google Sign up", {
        duration: 4000,
      });
    }, 4000);

    setTimeout(() => {
      signIn("google", {
        callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?provider=google`,
      });
    }, 4000);
  };

  return (
    // <div className="flex flex-row ">
    //   <div>
    //     <Image
    //       src={SElogo}
    //       alt="Login"
    //       className="w-[200px] h-[200px] m-none absolute mt-[-60px]"
    //     />
    //   </div>

    //   <div className="flex flex-col justify-center m-auto w-[400px]">
    //     <div className="">
    //       <h1 className="text-4xl font-bold text-center mb-2 mt-4">
    //         Sign up
    //       </h1>
    //       <p className="text-center mb-6">
    //         Create free account now and start meeting others
    //       </p>

    //       <div className="flex flex-col">
    //         <div className="flex flex-col">
    //           <div className="flex flex-row gap-3">
    //             <button
    //               className="bg-black hover: text-white font-bold text-[12px] rounded w-[500px] h-[45px] flex flex-row"
    //               onClick={loginWithGoogle}
    //             >
    //               <Image
    //                 src={google}
    //                 alt="google"
    //                 className="w-[20px] h-[20px] m-auto"
    //               />
    //               <p className="mt-[14px] mr-6">Sign up with google</p>
    //             </button>

    //             <button
    //               className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-[12px] rounded w-[500px] h-[45px] flex flex-row"
    //               onClick={loginWithFacebook}
    //             >
    //               <Image
    //                 src={facebook}
    //                 alt="facebook"
    //                 className="w-[20px] h-[20px] m-auto"
    //               />
    //               <p className="mt-[14px] mr-4">Sign up with Facebook</p>
    //             </button>
    //           </div>

    //           <div className="inline-flex items-center justify-center w-full">
    //             <hr className="w-[200px] h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
    //             <span className=" font-medium text-gray-900  bg-white ml-4 mr-4">
    //               OR
    //             </span>
    //             <hr className="w-[200px] h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
    //           </div>
    //         </div>

    //         <p className="ml-2 text-[13px]">Name</p>
    //         <input
    //           type="text"
    //           placeholder=""
    //           className="border-2 border-gray-300  h-[45px] m-2"
    //           id="name"
    //           name="name"
    //           //   required
    //           value={data.name}
    //           onChange={(e) => setData({ ...data, name: e.target.value })}
    //         />

    //         <p className="ml-2 text-[13px]">Email</p>
    //         <input
    //           placeholder=""
    //           className="border-2 border-gray-300  h-[45px] m-2"
    //           id="email"
    //           name="email"
    //           type="email"
    //           autoComplete="email"
    //           //   required
    //           value={data.email}
    //           onChange={(e) => setData({ ...data, email: e.target.value })}
    //         />

    //         <p className="ml-2 text-[13px]">Password</p>
    //         <input
    //           placeholder=""
    //           className="border-2 border-gray-300 h-[45px]  m-2"
    //           id="password"
    //           name="password"
    //           type="password"
    //           autoComplete="current-password"
    //           //   required
    //           value={data.password}
    //           onChange={(e) => setData({ ...data, password: e.target.value })}
    //         />

    //         <p className="ml-2 text-[13px]">Confirm Password</p>
    //         <input
    //           placeholder=""
    //           className="border-2 border-gray-300  h-[45px] m-2"
    //           id="confirmpassword"
    //           name="confirmpassword"
    //           type="password"
    //           //   required
    //           value={data.confirmpassword}
    //           onChange={(e) =>
    //             setData({ ...data, confirmpassword: e.target.value })
    //           }
    //         />

    //         <div className="flex flex-row justify-center mt-6 m-auto mb-8">
    //           <input
    //             type="checkbox"
    //             className="mr-2 ml-2 mt-[0.9px]"
    //             id="rules"
    //           />
    //           <p className="text-center text-[13px] ">
    //             By signing up, you agree with the
    //             <a href="rules" className="text-blue-500">
    //               {" "}
    //               terms and rules{" "}
    //             </a>
    //             of using this platform. If you already have an account{" "}
    //             <a href="/login" className="text-blue-500">
    //               Sign in
    //             </a>
    //           </p>
    //         </div>
    //         <div className="flex flex-col  items-center">
    //           <button
    //             className={`${disabled ? "text-center bg-blue-500 opacity-50 text-white font-bold w-[385px] rounded h-[45px] cursor-not-allowed" : "text-center bg-blue-500 text-white font-bold w-[385px] rounded h-[45px] hover:bg-white hover:text-blue-500 hover:border-[2px] hover:border-blue-500 hover:ease-in-out duration-300"}`}
    //             disabled={disabled}
    //             onClick={registerUser}
    //           >
    //             Sign up
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="">
    //     {/* <Image
    //       src={logov3}
    //       alt="Login"
    //       className="w-[200px] h-[200px] m-4 absolute top-0 left-0"
    //     /> */}

    //     <Image
    //       src={lsimage}
    //       alt="Login"
    //       className="w-[700px] h-screen top-0 left-0 object-cover"
    //     />
    //   </div>
    // </div>
    <div className="flex flex-row">
      <div className="flex flex-row w-[100%]">
        <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
          <div className="">
            <Link href="/">
              <Image src={SElogo} alt="Login" className="w-[150px] mt-4" />
            </Link>
          </div>
          <div className="flex flex-col h-[660px] justify-center items-center  pl-7 md:pl-0 lg:pl-0 xl:pl-0 pt-32 md:pt-0 lg-pt-0 xl:pt-0">
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold mb-2 mt-4 text-left">
                Welcome back to{" "}
                <span className="text-blue-500 block">Serve-Ease</span>
              </h1>
              <p className="text-sm">
                Sign up now and start using and exploring our app
              </p>
              <div className="flex flex-col w-[360px] mt-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="border-2 border-gray-300 h-[45px] rounded-md pl-4"
                  id="name"
                  name="name"
                  //   required
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />

                <input
                  placeholder="Email"
                  className="border-2 border-gray-300 h-[45px] rounded-md pl-4 mt-4"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  //   required
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />

                <input
                  placeholder="Password"
                  className="border-2 border-gray-300 h-[45px] rounded-md pl-4 mt-4"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  //   required
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                />

                <input
                  placeholder="Confirm Password"
                  className="border-2 border-gray-300 h-[45px] rounded-md pl-4 mt-4"
                  id="confirmpassword"
                  name="confirmpassword"
                  type="password"
                  //   required
                  value={data.confirmpassword}
                  onChange={(e) =>
                    setData({ ...data, confirmpassword: e.target.value })
                  }
                />
                <div className="flex flex-row mt-4">
                  {" "}
                  <input
                    type="checkbox"
                    className="mr-2 ml-2 mt-[0.9px] "
                    id="rules"
                  />
                  <p className="text-[12px]">
                    You agree with the{" "}
                    <a className="text-blue-500" href="/">
                      Terms and Condition
                    </a>{" "}
                    of our Website
                  </p>
                </div>
                <button
                  className={`${
                    disabled
                      ? "text-center bg-blue-500 opacity-50 text-white font-bold w-[360px] rounded h-[45px] cursor-not-allowed mt-4"
                      : "text-center bg-blue-500 text-white font-bold w-[360px] rounded h-[45px] hover:bg-white hover:text-blue-500 hover:border-[2px] hover:border-blue-500 hover:ease-in-out duration-300 mt-4"
                  }`}
                  onClick={registerUser}
                  disabled={disabled}
                >
                  Sign up
                </button>
                <div className="inline-flex items-center w-full">
                  <hr className="w-[155px] h-px my-8 bg-gray-200 border-0 bg-gray-700"></hr>
                  <span className=" text-[12px] text-gray-900  bg-white ml-4 mr-4">
                    OR
                  </span>
                  <hr className="w-[155px] h-px my-8 bg-gray-200 border-0 bg-gray-700"></hr>
                </div>
                <button
                  className="bg-white hover:opacity-80 border-2 font-bold text-[12px] rounded w-[360px] h-[45px] flex flex-row items-center justify-center"
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
                  className="bg-blue-500 hover:bg-blue-600 border-2 text-white font-bold text-[12px] rounded w-[360px] h-[45px] flex flex-row mt-4 items-center justify-center mb-2"
                  onClick={loginWithFacebook}
                >
                  <Image
                    src={facebook}
                    alt="google"
                    className="w-[20px] h-[20px] mr-2"
                  />
                  <p className="">Sign in with Facebook</p>
                </button>
                <a className="text-blue-600 text-[12px]" href="/login">
                  Already have an account? Sign in
                </a>
              </div>
            </div>
          </div>
          
        </div>
        <div className="w-1/2 relative">
          <img
            src={lsimage.src}
            alt="Login"
            className=" h-screen w-screen object-cover sm:block hidden md:block lg:block xl:block"
          />
        </div>
      </div>
    </div>
  );
}
