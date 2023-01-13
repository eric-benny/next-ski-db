import React, { useEffect, useState } from "react";
import { Button, Container, FormControl, Grid, TextField } from "@mui/material";
// import { Link as RouterLink } from 'react-router-dom';
import AddIcon from "@mui/icons-material/Add";
import { theme } from "../../legacy/Theme";
import { SkiTableCompare } from "../../components/SkiTable/SkiTableCompare";
import { api, RouterOutputs } from "../../utils/api";
import { useRouter } from "next/router";

type Skis = RouterOutputs['ski']['getAll'];

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

  const [filteredSkis, setFilteredSkis] = useState<Skis>([]);
  const [filter, setFilter] = useState<string>("");
  useEffect(() => {
    console.log("skis/filter updated");
    if (data.data && data.data.length > 0 && data.data) {
      const searchTerms = filter.split(" ");
      const newSkis = data.data.filter(
        (s) =>
          searchTerms.some(
            (t) => s.model.toLowerCase().indexOf(t.toLowerCase()) > -1
          ) ||
          searchTerms.some(
            (t) =>
              s.manufacturer.name.toLowerCase().indexOf(t.toLowerCase()) > -1
          )
      );
      console.log(newSkis);

      setFilteredSkis(newSkis);
    }
  }, [filter, data.data]);

  if (data.isError && data.error instanceof Error) {
    return <span>Error: {data.error.message}</span>;
  }

  return (
    <>
      <Container>
        <Grid
          container
          justifyContent="space-between"
          spacing={2}
          rowSpacing={2}
        >
          <Grid item xs={12}>
            <Grid container justifyContent="flex-end">
              <Grid item xs={2} md={1} marginRight={2}>
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
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <FormControl fullWidth>
              <TextField
                id="filter"
                label="Quick Filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                type="search"
              />
            </FormControl>
          </Grid>
          <SkiTableCompare
            skis={skis}
            filteredSkis={filteredSkis}
            skisLoading={data.isLoading}
          />
        </Grid>
      </Container>
    </>
  );
}
