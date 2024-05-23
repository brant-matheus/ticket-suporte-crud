"use client";
import { useState, useCallback, useEffect } from "react";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  VisibilityState,
  getSortedRowModel,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authInstance } from "@/app/axios-config";
import { DataTablePagination } from "./data-table-pagination";
import { Button } from "../ui/button";
import { ColumnVisiablity } from "./column-visibility";
import CreateUserButton from "../../app/admin/users-managment/create-users-button";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  route: string;
  filterColumn: string;
  showFilter: boolean;
  component: any;
  fromTable: string;
}
export type MetaProps = {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl?: string;
  previousPageUrl?: null;
};

export function DataTable<TData, TValue>({
  columns,
  fromTable,
  route,
  showFilter,
  filterColumn,
  component,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [data, setData] = useState<{ meta?: MetaProps; data: any[] }>({
    meta: undefined,
    data: [],
  });
  const getData = useCallback(async () => {
    try {
      const { data, request, status } = await authInstance.get(`${route}`, {
        params: {
          page: pagination.pageIndex + 1, //first page {front: 0, back: 1}
          pageSize: pagination.pageSize,
          fromTable: fromTable,
        },
      });
      if ((request.status ?? status) === 200) {
        setData(data);
      }
    } catch (error) {}
  }, [pagination]);
  useEffect(() => {
    getData();
  }, [pagination, getData]);
  const table = useReactTable({
    // data is our object with meta and the actual data.
    data: data.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,

    // user manual paginate on click
    manualPagination: true,
    onPaginationChange: setPagination,
    // since the user will manual paginate the table, we gotta have to use the meta total for total quantity of rows.
    rowCount: data.meta?.total,

    state: {
      sorting,
      columnFilters,
      pagination,
      columnVisibility,
    },
  });

  return (
    <div>
      {/* render condition show/not show filter */}
      {showFilter ? (
        <div className="flex items-center py-2 space-x-4">
          <Input
            placeholder="Filter emails..."
            value={
              (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(filterColumn)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <ColumnVisiablity table={table} />
          {/* component */}
          {component}
        </div>
      ) : (
        <div className="flex items-center py-4 ">
          <ColumnVisiablity table={table} />
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {/* loading and filter not found */}
                  Sem resultados...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* data-table-pagination call */}
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
