"use client"
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";

export const Navigation = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-gray-900">
              🚀 Rocket Money
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900">
              Testimonials
            </a>
            {status === "authenticated" ? (
              <div className="flex items-center space-x-4">
                <a
                  href="/profile"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Profile
                </a>
                <Button
                  onClick={() => signOut()}
                  className="bg-black text-white hover:bg-gray-800 rounded-full px-6 py-2"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => redirect("/login")}
                className="bg-black text-white hover:bg-gray-800 rounded-full px-6 py-2"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};