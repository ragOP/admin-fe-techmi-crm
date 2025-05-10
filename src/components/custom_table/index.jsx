// import { Card } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
// import Typography from "@/components/typography";

// /**
//  * CustomTable Component
//  * @param {Array} columns - Array of column headers
//  * @param {Array} data - Array of objects representing table rows
//  * @param {boolean} isLoading - Loading state
//  * @param {Error | null} error - Error state
//  * @param {Function} fetchData - Function to refetch data (optional)
//  */
// const CustomTable = ({ columns, data, isLoading, error }) => {
//   if (isLoading) {
//     return (
//       <Card className="p-4">
//         <Skeleton className="h-10 w-full mb-4" />
//         {[...Array(5)].map((_, i) => (
//           <Skeleton key={i} className="h-6 w-full mb-2" />
//         ))}
//       </Card>
//     );
//   }

//   if (error) {
//     return (
//       <Alert variant="destructive" className="mb-4">
//         <AlertTitle>Error</AlertTitle>
//         <AlertDescription>
//           Failed to load data. Please try again.
//         </AlertDescription>
//       </Alert>
//     );
//   }

//   if (!data || data.length === 0) {
//     return (
//       <Card className="p-4 text-center text-gray-500">
//         No records available.
//       </Card>
//     );
//   }

//   return (
//     <Card className="p-4">
//       <div className="">
//         <Table className="min-w-full">
//           <TableHeader>
//             <TableRow>
//               {columns.map((col, index) => (
//                 <TableHead
//                   key={`${col.key}_${index}`}
//                   className="whitespace-nowrap"
//                 >
//                   {col.label}
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {data.map((row, index) => (
//               <TableRow key={`${row.key}_${index}`}>
//                 {columns.map((col) => (
//                   <TableCell key={col.key} className="whitespace-nowrap">
//                     {col.render ? (
//                       col.render(row[col.key], row)
//                     ) : (
//                       <Typography>{row[col.key]}</Typography>
//                     )}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </Card>
//   );
// };

// export default CustomTable;

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Typography from "@/components/typography";
import { ArrowDown, ArrowUp } from "lucide-react";

function CustomTable({
  columns: rawColumns, // original input format: { label, key, render? }
  data,
  isLoading,
  error,
  emptyStateMessage = "No records available.",
}) {
  const [sorting, setSorting] = useState([]);

  // 🔁 Transform raw columns into TanStack format
  const columns = useMemo(() => {
    return rawColumns.map((col) => ({
      id: col.key,
      accessorKey: col.key,
      header: () => <Typography>{col.label}</Typography>,
      cell: (info) =>
        col.render ? (
          col.render(info.getValue(), info.row.original)
        ) : (
          <Typography>{info.getValue()}</Typography>
        ),
    }));
  }, [rawColumns]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return (
      <Card className="p-4">
        <Skeleton className="h-10 w-full mb-4" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-full mb-2" />
        ))}
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-4 text-center text-gray-500">{emptyStateMessage}</Card>
    );
  }

  return (
    <Card className="p-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer select-none"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getIsSorted() === "asc" && (
                    <ArrowUp size={14} />
                  )}
                  {header.column.getIsSorted() === "desc" && (
                    <ArrowDown size={14} />
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Typography>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </Typography>
        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </Card>
  );
}

export default CustomTable;
