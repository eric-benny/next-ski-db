import React, { useEffect, useState } from "react";
import { Navbar } from "~/components/navbar";
import { useOrganizationList, useOrganization } from "@clerk/nextjs";

import { OrganizationSwitcher } from "@clerk/clerk-react";

export default function Admin() {
  const {
    organization: currentOrganization,
    membership,
    isLoaded,
  } = useOrganization();

  return (
    <>
      <Navbar />
      <div className="transition-all duration-75 ease-linear sm:px-4 xl:ml-16">
        <h1 className="text-center">Admin</h1>
        <div>
          <OrganizationSwitcher />
        </div>
        <div>
          <h2>Your organizations</h2>
          <p>
            {currentOrganization?.name}, {JSON.stringify(membership)}
          </p>
        </div>
      </div>
    </>
  );
}
