// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { toast } from "sonner"
// import { Plus, Trash2 } from "lucide-react"

// interface CreateTableDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   onSubmit: (data: { name: string; sheetId: string; columns: { name: string; type: string }[] }) => Promise<void>
// }

// export function CreateTableDialog({ open, onOpenChange, onSubmit }: CreateTableDialogProps) {
//   const [formData, setFormData] = useState({
//     name: "",
//     sheetId: "",
//     columns: [{ name: "", type: "text" }],
//   })
//   const [isLoading, setIsLoading] = useState(false)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleColumnChange = (index: number, field: string, value: string) => {
//     setFormData((prev) => {
//       const newColumns = [...prev.columns]
//       newColumns[index] = { ...newColumns[index], [field]: value }
//       return { ...prev, columns: newColumns }
//     })
//   }

//   const addColumn = () => {
//     setFormData((prev) => ({
//       ...prev,
//       columns: [...prev.columns, { name: "", type: "text" }],
//     }))
//   }

//   const removeColumn = (index: number) => {
//     if (formData.columns.length === 1) {
//       toast("You need at least one column")
//       return
//     }

//     setFormData((prev) => {
//       const newColumns = [...prev.columns]
//       newColumns.splice(index, 1)
//       return { ...prev, columns: newColumns }
//     })
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     // Validate form
//     if (!formData.name.trim()) {
//       toast("Please provide a name for your table")
//       return
//     }

//     if (formData.columns.some((col) => !col.name.trim())) {
//       toast("All columns must have a name")
//       return
//     }

//     setIsLoading(true)

//     try {
//       await onSubmit(formData)

//       // Reset form after successful submission
//       setFormData({
//         name: "",
//         sheetId: "",
//         columns: [{ name: "", type: "text" }],
//       })

//       // Close dialog after successful submission
//       onOpenChange(false)
//     } catch (error) {
//       console.error("Error creating table:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[600px]">
//         <form onSubmit={handleSubmit}>
//           <DialogHeader>
//             <DialogTitle>Create New Table</DialogTitle>
//             <DialogDescription>Create a new table and connect it to a Google Sheet</DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label htmlFor="name">Table Name</Label>
//               <Input
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="My Table"
//                 required
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="sheetId">Google Sheet ID</Label>
//               <Input
//                 id="sheetId"
//                 name="sheetId"
//                 value={formData.sheetId}
//                 onChange={handleChange}
//                 placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
//               />
//               <p className="text-xs text-muted-foreground">The ID from your Google Sheet URL</p>
//             </div>
//             <div className="grid gap-2">
//               <div className="flex items-center justify-between">
//                 <Label>Columns</Label>
//                 <Button type="button" variant="outline" size="sm" onClick={addColumn}>
//                   <Plus className="h-4 w-4 mr-1" /> Add Column
//                 </Button>
//               </div>
//               <div className="space-y-2">
//                 {formData.columns.map((column, index) => (
//                   <div key={index} className="flex items-center gap-2">
//                     <Input
//                       value={column.name}
//                       onChange={(e) => handleColumnChange(index, "name", e.target.value)}
//                       placeholder="Column Name"
//                       required
//                     />
//                     <Select
//                       value={column.type}
//                       onValueChange={(value) => handleColumnChange(index, "type", value)}
//                     >
//                       <SelectTrigger className="w-[120px]">
//                         <SelectValue placeholder="Type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="text">Text</SelectItem>
//                         <SelectItem value="date">Date</SelectItem>
//                         <SelectItem value="number">Number</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <Button type="button" variant="ghost" size="icon" onClick={() => removeColumn(index)}>
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isLoading}>
//               {isLoading ? "Creating..." : "Create Table"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }



"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface CreateTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; sheetId: string; columns: { name: string; type: string }[] }) => Promise<void>;
}

export function CreateTableDialog({ open, onOpenChange, onSubmit }: CreateTableDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    sheetId: "",
    columns: [] as { name: string; type: string }[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleColumnChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const newColumns = [...prev.columns];
      newColumns[index] = { ...newColumns[index], [field]: value };
      return { ...prev, columns: newColumns };
    });
  };

  const addColumn = () => {
    setFormData((prev) => ({
      ...prev,
      columns: [...prev.columns, { name: "", type: "text" }],
    }));
  };

  const removeColumn = (index: number) => {
    setFormData((prev) => {
      const newColumns = [...prev.columns];
      newColumns.splice(index, 1);
      return { ...prev, columns: newColumns };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name.trim() || !formData.sheetId.trim()) {
      setError("Please provide a name and Google Sheet ID for your table");
      return;
    }

    if (formData.columns.some((col) => !col.name.trim())) {
      setError("All columns must have a name");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSubmit(formData);

      // Reset form after successful submission
      setFormData({
        name: "",
        sheetId: "",
        columns: [],
      });

      // Close dialog after successful submission
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating table:", error);
      setError("Failed to create table");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Table</DialogTitle>
            <DialogDescription>Create a new table and connect it to a Google Sheet</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Table Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="My Table"
                
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sheetId">Google Sheet ID</Label>
              <Input
                id="sheetId"
                name="sheetId"
                value={formData.sheetId}
                onChange={handleChange}
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
              />
              <p className="text-xs text-muted-foreground">The ID from your Google Sheet URL</p>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Columns</Label>
                <Button type="button" variant="outline" size="sm" onClick={addColumn}>
                  <Plus className="h-4 w-4 mr-1" /> Add Column
                </Button>
              </div>
              <div className="space-y-2">
                {formData.columns.map((column, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={column.name}
                      onChange={(e) => handleColumnChange(index, "name", e.target.value)}
                      placeholder="Column Name"
                      
                    />
                    <Select
                      value={column.type}
                      onValueChange={(value) => handleColumnChange(index, "type", value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeColumn(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Table"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}