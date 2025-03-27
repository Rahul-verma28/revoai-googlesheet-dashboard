// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"

// interface DataTableProps {
//   tableInfo: string[][];
// }

// export function DataTable({ tableInfo, tableData }) {
//   if (!tableInfo || tableInfo.length === 0) {
//     return <TableCaption>No data available.</TableCaption>;
//   }

//   const headers = tableInfo[0];
//   const rows = tableInfo.slice(1);

//   return (
//     <Table>
//       <TableCaption>Spreadsheet Data</TableCaption>
//       <TableHeader>
//         <TableRow>
//           {headers.map((header, index) => (
//             <TableHead key={index}>{header}</TableHead>
//           ))}

//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {rows.map((row, rowIndex) => (
//           <TableRow key={rowIndex}>
//             {headers.map((_, colIndex) => (
//               <TableCell key={colIndex}>{row[colIndex] || "-"}</TableCell>
//             ))}
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// }


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
  tableInfo: string[][];
  tableData: ColumnDefinition[];
}

export function DataTable({ tableInfo, tableData }: DataTableProps) {
  if (!tableInfo || tableInfo.length === 0) {
    return <TableCaption>No data available.</TableCaption>;
  }

  const originalHeaders = tableInfo[0];
  const newHeaders = tableData.map((col) => col.name)
  const headers = [...originalHeaders, ...newHeaders];
  const rows = tableInfo.slice(1);

  return (
    
    <Table >
      <TableCaption>Spreadsheet Data</TableCaption>
      <TableHeader>
        <TableRow>
          {headers.map((header, index) => (
            <TableHead key={index}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {/* Existing data */}
            {originalHeaders.map((_, colIndex) => (
              <TableCell key={colIndex}>{row[colIndex] || "-"}</TableCell>
            ))}
            {/* New columns (empty for existing rows) */}
            {newHeaders.map((_, newColIndex) => (
              <TableCell key={newColIndex}>-</TableCell>
            ))}
          </TableRow>
        ))}

        <TableRow>
          {originalHeaders.map((_, colIndex) => (
            <TableCell key={colIndex}>-</TableCell>
          ))}
          {tableData.map((col, newColIndex) => (
            <TableCell className="font-bold" key={newColIndex}>{col.type}</TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}
