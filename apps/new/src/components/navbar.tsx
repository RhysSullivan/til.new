"use client";
import { signIn, signOut, useSession } from "@/lib/auth-client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export function Navbar() {
  const session = useSession();
  console.log(session);
  return (
    <nav className="flex gap-4 w-full justify-end p-4">
      {session?.data?.user ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={session.data.user.image ?? ""} />
              <AvatarFallback>{session.data.user.name?.[0]}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Button
                variant="ghost"
                className="w-full text-left justify-start"
                size="sm"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="outline"
          onClick={() =>
            signIn.social({
              provider: "github",
              callbackURL: "/",
            })
          }
        >
          Sign In
        </Button>
      )}
    </nav>
  );
}
