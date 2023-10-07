import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { User } from "./components/user";
import { redirect } from "next/navigation";
import Link from "next/link";

// interface SessionUser extends DefaultSession {
// 	user: {
// 		name?: string ;
// 		email?: string ;
// 		image?: string ;
// 		isNewUser?: string;
// 	  };
// 	  expires: string;
// }

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    if (session?.user?.isNewUser === true) {
      redirect("/create-profile");
    }
  }

  return (
    <section>
      <h1>Home</h1>
      <h1>Server Side Rendered</h1>
      <pre>{JSON.stringify(session)}</pre>
      <h1>Client Side Rendered</h1>
      <User />
      <div>
        <Link href="/login">
          <button className="text-gray-900 underline hover:text-gray-900/70">
            Go to login
          </button>
        </Link>
      </div>
	  <div>
        <Link href={`/profile`}>
          <button className="text-gray-900 underline hover:text-gray-900/70">
            Go to profile
          </button>
        </Link>
      </div>
    </section>
  );
}
