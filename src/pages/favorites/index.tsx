import React, { useEffect, useState } from "react";
import { SkiTableCompare } from "../../components/SkiTable/SkiTableCompare";
import { api } from "../../utils/api";

export default function Favorites() {
  const data = api.user.getFavorites.useQuery();
  const skis = data?.data;
  console.log(skis);
  
  const [height, setHeight] = useState(window.innerHeight / 1.5);

  useEffect(() => {
    const updateWindowDimensions = () => {
      const newHeight = window.innerHeight / 1.5;
      setHeight(newHeight);
    };
    window.addEventListener("resize", updateWindowDimensions);
    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  if (data.isError && data.error instanceof Error) {
    return <span>Error: {data.error.message}</span>;
  }

  return (
    <>
      <div className="sm:px-4 transition-all duration-75 ease-linear xl:ml-16">
        <h1 className="my-0 w-full text-center">Favorites</h1>
        <SkiTableCompare
          skis={skis || []}
          skisLoading={data.isLoading}
          height={height}
        />
      </div>
    </>
  );
}
