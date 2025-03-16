import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Typography from "@/components/typography";

/**
 * CustomTable Component
 * @param {Array} columns - Array of column headers
 * @param {Array} data - Array of objects representing table rows
 * @param {boolean} isLoading - Loading state
 * @param {Error | null} error - Error state
 * @param {Function} fetchData - Function to refetch data (optional)
 */
const CustomTable = ({ columns, data, isLoading, error }) => {
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
      <Card className="p-4 text-center text-gray-500">
        No records available.
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {columns.map((col, index) => (
                <TableHead
                  key={`${col.key}_${index}`}
                  className="whitespace-nowrap"
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={`${row.key}_${index}`}>
                {columns.map((col) => (
                  <TableCell key={col.key} className="whitespace-nowrap">
                    {col.render ? (
                      col.render(row[col.key], row)
                    ) : (
                      <Typography>{row[col.key]}</Typography>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default CustomTable;
