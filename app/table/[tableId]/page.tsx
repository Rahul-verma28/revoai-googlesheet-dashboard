"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Define types for table data structure
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
  data: Record<string, string | number | boolean>[];
}

interface TablePageProps {
  params: {
    tableId: string;
  };
}

const TablePage: React.FC<TablePageProps> = ({ params }) => {
  const router = useRouter();
  const { tableId } = params;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableInfo, setTableInfo] = useState<TableData | null>(null);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const fetchTableData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tables/${tableId}`);
      if (!response.ok) throw new Error("Failed to fetch table data");

      const data = await response.json();
      console.log("Fetched Table Data:", data);
      setTableInfo(data.sheetData);
      setTableData(data.table);
    } catch (error) {
      console.error("Failed to fetch table data:", error);
      toast.error("Failed to fetch table data");
    } finally {
      setIsLoading(false);
    }
  }, [tableId]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchTableData();
      toast.success("The latest data has been loaded from Google Sheets");
    } catch (error) {
      console.error("Failed to refresh table data:", error);
      toast.error("Failed to refresh table data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteTable = async () => {
    setIsDeleteDialogOpen(false); // Close dialog before deleting
    try {
      const response = await fetch(`/api/tables/${tableId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        router.push("/"); // Redirect after deletion
        toast.success("Table deleted successfully");
      } else {
        toast.error(data.error || "Failed to delete table");
      }
    } catch (error) {
      console.error("Error deleting table:", error);
      toast.error("Failed to delete table");
    }
  };

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
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={tableData?.name || "Table"}
        text={
          <div className="flex items-center gap-2">
            <span>Connected to Google Sheets</span>
            {tableData?.sheetId && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Connected
              </Badge>
            )}
          </div>
        }
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh Data
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Table
          </Button>
        </div>
      </DashboardHeader>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Table Data</CardTitle>
          </CardHeader>
          <CardContent>
            {tableInfo && (
              <DataTable tableInfo={tableInfo} tableData={tableData?.columns} />
            )}
          </CardContent>
        </Card>
      </div>

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
  );
};

export default TablePage;