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
import post from "@/app/images/Post.svg";
import choose from "@/app/images/choose.svg";
import profile from "@/app/images/profile.svg";
import chat from "@/app/images/chat.svg";
import locationicon from "@/app/images/locationicon.svg";
import look from "@/app/images/look.svg";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    if (session?.user?.isNewUser === true) {
      redirect("/create-profile");
    } else {
      redirect("/dashboard");
    }
  }

  return (
    <div className="">
      <div className="">
        <NavbarLanding />
      </div>
      <div className="relative">
        <div className="flex h-[650px] justify-center items-center pl-12 pr-12" >
          <div className=" text-center ">
            <img
              src={ImageLandings.src}
              alt="Serve-Ease"
              className="absolute z-[-1] top-0 h-[680px] left-0 w-screen object-cover sm:block hidden md:block lg:block xl:block"
            />
            <h1 className="text-[30px] sm:text-black md:text-white">
              JOIN THE <span className="text-blue-500 ">SERVE-EASE</span>{" "}
              COMMUNITY TODAY
            </h1>
            <h1 className="md:text-[30px] sm:text-black md:text-white">
              {" "}
             
            </h1>
            <p className=" md:text-[18.5px]  sm:text-black md:text-white">
                Become a <span className="text-red-500 ">Companion</span> to lend
              a helping hand or be a{" "}
              <span className="text-blue-500">Requester</span> to seek for help,
              sign up today.
            </p>
            <div className="flex flex-row gap-2  justify-center mt-5">
              <Link href={`/register`}>
                <button
                  className="bg-blue-500 text-white font-bold text-[15px] rounded w-[300px] h-[45px] hover:bg-white hover:text-blue-500 hover:border-[3px] hover:border-blue-500 hover:ease-in-out duration-300"
                  style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                >
                  Sign up free!
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="pl-24 p-24  overflow-hidden">
          <div className="flex flex-row h-[650px] w-[100%] justify-center items-center gap-12 mt-12">
            <div className="w-1/2 flex flex-col ">
              <h1 className="text-[50px]">
                Why <span className="text-blue-500">use</span> our App?
              </h1>
              <p className="text-xl">
                Welcome to our platform, where we've crafted a unique space for
                connecting people who need a helping hand with tasks they can't
                tackle on their own. But that's not all – it's also a place for
                those times when you're feeling a bit lonely and just want some
                friendly company.
              </p>
              <br />
              <p className="text-xl">
                What sets us apart is the flexibility we offer.{" "}
                <span className="text-red-500">Companions</span> have the choice
                to provide their services either for free, as a gesture of
                kindness, or they can charge for their expertise.{" "}
                <span className="text-blue-500">Requesters</span> on the other
                hand can find someone to assist them, whether they're looking
                for a helping hand or a friendly chat.
              </p>
              <br />
              <p className="text-xl">
                Our main goal is simple: to ensure that our users always have
                someone to rely on in moments of loneliness, someone to share
                fun times with, or just someone to have a chat with. Join us
                today and discover the perfect balance between assistance and
                companionship!
              </p>
            </div>
            <div className="w-1/2 flex justify-center ">
              <img src={blobimage.src} alt="" className="w-[700px]" />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-[100%] justify-center items-center ">
          <div>
            <h1 className="text-[30px] mt-16">
              What do our <a className="text-blue-500">users</a> think?
            </h1>
          </div>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <TestimonialCard
              image={blankprofile.src}
              role="Requester"
              name="John Doe"
              testimonial="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum mollitia illum consequuntur quisquam asperiores fuga et quasi repellat esse non, nostrum cumque ea veniam modi! Voluptas odit rem atque impedit."
            />


           
            
          </div>

        </div>
        <div className="flex flex-col mt-52">
          <div className="flex justify-center">
            <h1 className="text-[30px] ">
              What can <a className="text-blue-500">users</a> do?
            </h1>
          </div>

          <div className="flex flex-wrap justify-center gap-12 mt-12">
            <div className="flex flex-row w-[400px]">
              <div className="flex flex-col  justify-center rounded-xl">
                <h1 className="text-xl ">
                  Creating a <a className="text-blue-500 ">Request</a>
                </h1>
                <p className="text">
                  users will be allowed to create a request or tasks they need
                  with various categories
                </p>
              </div>
              <img src={post.src} alt="" className="" />
            </div>

            <div className="flex flex-row w-[400px]">
              <div className="flex flex-col  justify-center rounded-xl">
                <h1 className="text-xl ">
                  Choosing a <a className="text-red-500 ">Companion</a>
                </h1>
                <p className="text">
                  users who have created a request will be able to choose
                  companions freely
                </p>
              </div>
              <img src={choose.src} alt="" className="" />
            </div>

            <div className="flex flex-row w-[400px]">
              <div className="flex flex-col  justify-center rounded-xl">
                <h1 className="text-xl ">
                  Manage your<a className="text-blue-500 "> Profile</a>
                </h1>
                <p className="text">
                  users can freely manage their profile and edit it as they wish
                  anytime , anywhere
                </p>
              </div>
              <img src={profile.src} alt="" className="" />
            </div>

            <div className="flex flex-row w-[400px]">
              <div className="flex flex-col  justify-center rounded-xl">
                <h1 className="text-xl ">
                  Live<a className="text-red-500 "> Chat</a>
                </h1>
                <p className="text">
                  when a requester have chosen their companion, they will be
                  able to chat with one another
                </p>
              </div>
              <img src={chat.src} alt="" className="" />
            </div>

            <div className="flex flex-row w-[400px]">
              <div className="flex flex-col  justify-center rounded-xl">
                <h1 className="text-xl ">
                  Share <a className="text-blue-500 "> Location | directions</a>
                </h1>
                <p className="text">
                  users will be be allowed to share their current location and
                  get directions to their destination
                </p>
              </div>
              <img
                src={locationicon.src}
                alt=""
                className="w-[120px] h-[150px]"
              />
            </div>

            <div className="flex flex-row w-[400px]">
              <div className="flex flex-col  justify-center rounded-xl">
                <h1 className="text-xl ">
                  Seek for <a className="text-red-500 ">Opportunities</a>
                </h1>
                <p className="text">
                  Endless opportunities awaits you, learning something and
                  helping others at the same time
                </p>
              </div>
              <img src={look.src} alt="" className="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
