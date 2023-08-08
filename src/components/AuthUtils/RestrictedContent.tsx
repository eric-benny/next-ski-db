import React from "react";
import { SignInButton } from "./SignInButton";

export function RestrictedContent({header}: {header: string}) {
  return (
    <div className="">
      <div className="flex justify-center">
        <h1>{header}</h1>
      </div>
      <div className="flex justify-center">
        <SignInButton />
      </div>
    </div>
  );
}
