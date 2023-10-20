"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserProps, NavBarProps } from "@/app/libs/interfaces";
import { usePathname } from "next/navigation";

export const Navbar = ({ mode, toggleMode }: NavBarProps) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProps | undefined>(undefined);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`/api/user/profile/${session?.user.email}`);
      const data = await response.json();
      setUser(data);
    };
    if (session?.user.email) getUser();
  }, [session?.user.email]);

  const isLinkActive =
    " text-rose-500 underline underline-offset-[5px] decoration-rose-500 decoration-2";

  return (
    <main className="pt-4">
      <div className="flex flex-row justify-between items-center">
        {/* <img src={logo.src} alt="Logo" width={60} className="m-2 " /> */}
        <h1>Serve-Ease</h1>
        <div className=" relative flex gap-5 mr-4 text-sm  items-center">
          <a
            href="/homepage"
            className={`relative group ${
              pathname === "/homepage" ? isLinkActive : ""
            }`}
          >
            Home
            <div className="absolute left-0 w-0 h-[2px] bg-rose-500 group-hover:w-full transition-transform transform origin-left transform scale-x-0 group-hover:scale-x-100"></div>
          </a>

          <a
            href="/post "
            className={`relative group ${
              pathname === "/post" ? isLinkActive : ""
            }`}
          >
            Post Request
            <div className="absolute left-0 w-0 h-[2px] bg-rose-500 group-hover:w-full transition-transform transform origin-left transform scale-x-0 group-hover:scale-x-100"></div>
          </a>
          <a
            href="/analytics "
            className={`relative group ${
              pathname === "/analytics" ? isLinkActive : ""
            }`}
          >
            Analytics
            <div className="absolute left-0 w-0 h-[2px] bg-rose-500 group-hover:w-full transition-transform transform origin-left transform scale-x-0 group-hover:scale-x-100"></div>
          </a>
          <a
            href="/dashboard"
            className={`relative group ${
              pathname === "/dashboard" ? isLinkActive : ""
            }`}
          >
            Dashboard
            <div className="absolute left-0 w-0 h-[2px] bg-rose-500 group-hover:w-full transition-transform transform origin-left transform scale-x-0 group-hover:scale-x-100"></div>
          </a>
          {user ? (
            <div className="relative inline-block">
              <img
                src={user.image}
                onClick={() => toggleDropdown()}
                alt="Selected File"
                className="w-[40px] h-[40px] object-cover rounded-full ring-1 ring-gray-300 dark:ring-gray-500"
              />

              <ul
                className={`absolute w-[200px] right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-md ${
                  isDropdownOpen ? "block" : "hidden"
                }`}
              >
                <li>
                  <a className="block px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-gray-800">
                    Signed in as <br />{" "}
                    <span className="font-bold">{user.name}</span>
                  </a>
                </li>

                <li>
                  <label
                    htmlFor="Toggle1"
                    className="inline-flex items-center space-x-4 cursor-pointer  block px-4 py-2"
                  >
                    <span>{mode ? "Requester" : "Companion"}</span>
                    <span className="relative">
                      <input
                        id="Toggle1"
                        type="checkbox"
                        className="hidden peer"
                        value={mode.toString()}
                        onChange={() => toggleMode(!mode)}
                      />
                      <div className="w-12 h-6 rounded-full shadow-inner dark:bg-black peer-checked:dark:bg-rose-500"></div>
                      <div className="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow peer-checked:right-0 peer-checked:left-auto dark:bg-white"></div>
                    </span>
                  </label>
                </li>

                <li>
                  <a
                    href="/dashboard"
                    className="block px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-gray-800"
                  >
                    Go to Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/edit-profile"
                    className="block px-4 py-2 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Edit Profile
                  </a>
                </li>
                <li>
                  <a
                    className="block px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-red-500"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </a>
                </li>
              </ul>
            </div>
          ) : (
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-400 fill-rose-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
