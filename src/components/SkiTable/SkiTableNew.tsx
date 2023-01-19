import React, { useEffect, useState } from "react";
import Link from "next/link";
import { RouterOutputs } from "../../utils/api";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";

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
          href={`/skis/${props.row.original.id}`}
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
    // {
    //   id: "tip",
    //   header: "Tip",
    //   accessorFn: row => row.specs[0]?.dimTip
    // },
    columnHelper.accessor(
      (row) => row.specs[0]?.dimTipMeas || row.specs[0]?.dimTip,
      {
        header: "Tip",
      }
    ),
    columnHelper.accessor(
      (row) => row.specs[0]?.dimWaistMeas || row.specs[0]?.dimWaist,
      {
        header: "Waist",
      }
    ),
    columnHelper.accessor(
      (row) => row.specs[0]?.dimTailMeas || row.specs[0]?.dimTail,
      {
        header: "Tail",
      }
    ),
  ];

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 20,
      },
    },
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
      <div
        style={{
          height: height ? height : tableHeight,
          minHeight: "350px",
        }}
        className="m-2 flex w-full"
      >
        <div className="flex w-full flex-col flex-wrap rounded-md border-solid border-gray-400 border-opacity-40">
          <div className="h-5/6 w-full flex-auto overflow-scroll">
            <table className="w-full border-collapse">
              <thead className="border-0 border-b border-solid border-gray-400 ">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="sticky top-0">
                    {headerGroup.headers.map((header, index) => (
                      <th
                        key={header.id}
                        className={`
                              ${
                                header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : ""
                              }
                              group bg-gray-100 py-2 px-2 text-sm
                            `}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex">
                          <div className="text-gray-400 font-extrabold">|</div>
                          {header.isPlaceholder ? null : (
                            <div className="flex pl-2">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {!header.column.getIsSorted() && (
                                <div className="h-4 w-4 pl-1">
                                  <ArrowUpIcon className="hidden h-4 w-4 align-middle text-gray-500 opacity-60 group-hover:inline" />
                                </div>
                              )}
                              {{
                                asc: (
                                  <div className="h-4 w-4 pl-1">
                                    <ArrowUpIcon className="inline h-4 w-4 align-middle text-black" />
                                  </div>
                                ),
                                desc: (
                                  <div className="h-4 w-4 pl-1">
                                    <ArrowDownIcon className="inline h-4 w-4 align-middle text-black" />
                                  </div>
                                ),
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          )}
                        </div>
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
            </table>
          </div>
          <div className="flex items-center gap-2 border-0 border-t-2 border-solid border-gray-400 border-opacity-50 p-3">
            <button
              className="cursor-pointer rounded border-0 p-1 hover:bg-gray-300 disabled:cursor-default disabled:bg-gray-50"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronDoubleLeftIcon className="h-5 w-5 align-middle" />
            </button>
            <button
              className="cursor-pointer rounded border-0 p-1 hover:bg-gray-300 disabled:cursor-default disabled:bg-gray-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-5 w-5 align-middle" />
            </button>
            <button
              className="cursor-pointer rounded border-0 p-1 hover:bg-gray-300 disabled:cursor-default disabled:bg-gray-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-5 w-5 align-middle" />
            </button>
            <button
              className="cursor-pointer rounded border-0 p-1 hover:bg-gray-300 disabled:cursor-default disabled:bg-gray-50"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronDoubleRightIcon className="h-5 w-5 align-middle" />
            </button>

            {/* <span className="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="w-16 rounded border p-1"
              />
            </span> */}
            <select
              className="rounded-md border p-1 text-sm hover:cursor-pointer hover:bg-gray-100"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize} selected>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <span className="ml-auto flex items-center gap-1">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}{" "}
              {"- "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                data.length
              )}{" "}
              of {data.length}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
