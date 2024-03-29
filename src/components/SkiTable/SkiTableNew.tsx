import React, { HTMLProps, useEffect, useState } from "react";
import Link from "next/link";
import { RouterOutputs } from "../../utils/api";
import {
  ColumnDef,
  createColumnHelper,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
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

import { RankingInfo } from "@tanstack/match-sorter-utils";
import { CenterLoader } from "../CenterLoader";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<Ski> = (row, columnId, value: string) => {
  // Rank the item
  // const itemRank = rankItem(row.getValue(columnId), value);

  // // Store the itemRank info
  // addMeta({
  //   itemRank,
  // });

  // Return if the item should be filtered in/out
  // return itemRank.passed;

  const searchTerms = value.split(" ");

  return (
    searchTerms.some(
      (t) => row.original.model.toLowerCase().indexOf(t.toLowerCase()) > -1
    ) ||
    searchTerms.some(
      (t) =>
        row.original.manufacturer.name.toLowerCase().indexOf(t.toLowerCase()) >
        -1
    )
  );
};

type Skis = RouterOutputs["ski"]["getAll"];
type Ski = Omit<Skis[0], "notes">;
type SkiLength = Ski["lengths"][0];

interface SkiTableProps {
  skis: Ski[];
  skisLoading: boolean;
  height?: string | number;
  selectedSkis?: Array<Ski & { index: string }>;
  setSelectedSkis?: React.Dispatch<
    React.SetStateAction<Array<Ski & { index: string }>>
  >;
  selectionLimit?: number;
}

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={
        className +
        " h-4 w-4 cursor-pointer accent-red-600 disabled:cursor-default"
      }
      {...rest}
    />
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      type="search"
    />
  );
}

export const SkiTableNew = ({
  skis,
  skisLoading,
  height,
  selectedSkis,
  setSelectedSkis,
  selectionLimit,
}: SkiTableProps) => {
  let data: Ski[] = [];
  if (skis) {
    data = skis;
  }

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columnHelper = createColumnHelper<Ski>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = React.useMemo<ColumnDef<Ski>[] | any[]>(
    () => [
      {
        id: "select",
        header: () => (
          <button
            className="rounded-md border-0 bg-gray-500  px-2 text-white shadow-md hover:cursor-pointer hover:ring-1 hover:ring-red-600 disabled:cursor-default disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:ring-0 "
            disabled={!Object.keys(rowSelection).length}
            onClick={() => {
              setRowSelection({});
              setSelectedSkis?.([]);
            }}
          >
            clear
          </button>
        ),
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-center px-1">
            <IndeterminateCheckbox
              {...{
                disabled:
                  selectionLimit && selectedSkis && !row.getIsSelected()
                    ? selectedSkis.length >= selectionLimit
                    : false,
                checked: row.getIsSelected(),
                indeterminate: row.getIsSomeSelected(),
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.checked) {
                    const newSelected = selectedSkis
                      ? [...selectedSkis, { ...row.original, index: row.id }]
                      : [{ ...row.original, index: row.id }];
                    setSelectedSkis?.(newSelected);
                  } else {
                    const newSelected = selectedSkis?.filter(
                      (ski) => ski.id !== row.original.id
                    );
                    setSelectedSkis?.(newSelected ? newSelected : []);
                  }
                  const func = row.getToggleSelectedHandler();
                  func(e);
                },
              }}
            />
          </div>
        ),
      },
      columnHelper.accessor("model", {
        header: "Model",
        filterFn: "fuzzy",
        enableGlobalFilter: true,
        cell: (props) => (
          <Link
            href={`/skis/${props.row.original.id}`}
            className="text-primary no-underline hover:text-red-800  hover:underline"
          >
            {props.getValue()}
          </Link>
        ),
      }),
      columnHelper.accessor("manufacturer.name", {
        header: "Manufacturer",
        filterFn: "fuzzy",
        enableGlobalFilter: true,
      }),
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
    ],
    [columnHelper, rowSelection, selectedSkis, selectionLimit, setSelectedSkis]
  );

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 20,
      },
    },
    state: {
      sorting,
      rowSelection,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    const newSelectionModel: RowSelectionState = {};
    if (selectedSkis) {
      for (const ski of selectedSkis) {
        newSelectionModel[parseInt(ski.index)] = true;
      }
    }
    setRowSelection(newSelectionModel);
  }, [selectedSkis]);

  const [tableHeight, setTableHeight] = useState("500px");

  useEffect(() => setTableHeight(`${window.innerHeight / 1.5}px`), []);

  return (
    <>
      <div className="flex min-w-0 flex-wrap">
        <div className="mx-2 mb-2">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="font-lg border-block rounded-md border border-black p-2 shadow focus:border-red-500 focus:outline-none focus-visible:rounded-md"
            placeholder="Quick Search..."
          />
        </div>
        <div
          style={{
            height: height ? height : tableHeight,
            minHeight: "350px",
          }}
          className="m-2 flex w-full overflow-x-scroll"
        >
          <div className="flex w-full flex-col flex-wrap rounded-md border-2 border-solid border-border border-opacity-40">
            <div className="h-5/6 w-full flex-auto overflow-scroll rounded-sm">
              <table className="w-full border-collapse">
                <thead className="">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="sticky top-0">
                      {headerGroup.headers.map((header) => (
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
                            <div className="font-extrabold text-gray-400">
                              |
                            </div>
                            {header.isPlaceholder ? null : (
                              <div className="flex pl-2">
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {header.column.getCanSort() &&
                                  !header.column.getIsSorted() && (
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
                                }[header.column.getIsSorted() as string] ??
                                  null}
                              </div>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {skisLoading ? (
                    <tr>
                      <td>
                        <div className="m-10">
                          <CenterLoader />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {table.getRowModel().rows.map((row) => (
                        <tr key={row.original.id}>
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
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center gap-2 border-0 border-t-2 border-solid border-gray-400 border-opacity-50 p-3">
              <button
                className=" hidden cursor-pointer rounded border-0 p-1 hover:bg-gray-300 disabled:cursor-default disabled:bg-gray-50 sm:inline-block"
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
                className=" hidden cursor-pointer rounded border-0 p-1 hover:bg-gray-300 disabled:cursor-default disabled:bg-gray-50 sm:inline-block"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronDoubleRightIcon className="h-5 w-5 align-middle" />
              </button>
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
      </div>
    </>
  );
};
