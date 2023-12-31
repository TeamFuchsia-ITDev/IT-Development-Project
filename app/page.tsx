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
import LandingSVG from "@/app/images/LandingSVG.svg";
import { FooterLanding } from "./components/footerLanding";
import { motion } from "framer-motion";

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
      <div className="pl-12 pr-12">
        <div className="w-full flex flex-row justify-center md:text-left">
          <div className=" sm:w-full md:w-full lg:w-[60%] flex flex-col justify-start md:justify-start lg:justify-center xl:justify-center mt-12 md:mt-24 lg:mt-0 xl:mt-0">
         <p className="text-[20px] text-center md:text-center lg:text-left xl:text-left font-bold">Welcome to <span className="text-blue-500">Serve-Ease</span></p>
            <h1 className="text-[25px] lg:text-[35px] sm:text-black md:text-black text-center md:text-center lg:text-left xl:text-left">
              JOIN OUR COMMUNITY{" "}
               TODAY
            </h1>
            <img
              src={LandingSVG.src}
              alt="Serve-Ease"
              className="w-full  mb-2 object-cover block md:block lg:hidden xl:hidden"
            />
            <p className="text-[15px] lg:text-[16px]  text-center md:text-left">
              Discover the power of community at SERVE-EASE. Whether you're a
              <span className="text-red-500"> Companion</span> offering help or
              a<span className="text-blue-500"> Requester</span> seeking
              assistance, sign up today to make meaningful connections.
            </p>
            <div className="flex flex-row gap-2 mt-5 justify-center items-center md:items-center md:justify-center lg:justify-start lg:items-left">
              <Link href={`/register`}>
                <button
                  className="bg-blue-500 text-white font-bold text-[15px] rounded w-[300px] h-[45px] hover:bg-white hover:text-blue-500 hover:border-[3px] hover:border-blue-500 hover:ease-in-out duration-500"
                  style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                >
                  Sign up free!
                </button>
              </Link>
              
           
            </div>
          </div>
          <div className="w-[0%] md:w-[0%] lg:w-[50%] xl:w-[50%] flex justify-center">
            <img src={LandingSVG.src} alt="" className="hidden md:hidden lg:block xl:block" />
            </div>
        </div>

        <div className=" w-full h-screen flex flex-row justify-center  md:text-left ">
          <div className="sm:w-[0%] md:w-[0%] lg:w-[50%] xl:w-[50%] flex justify-center items-center">
            <img
              src={blobimage.src}
              alt=""
              className="w-[600px] object-cover hidden md:hidden lg:block xl:block"
            />
          </div>
          <div className="sm:w-full md:w-full lg:w-[50%] flex flex-col justify-center mt-[470px] md:mt-[200px] lg:mt-0 lg:mt-0 ">
            <h1 className="text-[30px] lg:text-[35px] text-center md:text-center lg:text-left xl:text-left ">
              Why <span className="text-blue-500">use</span> our App?
            </h1>
            <p className="text-[18px] lg:text-[18.5px]  text-left md:text-left mt-4">
              Welcome to our platform, where we've crafted a unique space for
              connecting people who need a helping hand with tasks they can't
              tackle on their own. But that's not all – it's also a place for
              those times when you're feeling a bit lonely and just want some
              friendly company.
            </p>
            <br />
            <p className="text-[18px] lg:text-[18.5px]  text-left md:text-left">
              What sets us apart is the flexibility we offer.{" "}
              <span className="text-red-500">Companions</span> have the choice
              to provide their services either for free, as a gesture of
              kindness, or they can charge for their expertise.{" "}
              <span className="text-blue-500">Requesters</span> on the other
              hand can find someone to assist them, whether they're looking for
              a helping hand or a friendly chat.
            </p>
            <br />
            <p className="text-[18px] lg:text-[18.5px]  text-left md:text-left">
              Our main goal is simple: to ensure that our users always have
              someone to rely on in moments of loneliness, someone to share fun
              times with, or just someone to have a chat with. Join us today and
              discover the perfect balance between assistance and companionship!
            </p>
          </div>
        </div>

        <div className="flex flex-col w-[100%] justify-center items-center ">
          <div>
            <h1 className="text-[30px] lg:text-[35px] text-center mt-[550px] md:mt-[550px] lg:mt-24 lg:mt-0">
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
        <div className="flex flex-col mt-[220px]">
          <div className="flex justify-center">
            <h1 className="text-[30px] lg:text-[35px] text-center ">
              What can our<a className="text-blue-500"> users</a> do?
            </h1>
          </div>

          <div className="flex flex-wrap justify-center gap-12 mt-12 mb-24">
            <div className="flex flex-row w-[400px]">
              <div className="flex flex-col  justify-center rounded-xl">
              <img src={post.src} alt="" className="w-[70px] h-[70px] md:w-[70px] md:h-[70px] lg:hidden md:hidden" />
                <h1 className="text-xl ">
                  Creating a <a className="text-blue-500 ">Request</a>
                </h1>
                <p className="text">
                  users will be allowed to create a request or tasks they need
                  with various categories
                </p>
              </div>
              <img src={post.src} alt="" className="hidden md:block md:w-24 lg:block lg:w-24" />
            </div>

            <div className="flex flex-row w-[400px]">
              <div className="flex flex-col  justify-center rounded-xl">
              <img src={choose.src} alt="" className="w-[70px] h-[70px] md:w-[70px] md:h-[70px] lg:hidden md:hidden" />
                <h1 className="text-xl ">
                  Choosing a <a className="text-red-500 ">Companion</a>
                </h1>
                <p className="text">
                  users who have created a request will be able to choose
                  companions freely
                </p>
              </div>
              <img src={choose.src} alt="" className="hidden md:block md:w-24 lg:block lg:w-24" />
            </div>

            <div className="flex flex-row w-[400px]">
              <div className="flex flex-col  justify-center rounded-xl">
              <img src={profile.src} alt="" className="w-[70px] h-[70px] md:w-[70px] md:h-[70px] lg:hidden md:hidden" />
                <h1 className="text-xl ">
                  Manage your<a className="text-blue-500 "> Profile</a>
                </h1>
                <p className="text">
                  users can freely manage their profile and edit it as they wish
                  anytime , anywhere
                </p>
              </div>
              <img src={profile.src} alt="" className="hidden md:block md:w-24 lg:block lg:w-24" />
            </div>

            <div className="flex flex-row w-[400px]">
              <div className="flex flex-col  justify-center rounded-xl">
              <img src={chat.src} alt="" className="w-[70px] h-[70px] md:w-[70px] md:h-[70px] lg:hidden md:hidden" />
                <h1 className="text-xl ">
                  Live<a className="text-red-500 "> Chat</a>
                </h1>
                <p className="text">
                  when a requester have chosen their companion, they will be
                  able to chat with one another
                </p>
              </div>
              <img src={chat.src} alt="" className="hidden md:block md:w-24 lg:block lg:w-24"/>
            </div>

            <div className="flex flex-row w-[400px]">
              <div className="flex flex-col  justify-center rounded-xl">
              <img src={locationicon.src} alt="" className="w-[70px] h-[70px] md:w-[70px] md:h-[70px] lg:hidden md:hidden" />
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
                className="hidden md:block md:w-24 lg:block lg:w-24"
              />
            </div>

            <div className="flex flex-row w-[400px]">
              <div className="flex flex-col justify-center rounded-xl">
                <img src={look.src} alt="" className="w-[70px] h-[70px] md:w-[70px] md:h-[70px] lg:hidden md:hidden" />
                <h1 className="text-xl ">
                  Seek for <a className="text-red-500 ">Opportunities</a>
                </h1>
                <p className="text">
                  Endless opportunities awaits you, learning something and
                  helping others at the same time
                </p>
              </div>
              <img src={look.src} alt="" className="hidden md:block md:w-24 lg:block lg:w-24" />
            </div>
          </div>
        </div>   
        <FooterLanding />
      </div>
    </div>
  );
}


