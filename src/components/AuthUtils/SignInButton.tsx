import React from "react";
import { SignInButton as ClerkSignInButton } from "@clerk/nextjs";

export function SignInButton() {
  return (
    <ClerkSignInButton>
      <button className="h-10 items-center justify-center rounded-md border-0 bg-gray-500 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-gray-400 transition-colors hover:cursor-pointer  hover:bg-red-600 hover:text-white hover:shadow-md">
        Sign in
      </button>
    </ClerkSignInButton>
  );
}
