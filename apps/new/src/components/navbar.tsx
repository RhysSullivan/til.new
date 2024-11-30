"use client";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export function Navbar() {
  const session = useSession();
  console.log(session);
  return (
    <nav className="flex gap-4 w-full justify-end p-4">
      {session?.data?.user ? (
        <img
          src={session.data.user.image ?? ""}
          alt={session.data.user.name ?? ""}
          className="w-8 h-8 rounded-full"
        />
      ) : (
        <Link href="/sign-in">Sign In</Link>
      )}
    </nav>
  );
}
