import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ColumnDefinition {
  name: string;
  type: string;
  _id: string;
}
interface DataTableProps {
  tableInfo: Record<string, string | number | boolean>[]; // Changed from string[][]
  tableData: ColumnDefinition[];
}

export function DataTable({ tableInfo, tableData }: DataTableProps) {
  if (!tableInfo || tableInfo.length === 0) {
    return <TableCaption>No data available.</TableCaption>;
  }

  // Get headers from the keys of the first object
  const originalHeaders = Object.keys(tableInfo[0]);
  const newHeaders = tableData.map((col) => col.name);
  const headers = [...originalHeaders, ...newHeaders];

  return (
    <Table>
      <TableCaption>Spreadsheet Data</TableCaption>
      <TableHeader>
        <TableRow>
          {headers.map((header, index) => (
            <TableHead key={index}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableInfo.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {originalHeaders.map((header) => (
              <TableCell key={header}>{String(row[header]) || "-"}</TableCell>
            ))}
            {newHeaders.map((_, newColIndex) => (
              <TableCell key={newColIndex}>-</TableCell>
            ))}
          </TableRow>
        ))}
        <TableRow>
          {originalHeaders.map((header) => (
            <TableCell key={header}>-</TableCell>
          ))}
          {tableData.map((col, newColIndex) => (
            <TableCell className="font-bold" key={newColIndex}>
              {col.type}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}