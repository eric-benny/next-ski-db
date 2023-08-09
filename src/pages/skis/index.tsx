import React, { useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
// import { Link as RouterLink } from 'react-router-dom';
import AddIcon from "@mui/icons-material/Add";
import { theme } from "../../legacy/Theme";
import { SkiTableCompare } from "../../components/SkiTable/SkiTableCompare";
import { api, RouterOutputs } from "../../utils/api";
import { useRouter } from "next/router";
import { Navbar } from "~/components/navbar";
import { ReviewerContent } from "~/components/AuthUtils/ReviewerContent";
import { Button } from "@/components/ui/button";

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
                <Button onClick={() => router.push("/skis/create")}>
                  <AddIcon className="mr-2 h-4 w-4" /> SKI
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
