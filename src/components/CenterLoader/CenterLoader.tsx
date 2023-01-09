import React from "react";
import { CircularProgress, Grid } from "@mui/material";
// import snowflake from "./snowflake.png";
// import Image from "next/image";

export function CenterLoader() {
  return (
    <Grid item xs={12} className="flex justify-center">
      <CircularProgress />
      {/* <div className="flex h-11 w-11 animate-pulse justify-center rounded-3xl bg-gray-300 ring-4 ring-red-400">
        <Image
          alt="loading"
          src={snowflake}
          className="h-9 w-9 animate-spin-slow self-center"
        />
      </div> */}
    </Grid>
  );
}
