"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Replace the existing interface definitions with these more comprehensive ones
interface Column {
  _id: string
  name: string
  type: string
}

interface TableInfo {
  error: boolean
  table: {
    _id: string
    user: string
    name: string
    sheetId?: string
    columns: Column[]
    createdAt: string
    updatedAt: string
    __v: number
  }
  sheetData: string[][]
}

// Update the component definition to include return type
const TablePage: React.FC = () => {
  const router = useRouter()
  const { tableId } = useParams<{ tableId: string }>()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  // Update the state definition
  const [tableInfo, setTableInfo] = useState<TableInfo | null>(null)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

  const fetchTableData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/tables/${tableId}`)
      console.log("Response:", response)

      const data = await response.json()
      if (data.error) {
        toast.error(data.message || "Failed to fetch table data")
        console.error("Failed to fetch table data:", data.message)
      } else {
        console.log("Fetched Table Data:", data)
        setTableInfo(data)
      }
    } catch (error) {
      console.error("Failed to fetch table data:", error)
      toast.error("Failed to fetch table data")
    } finally {
      setIsLoading(false)
    }
  }, [tableId])

  useEffect(() => {
    fetchTableData()
  }, [fetchTableData])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetchTableData()
      toast.success("The latest data has been loaded from Google Sheets")
    } catch (error) {
      console.error("Failed to refresh table data:", error)
      toast.error("Failed to refresh table data")
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleDeleteTable = async () => {
    setIsDeleteDialogOpen(false) // Close dialog before deleting
    try {
      const response = await fetch(`/api/tables/${tableId}`, {
        method: "DELETE",
      })

      const data = await response.json()
      if (data.success) {
        router.push("/") // Redirect after deletion
        toast.success("Table deleted successfully")
      } else {
        toast.error(data.error || "Failed to delete table")
      }
    } catch (error) {
      console.error("Error deleting table:", error)
      toast.error("Failed to delete table")
    }
  }

  if (isLoading) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading={<Skeleton className="h-8 w-[200px]" />}
          text={<Skeleton className="h-4 w-[300px]" />}
        />
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-[120px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[400px] w-full" />
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    )
  }

  const originalHeaders = tableInfo?.sheetData?.[0] || []
  const newHeaders = tableInfo?.table?.columns?.map((col) => col.name) || []
  const headers = [...originalHeaders, ...newHeaders]
  const rows = tableInfo?.sheetData?.slice(1) || []

  return (
    <DashboardShell>
      <DashboardHeader
        heading={tableInfo?.table?.name || "Table"}
        text={
          <div className="flex items-center gap-2">
            <span>Connected to Google Sheets</span>
            {tableInfo?.table?.sheetId && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Connected
              </Badge>
            )}
          </div>
        }
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
          <Button size="sm" variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Table
          </Button>
        </div>
      </DashboardHeader>
      <Card className="overflow-x-auto">
        <CardHeader>
          <CardTitle>Table Data</CardTitle>
        </CardHeader>
        <CardContent>

          {tableInfo && (
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
                {rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
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
                  {tableInfo?.table?.columns?.map((col, newColIndex) => (
                    <TableCell className="font-bold" key={newColIndex}>
                      {col.type}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this table? This action cannot be undone.</p>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTable}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}

export default TablePage

