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
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";

type Skis = RouterOutputs["ski"]["getAll"];
type Ski = Skis[0];
type SkiLength = Ski["lengths"][0];

interface SkiTableProps {
  skis: Skis;
  filteredSkis?: Skis;
  skisLoading: boolean;
  height?: string | number;
  selectedSkis?: Skis;
  setSelectedSkis?: any;
  selectionLimit?: number;
}

export const SkiTableNew = ({
  skis,
  filteredSkis,
  skisLoading,
  height,
  selectedSkis,
  setSelectedSkis,
  selectionLimit,
}: SkiTableProps) => {
  // MUI data grid
  let data: Skis = [];
  if (skis) {
    if (filteredSkis) {
      data = filteredSkis;
    } else {
      data = skis;
    }
  }

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columnHelper = createColumnHelper<Ski>();

  const columns = [
    columnHelper.accessor("model", {
      header: "Model",
      cell: (props) => (
        <Link
          href={`/skis/${props.row.id}`}
          className="text-red-500 no-underline hover:text-red-800  hover:underline"
        >
          {props.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor("manufacturer.name", { header: "Manufacturer" }),
    columnHelper.accessor("yearCurrent", { header: "Current Year" }),
    columnHelper.accessor("yearReleased", { header: "Released" }),
    columnHelper.accessor("lengths", {
      header: "Lengths",
      cell: (props) => {
        return `${props
          .getValue()
          ?.reduce((allLengths: string, length: SkiLength) => {
            return allLengths
              ? `${allLengths}, ${length.length.toString()}`
              : length.length.toString();
          }, "")}`;
      },
    }),
    columnHelper.accessor("specs", {
      header: "Tip",
      cell: (props) => {
        return `${props.getValue()[0]?.dimTip}`;
      },
    }),
    columnHelper.accessor("specs", {
      header: "Waist",
      cell: (props) => {
        return `${props.getValue()[0]?.dimWaist}`;
      },
    }),
    columnHelper.accessor("specs", {
      header: "Tail",
      cell: (props) => {
        return `${props.getValue()[0]?.dimTail}`;
      },
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // const [selectionModel, setSelectionModel] =
  //   React.useState<GridSelectionModel>([]);

  // console.log(selectedSkis);
  // console.log(selectionModel);

  // function selectedSkiChange(newSelectionModel: GridSelectionModel) {
  //   console.log("onselect");

  //   const compSkis = skis.filter((ski) => newSelectionModel.includes(ski.id));
  //   setSelectedSkis(compSkis);
  //   setSelectionModel(newSelectionModel);
  // }

  // useEffect(() => {
  //   console.log("selection changed");

  //   const newSelectionModel = selectedSkis ? selectedSkis.map((s) => s.id) : [];
  //   setSelectionModel(newSelectionModel);
  // }, [selectedSkis]);

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
              <div
                style={{ flexGrow: 1 }}
                className="mt-2 overflow-scroll rounded-md border-solid border-gray-400 border-opacity-40"
              >
                <table className="border-collapse">
                  <thead className="border-0 border-b border-solid border-gray-400">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header, index) => (
                          <th
                            key={header.id}
                            className={`
                              ${
                                headerGroup.headers.length - 1 === index
                                  ? "bg-gray-100 px-2"
                                  : "border-0 border-r border-solid border-gray-400 border-opacity-30 bg-gray-100 px-2"
                              }
                              ${
                                header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : ""
                              }
                              group py-2 text-sm
                            `}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {header.isPlaceholder ? null : (
                              <div className="pl-2 flex">
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {!header.column.getIsSorted() && (
                                  <div className="h-4 w-4">
                                    <ArrowUpIcon className="hidden h-4 w-4 align-middle text-black opacity-50 group-hover:inline" />
                                  </div>
                                )}
                                {{
                                  asc: (
                                    <div className="h-4 w-4">
                                      <ArrowUpIcon className="inline h-4 w-4 align-middle text-black" />
                                    </div>
                                  ),
                                  desc: (
                                    <div className="h-4 w-4">
                                      <ArrowDownIcon className="inline h-4 w-4 align-middle text-black" />
                                    </div>
                                  ),
                                }[header.column.getIsSorted() as string] ??
                                  null}
                              </div>
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="border-0 border-y border-solid border-gray-400 border-opacity-30 p-2 text-sm"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  {/* <tfoot>
                    {table.getFooterGroups().map((footerGroup) => (
                      <tr key={footerGroup.id}>
                        {footerGroup.headers.map((header) => (
                          <th key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.footer,
                                  header.getContext()
                                )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </tfoot> */}
                </table>
                {/* <DataGrid
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
                /> */}
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
