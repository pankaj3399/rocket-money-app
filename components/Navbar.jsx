import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();


  return (
    <nav className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="text-xl font-bold text-foreground"
            >
              Rocket Money
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Profile
              </Link>
              <Link
                href="/budget"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Budget
              </Link>
              <Link
                href="/calculations"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Calculations
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {session?.user?.name}
            </span>
            <Button
              variant="ghost"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
