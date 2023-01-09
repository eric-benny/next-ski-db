import React, { useState } from "react";
import { Button, Chip, Container, Grid } from "@mui/material";
import { SkiData, useSkisFull } from "../../legacy/Services/Skis";
// import { Link as RouterLink } from 'react-router-dom';
import AddIcon from "@mui/icons-material/Add";
import { theme } from "../../legacy/Theme";
import { SkiTable } from ".";
import { ComparisonModal } from "../ComparisonModal";
import { GridRowId } from "@mui/x-data-grid";

import {
  GuideSki,
  Manufacturer,
  Ski,
  SkiFamily,
  SkiSpec,
  SkiLength,
} from "@prisma/client";

// type Skis = RouterOutput['ski']['getAll'];

type Skis = (Ski & {
  manufacturer: Manufacturer;
  family: SkiFamily | null;
  guideInfo: GuideSki[];
  specs: SkiSpec[];
  lengths: SkiLength[];
})[];

interface SkiTableProps {
  skis: Skis;
  skisLoading: boolean;
  height?: string | number;
}

export const SkiTableCompare = ({
  skis,
  skisLoading,
  height,
}: SkiTableProps) => {
  // const { isLoading, isError, data, error } = useSkisFull()

  const [compareSkis, setCompareSkis] = useState<Skis>([]);

  function removeCompareSki(idToRemove: string) {
    const newCompareSkis = compareSkis.filter(
      (ski: Ski) => ski.id !== idToRemove
    );
    setCompareSkis(newCompareSkis);
  }

  const [compModalOpen, setCompModalOpen] = useState<boolean>(false);
  const onCompModalClose = () => {
    setCompModalOpen(false);
  };

  // if (isError && error instanceof Error) {
  //     return <span>Error: {error.message}</span>
  // }

  return (
    <>
      <Grid item xs={12}>
        <Grid item xs={12} marginBottom={2}>
          <Grid container alignItems="flex-end">
            <Grid item xs={9} md={11}>
              <Grid
                container
                spacing={0}
                sx={{
                  [theme.breakpoints.up("sm")]: {
                    display: "none",
                  },
                }}
              >
                {compareSkis.map((ski) => (
                  <Grid item xs={6} sm={3} key={ski.id}>
                    <Chip
                      label={ski.model}
                      sx={{
                        color: "white",
                        backgroundColor: theme.palette.secondary.light,
                      }}
                      onDelete={() => removeCompareSki(ski.id)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <SkiTable
          skis={skis}
          skisLoading={skisLoading}
          selectedSkis={compareSkis}
          setSelectedSkis={setCompareSkis}
          selectionLimit={4}
        />
        <Grid item xs={12} marginTop={2}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Button
                color="primary"
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.main,
                  },
                }}
                onClick={() => setCompModalOpen(true)}
                variant="contained"
                disabled={compareSkis.length > 0 ? false : true}
              >
                Compare
              </Button>
            </Grid>
            <Grid
              item
              xs
              sx={{
                [theme.breakpoints.down("sm")]: {
                  display: "none",
                },
              }}
            >
              <Grid container spacing={2}>
                {compareSkis.map((ski) => (
                  <Grid item xs={12} sm={3} key={ski.id}>
                    <Chip
                      label={ski.model}
                      sx={{
                        color: "white",
                        backgroundColor: theme.palette.secondary.light,
                      }}
                      onDelete={() => removeCompareSki(ski.id)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ComparisonModal
        skis={compareSkis}
        open={compModalOpen}
        onClose={onCompModalClose}
      />
    </>
  );
};
