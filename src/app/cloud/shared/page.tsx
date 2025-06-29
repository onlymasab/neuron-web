"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
} from "lucide-react";

import { useAuthStore } from "@/stores/useAuthStore";
import { useCloudStore } from "@/stores/useCloudStore";
import { CloudModel } from "@/types/CloudModel";
import Image from "next/image";

export default function SharedFiles() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    sharedFilesWithEmails,
    fetchFilesWithEmails,
    updateFile,
    deleteFile,
  } = useCloudStore();

  const [editFileId, setEditFileId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    fetchFilesWithEmails();
  }, []);

  const columns: ColumnDef<CloudModel>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="mx-3 border-gray-300"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="mx-3 border-gray-300 bg-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.7)]"
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
          className="flex items-center bg-transparent hover:bg-transparent cursor-pointer"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="max-w-[40vw] flex items-center gap-2 overflow-hidden">
          {row.original.is_folder ? (
            <Image src="/images/icons/folder-icon.png" alt="Folder" width={16} height={16} />
          ) : row.original.file_extension === "pdf" ? (
            <Image src="/images/icons/file-icon.png" alt="PDF" width={16} height={16} />
          ) : row.original.type === "image" ? (
            <Image src="/images/icons/image-icon.png" alt="Image" width={16} height={16} />
          ) : row.original.type === "video" ? (
            <Image src="/images/icons/video-icon.png" alt="Video" width={16} height={16} />
          ) : row.original.type === "audio" ? (
            <Image src="/images/icons/audio-icon.png" alt="Audio" width={16} height={16} />
          ) : (
            "📄"
          )}
          <span className="truncate max-w-full">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "updated_at",
      header: "Date",
      cell: ({ row }) => new Date(row.getValue("updated_at")).toLocaleDateString(),
    },
    {
      accessorKey: "size",
      header: "File Size",
      cell: ({ row }) =>
        row.original.is_folder
          ? "-"
          : `${(Number(row.getValue("size")) / 1024 / 1024).toFixed(2)} MB`,
    },
    {
      accessorKey: "shared_emails",
      header: "Shared With",
      cell: ({ row }) => {
        const emails = row.getValue("shared_emails") as string[];
        return Array.isArray(emails) && emails.length ? emails.join(", ") : "Private";
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: Row<CloudModel> }) => {
        const file = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-transparent">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setEditFileId(file.id);
                  setEditName(file.name);
                  setDialogOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    await deleteFile(file.id);
                    toast.success(`${file.name} moved to trash`);
                    fetchFilesWithEmails();
                  } catch (error) {
                    toast.error(`Failed to delete: ${error instanceof Error ? error.message : "Unknown error"}`);
                  }
                }}
              >
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (file.is_folder) {
                    router.push(`/cloud/files?folder=${file.id}`);
                  } else if (file.file_extension === "pdf") {
                    window.open(file.file_url, "_blank");
                  } else if (file.type === "image" || file.type === "video") {
                    setPreviewImageSrc(file.file_url);
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
    data: sharedFilesWithEmails,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
      columnFilters,
    },
  });

  const handleEdit = async () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    try {
      if (editFileId) {
        await updateFile(editFileId, { name: editName });
        toast.success(`Renamed to ${editName}`);
        fetchFilesWithEmails();
      }
      setEditFileId(null);
      setEditName("");
      setDialogOpen(false);
    } catch (error) {
      toast.error(`Failed to rename: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full px-6 py-4">
      <h2 className="text-2xl font-medium">Shared Files</h2>
      {sharedFilesWithEmails.length === 0 ? (
        <div className="flex items-center justify-center h-[70vh]">
          <p className="text-gray-500">No shared files found.</p>
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-y-auto max-h-full">
            <Table className="bg-white">
              <TableHeader className="bg-white">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit File Name</DialogTitle>
          </DialogHeader>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="New file name"
          />
          <DialogFooter>
            <Button onClick={handleEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {previewImageSrc && (
        <Dialog open={!!previewImageSrc} onOpenChange={() => setPreviewImageSrc(null)}>
          <DialogContent className="w-full h-auto p-0 overflow-hidden">
            <Image src={previewImageSrc} alt="Preview" width={1920} height={1080} className="h-auto" />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
