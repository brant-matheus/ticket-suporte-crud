// "use client";
// import { useCallback, useEffect, useState } from "react";
// import CreateUserButton from "../buttons/create-user-button";
// import {
//   ColumnDef,
//   SortingState,
//   ColumnFiltersState,
//   getFilteredRowModel,
//   getSortedRowModel,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
//   PaginationState,
// } from "@tanstack/react-table";
// import { Input } from "@/components/ui/input";
// import { authInstance } from "@/app/axios-config";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { DataTablePagination } from "./data-table-paginatio";

// // TData = row, TValue = item in TData

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   filterColumn: string;
//   route: string;
// }

// export type MetaReturnProps = {
//   total: number;
//   perPage: number;
//   currentPage: number;
//   lastPage: number;
//   firstPage: number;
//   firstPageUrl: string;
//   lastPageUrl: string;
//   nextPageUrl?: string;
//   previousPageUrl?: string;
// };
// export function DataTable<TData, TValue>({
//   route,
//   filterColumn,
//   columns,
// }: DataTableProps<TData, TValue>) {
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 1,
//     pageSize: 10,
//   });
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [data, setData] = useState<{ meta?: MetaReturnProps; data: any[] }>({
//     meta: undefined,
//     data: [],
//   });

//   const getData = useCallback(async () => {
//     try {
//       const { data, status, request } = await authInstance.get(`${route}`);
//       if ((status ?? request.status) === 200) {
//         setData(data);
//       }
//     } catch (error) {}
//   }, [pagination]);

//   useEffect(() => {
//     console.log(sorting, pagination);
//     getData();
//   }, [getData, sorting, pagination]);

//   const table = useReactTable({
//     data: data.data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     onSortingChange: setSorting,
//     getSortedRowModel: getSortedRowModel(),
//     onColumnFiltersChange: setColumnFilters,
//     getFilteredRowModel: getFilteredRowModel(),
//     onPaginationChange: setPagination,
//     rowCount: data?.meta?.total ?? 0,
//     manualPagination: true,
//     state: {
//       sorting,
//       columnFilters,
//       pagination,
//     },
//   });

//   return (
//     <div>
//       <div className="flex items-center py-4 ">
//         <Input
//           placeholder="Procurar emails..."
//           value={
//             (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""
//           }
//           onChange={(event) =>
//             table.getColumn(filterColumn)?.setFilterValue(event.target.value)
//           }
//           className="max-w-sm"
//         />
//       </div>

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//         <DataTablePagination table={table} />
//       </div>
//     </div>
//   );
// }
