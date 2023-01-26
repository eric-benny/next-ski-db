import React, { useEffect, useState } from "react";
import { Button, Container, FormControl, Grid, TextField } from "@mui/material";
// import { Link as RouterLink } from 'react-router-dom';
import AddIcon from "@mui/icons-material/Add";
import { theme } from "../../legacy/Theme";
import { SkiTableCompare } from "../../components/SkiTable/SkiTableCompare";
import { api, RouterOutputs } from "../../utils/api";
import { useRouter } from "next/router";
import { SkiTableNew } from "../../components/SkiTable";

type Skis = RouterOutputs["ski"]["getAll"];
type Ski = Skis[0];

export default function Favorites() {
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

  const [selectedSkis, setSelectedSkis] = useState<Array<Ski & {index: string}>>([]);

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
          {/* <Grid item xs={12} sm={6} lg={3}>
            <FormControl fullWidth>
              <TextField
                id="filter"
                label="Quick Filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                type="search"
              />
            </FormControl>
          </Grid> */}
          <SkiTableNew
            skis={skis || []}
            // filteredSkis={filteredSkis}
            skisLoading={data.isLoading}
            selectedSkis={selectedSkis}
            setSelectedSkis={setSelectedSkis}
            height={window.innerHeight / 1.75}
          />
        </Grid>
        <ul>
          {selectedSkis.map(s => <li key={s.id}>{s.model}</li>)}
        </ul>
      </Container>
    </>
  );
}
