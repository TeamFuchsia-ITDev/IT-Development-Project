import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { User } from "./components/user";
import { redirect } from "next/navigation";
import Link from "next/link";
import { NavbarLanding } from "./components/navbar-landing";
import ImageLandings from "@/app/images/ImageLanding.png";
import blobimage from "@/app/images/blob.png";
import blankprofile from "@/app/images/blank-profile.jpg";
import { TestimonialCard } from "@/app/components/testimonialcard";

export default async function Home() {
  const session = await getServerSession(authOptions);

  //   if (session) {
  //     if (session?.user?.isNewUser === true) {
  //       redirect("/create-profile");
  //     }
  //   }

  return (
    // <section>
    //   <h1>Home</h1>
    //   <h1>Server Side Rendered</h1>
    //   <pre>{JSON.stringify(session)}</pre>
    //   <h1>Client Side Rendered</h1>
    //   <User />
    //   <div>
    //     <Link href="/login">
    //       <button className="text-gray-900 underline hover:text-gray-900/70">
    //         Go to login
    //       </button>
    //     </Link>
    //   </div>
    //   <div>
    //     <Link href={`/profile`}>
    //       <button className="text-gray-900 underline hover:text-gray-900/70">
    //         Go to profile
    //       </button>
    //     </Link>
    //   </div>
    //   <div>
    //     <Link href={`/register`}>
    //       <button className="text-gray-900 underline hover:text-gray-900/70">
    //         Go to register
    //       </button>
    //     </Link>
    //   </div>
    // </section>
    <div>
      <div className="">
        <NavbarLanding />
      </div>
      <div className="relative">
        <div className="flex h-[650px] justify-center items-center">
          <div className=" text-center">
            <img
              src={ImageLandings.src}
              alt="Serve-Ease"
              className="absolute z-[-1] top-0 h-[680px] left-0 w-screen object-cover"
            />
            <h1 className="text-[30px] text-white">
              JOIN THE <span className="text-blue-500 ">SERVE-EASE</span>{" "}
              COMMUNITY TODAY
            </h1>
            <h1 className="text-[30px] text-white">
              {" "}
              AND START HELPING OR START GIVING OPPORTUNITIES
            </h1>
            <p className="text-[18.5px] text-white">
              Become a <span className="text-red-500 ">Companion</span> to lend
              a helping hand or be a{" "}
              <span className="text-blue-500">Requester</span> to seek for help,
              sign up today.
            </p>
            <div className="flex flex-row gap-2  justify-center mt-5">
              <Link href={`/register`}>
                <button className="bg-blue-500 text-white font-bold text-[15px] rounded w-[300px] h-[45px] hover:bg-white hover:text-blue-500 hover:border-[3px] hover:border-blue-500 hover:ease-in-out duration-300">
                  Sign up free!
                </button>
              </Link>
              <p className="flex justify-center items-center gap-1 text-white">
                Already have an account?{" "}
                <a href="/login" className="text-blue-500 text-center">
                  {" "}
                  Sign In here{" "}
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-row h-[650px] w-[100%] justify-center items-center gap-12 pl-24 mt-32">
          <div className="w-1/2 flex flex-col ">
            <h1 className="text-[60px]">Why use our App?</h1>
            <p className="text-xl ">
              We create a platform that helps connects individuals who are
              seeking for help to complete specific task that they cant do
              alone. It also helps individuals whenever they’re just lonely and
              need someone just to be their companion. its free of use everyone
              could either be a companion or a requester. Our main goal for this
              platform is to ensure users will have someone to lean on in times
              of loneliness, someone to be with just to have fun or simple have
              someone to chat with
            </p>
          </div>
          <div className="w-1/2 ">
            <img src={blobimage.src} alt="" className="w-[600px]" />
          </div>
        </div>
        <div className="flex flex-col w-[100%] justify-center ">
          <div>
            <h1 className="text-[60px] text-center mt-12">Testimonials</h1>
          </div>

          {/* <div className="flex flex-row">
            <img
              src={blankprofile.src}
              alt=""
              className="w-[100px] object-cover"
            />
            <div className="flex flex-col justify-center ml-4">
              <h1 className="font-bold">Safety of our users</h1>
              <h1 className="w-[200px]">
                We double check users who have registered
              </h1>
            </div>
          </div> */}
          <div className="flex flex-row justify-center gap-12 mt-24 mb-12">
            {" "}
            <TestimonialCard />
            <TestimonialCard />
            <TestimonialCard />
          </div>

          <div className="flex flex-row justify-center gap-12  mb-24">
            {" "}
            <TestimonialCard />
            <TestimonialCard />
            <TestimonialCard />
          </div>
        </div>
        <div>
          

        </div>
      </div>
    </div>
  );
}
