import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { User } from "./components/user";
import { redirect } from "next/navigation";
import Link from "next/link";
import { NavbarLanding } from "./components/navbar-landing";

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
    <div >
      <div className="">
      <NavbarLanding />
      </div>
      <div className="pl-24 pr-24">
        <div className="flex  h-screen justify-center items-center">
          <div className="pb-[200px] text-center">
            <h1 className="text-[30px]">
              JOIN THE <span className="text-blue-600">SERVE-EASE</span>{" "}
              COMMUNITY TODAY
            </h1>
            <h1 className="text-[30px]">
              {" "}
              AND START HELPING OR START GIVING OPPORTUNITIES
            </h1>
            <p className="text-[18.5px]">
              Become a <span className="text-red-500">Companion</span> to lend a
              helping hand or be a{" "}
              <span className="text-blue-500">Requester</span> to seek for help,
              sign up today.
            </p>
            <div className="flex flex-row gap-2  justify-center mt-5">
              <Link href={`/register`}>
                <button className="bg-blue-500 text-white font-bold text-[15px] rounded w-[300px] h-[45px] hover:bg-white hover:text-blue-500 hover:border-[2px] hover:border-blue-500 hover:ease-in-out duration-300">
                 Sign up free!
                </button>
              </Link>
              <p className="flex justify-center items-center gap-1">
                Already have an account?{" "}
                <a href="/login" className="text-blue-500 text-center">
                  {" "}
                  Sign In here{" "}
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-row border-2 w-[100%] ">
          <div className="w-1/2">

          </div>
          <div className="w-1/2">

          </div>
        </div>
      </div>
    </div>
  );
}
