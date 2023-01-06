import React from "react";
import { CircularProgress, Grid } from "@mui/material";


export function CenterLoader() {
    return (
        <Grid item xs={12} justifyContent="center">
            <CircularProgress />
        </Grid>
    )
}