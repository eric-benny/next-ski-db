import React, { useEffect, useState } from "react";
import { Button, Container, FormControl, Grid, TextField } from "@mui/material";
// import { Link as RouterLink } from 'react-router-dom';
import AddIcon from "@mui/icons-material/Add";
import { theme } from "../../legacy/Theme";
import { SkiTableCompare } from "../../components/SkiTable/SkiTableCompare";
import { api, RouterOutputs } from "../../utils/api";
import { useRouter } from "next/router";
import { Navbar } from "~/components/navbar";
import { SignedIn } from "@clerk/nextjs";
import { ReviewerContent } from "~/components/AuthUtils/ReviewerContent";

type Skis = RouterOutputs["ski"]["getAll"];

export default function Skis() {
  const router = useRouter();

  const data = api.ski.getAll.useQuery();

  // const { isLoading, isError, data, error } = useSkisFull()

  const [skis, setSkis] = useState<Skis>([]);
  useEffect(() => {
    console.log("data updated");

    if (data.data && data.data.length > 0) {
      setSkis(data.data);
    }
  }, [data.data]);

  if (data.isError && data.error instanceof Error) {
    return <span>Error: {data.error.message}</span>;
  }

  return (
    <>
      <Navbar />
      <Container>
        <Grid
          container
          justifyContent="space-between"
          spacing={2}
          rowSpacing={2}
        >
          <ReviewerContent>
            <div className="flex w-full">
              <div className="ml-auto p-2">
                <Button
                  onClick={() => router.push("/skis/create")}
                  color="primary"
                  sx={{
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.main,
                      color: "white",
                    },
                  }}
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  Ski
                </Button>
              </div>
            </div>
          </ReviewerContent>
          <SkiTableCompare skis={skis} skisLoading={data.isLoading} />
        </Grid>
      </Container>
    </>
  );
}
