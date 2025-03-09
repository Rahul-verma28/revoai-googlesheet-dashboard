"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { TableList } from "@/components/table-list";
import { CreateTableDialog } from "@/components/create-table-dialog";
import { toast } from "sonner";

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

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [tables, setTables] = useState<TableData[]>([]);
  const [isCreateTableOpen, setIsCreateTableOpen] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("/api/tables");
        const data = await response.json();
        if (data.success) {
          setTables(data.tables);
        } else {
          toast.error(data.error || "Failed to fetch tables");
        }
      } catch (error) {
        console.error("Failed to fetch tables:", error);
        toast.error("Failed to fetch tables");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  const handleCreateTable = async (tableData: Partial<TableData>) => {
    try {
      const response = await fetch("/api/tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tableData),
      });

      const data = await response.json();

      if (data.success) {
        setTables((prev) => [...prev, data.table]);
        toast.success("Your table has been created successfully");
        setIsCreateTableOpen(false);
      } else {
        console.error("Failed to create table:", data);
        toast.error(data.error || "Failed to create table");
      }
    } catch (error) {
      console.error("Failed to create table:", error);
      toast.error("Failed to create table");
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Manage your tables and data">
        <Button onClick={() => setIsCreateTableOpen(true)}>Create Table</Button>
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : tables.length}</div>
            <p className="text-xs text-muted-foreground">
              {tables.length === 0 ? "Create your first table" : "Manage your data tables"}
            </p>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Sheets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : tables.filter((t) => t.sheetId).length}</div>
            <p className="text-xs text-muted-foreground">Google Sheets connected to your tables</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Columns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : tables.reduce((acc, table) => acc + (table.customColumns?.length || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Additional columns added to your tables</p>
          </CardContent>
        </Card> */}
      </div>
      <TableList tables={tables} isLoading={isLoading} />
      <CreateTableDialog open={isCreateTableOpen} onOpenChange={setIsCreateTableOpen} onSubmit={handleCreateTable} />
    </DashboardShell>
  );
}