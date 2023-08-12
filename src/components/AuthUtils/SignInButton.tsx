import React from "react";
import { SignInButton as ClerkSignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function SignInButton() {
  return (
    <ClerkSignInButton>
      <Button >Sign in</Button>
    </ClerkSignInButton>
  );
}
