// app/files.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";

import { useAuthStore } from "@/stores/useAuthStore";
import { useCloudStore } from "@/stores/useCloudStore";
import { CloudModel } from "@/types/CloudModel";

export default function Files() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { files, fetchFiles, updateFile, deleteFile } = useCloudStore();
  const [editFileId, setEditFileId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    if (user?.id) {
      fetchFiles(user.id).catch((error) =>
        toast.error(`Failed to fetch files: ${error.message}`)
      );
    }
  }, [user, fetchFiles]);

  const columns: ColumnDef<CloudModel>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.is_folder ? "📁" : "📄"}
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Modified
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) =>
        new Date(row.getValue("updated_at")).toLocaleDateString(),
    },
    {
      accessorKey: "size",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          File Size
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) =>
        row.original.is_folder
          ? "-"
          : `${((row.getValue("size") as number) / 1024 / 1024).toFixed(2)} MB`,
    },
    {
      accessorKey: "is_shared",
      header: "Sharing",
      cell: ({ row }) =>
        row.getValue("is_shared") ? "Shared" : "Private",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const file = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setEditFileId(file.id);
                  setEditName(file.name);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    await deleteFile(file.id);
                    toast.success(`${file.name} moved to trash`);
                  } catch (error: any) {
                    toast.error(`Failed to delete ${file.name}: ${error.message}`);
                  }
                }}
              >
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (file.is_folder) {
                    router.push(`/cloud/files?folder=${file.id}`);
                  } else {
                    window.open(file.file_url, "_blank");
                  }
                }}
              >
                View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: files,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  const handleEdit = async () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    if (/[<>:"/\\|?*]/.test(editName)) {
      toast.error("Name contains invalid characters");
      return;
    }
    try {
      await updateFile(editFileId!, { name: editName });
      toast.success(`Renamed to ${editName}`);
      setEditFileId(null);
      setEditName("");
    } catch (error: any) {
      toast.error(`Failed to rename: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full px-6 py-4">
      <h2 className="text-2xl font-medium">My Files</h2>
      {files.length === 0 ? (
        <div className="flex items-center justify-center h-[70vh]">
          <p className="text-gray-500">No files or folders found.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog
        open={!!editFileId}
        onOpenChange={(open) => {
          if (!open) {
            setEditFileId(null);
            setEditName("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename File/Folder</DialogTitle>
          </DialogHeader>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Enter new name"
            onKeyDown={(e) => {
              if (e.key === "Enter" && editName.trim()) {
                handleEdit();
              }
            }}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditFileId(null);
                setEditName("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={!editName.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}