import { Container, Grid } from "@mui/material";
import {
  GridRowsProp,
  GridColDef,
  GridRenderCellParams,
  GridSelectionModel,
  DataGrid,
  GridRowParams,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { RouterOutputs } from "../../utils/api";

type Skis = RouterOutputs["ski"]["getAll"];
type Ski = Skis[0];
type SkiLength = Ski['lengths'][0];

interface SkiTableProps {
  skis: Skis;
  filteredSkis?: Skis;
  skisLoading: boolean;
  height?: string | number;
  selectedSkis?: Skis;
  setSelectedSkis?: any;
  selectionLimit?: number;
}

export const SkiTable = ({
  skis,
  filteredSkis,
  skisLoading,
  height,
  selectedSkis,
  setSelectedSkis,
  selectionLimit,
}: SkiTableProps) => {
  // MUI data grid
  let rows: GridRowsProp<Ski> = [];
  if (skis) {
    if (filteredSkis) {
      rows = filteredSkis;
    } else {
      rows = skis;
    }
  }

  const columns: GridColDef[] = [
    {
      field: "model",
      headerName: "Model",
      minWidth: 200,
      align: "left",
      renderCell: (params: GridRenderCellParams<string>) => (
        // <MuiLink color="secondary" underline="hover" variant="inherit" component={Link} href={`/skis/${params.row.id}`}>{params.value}</MuiLink>
        <Link
          href={`/skis/${params.row.id}`}
          className="text-red-500 no-underline hover:text-red-800  hover:underline"
        >
          {params.value}
        </Link>
      ),
    },
    {
      field: "manufacturer",
      headerName: "Manufacturer",
      align: "left",
      valueGetter: (params) => {
        return params.row.manufacturer.name;
      },
    },
    { field: "yearCurrent", headerName: "Current Year" },
    { field: "yearReleased", headerName: "Released" },
    {
      field: "availableLengths",
      headerName: "Lengths",
      minWidth: 150,
      align: "left",
      type: "string",
      valueGetter: (params) => {
        return `${params.row.lengths?.reduce(
          (allLengths: string, length: SkiLength) => {
            return allLengths
              ? `${allLengths}, ${length.length.toString()}`
              : length.length.toString();
          },
          ""
        )}`;
      },
    },
    {
      field: "tip",
      headerName: "Tip",
      align: "left",
      valueGetter: (params) => {
        return `${params.row.specs[0]?.dimTip}`;
      },
    },
    {
      field: "waist",
      headerName: "Waist",
      align: "left",
      valueGetter: (params) => {
        return `${params.row.specs[0]?.dimWaist}`;
      },
    },
    {
      field: "tail",
      headerName: "Tail",
      align: "left",
      valueGetter: (params) => {
        return `${params.row.specs[0]?.dimTail}`;
      },
    },
  ];

  const [selectionModel, setSelectionModel] =
    React.useState<GridSelectionModel>([]);

  console.log(selectedSkis);
  console.log(selectionModel);

  function selectedSkiChange(newSelectionModel: GridSelectionModel) {
    console.log("onselect");

    const compSkis = skis.filter((ski) => newSelectionModel.includes(ski.id));
    setSelectedSkis(compSkis);
    setSelectionModel(newSelectionModel);
  }

  useEffect(() => {
    console.log("selection changed");

    const newSelectionModel = selectedSkis ? selectedSkis.map((s) => s.id) : [];
    setSelectionModel(newSelectionModel);
  }, [selectedSkis]);

  const [tableHeight, setTableHeight] = useState("500px");

  useEffect(() => setTableHeight(`${window.innerHeight / 1.5}px`), []);

  // console.log(tableHeight);

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
            <div
              style={{ display: "flex", height: height ? height : tableHeight }}
            >
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  sx={{
                    "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
                      {
                        display: "none",
                      },
                  }}
                  getRowId={(row) => row.id}
                  rows={rows}
                  columns={columns}
                  checkboxSelection={selectedSkis ? true : false}
                  isRowSelectable={(params: GridRowParams<Ski>) =>
                    selectionModel.includes(params.row.id) ||
                    (selectionLimit && selectedSkis
                      ? selectedSkis.length < selectionLimit
                      : true)
                  }
                  onSelectionModelChange={(newSelectionModel) => {
                    selectedSkiChange(newSelectionModel);
                  }}
                  keepNonExistentRowsSelected
                  selectionModel={selectionModel}
                  loading={skisLoading}
                  disableSelectionOnClick
                  getRowHeight={() => "auto"}
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
