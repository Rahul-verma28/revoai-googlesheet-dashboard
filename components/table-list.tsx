import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, Table } from "lucide-react"

interface Column {
  id: string;
  name: string;
  type: string;
}

interface TableData {
  _id: string;
  name: string;
  sheetId?: string;
  columns: Column[];
  customColumns?: Column[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface TableListProps {
  tables: TableData[];
  isLoading: boolean;
}

export function TableList({ tables, isLoading }: TableListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-1">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-4/5" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (tables.length === 0) {
    return (
      <Card className="my-10">
        <CardHeader>
          <CardTitle>No tables found</CardTitle>
          <CardDescription>Create your first table to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
            <div className="flex flex-col items-center gap-1 text-center">
              <Table className="h-10 w-10 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No tables created</h3>
              <p className="text-sm text-muted-foreground">You haven&apos;t created any tables yet.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <Table className="mr-2 h-4 w-4" />
            Create a table
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tables.map((table) => (
        <Card key={table._id}>
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {table.name}
              {table.sheetId && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Connected
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {table.description || `Created on ${new Date(table.createdAt).toLocaleDateString()}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center text-sm">
                <span className="text-muted-foreground">Columns:</span>
                <span className="ml-auto font-medium">
                  {(table.columns?.length || 0) + (table.customColumns?.length || 0)}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-muted-foreground">Last updated:</span>
                <span className="ml-auto font-medium">{new Date(table.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/table/${table._id}`} className="w-full">
              <Button className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Table
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

