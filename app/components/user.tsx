'use client'

import { useSession, signOut } from "next-auth/react";

export const User = () => {
	const { data: session } = useSession()

  return (
	<>
	<div>{JSON.stringify(session)}
	</div>
	<button onClick={() => signOut()}>Sign out</button>
	</>
	
  )
}

