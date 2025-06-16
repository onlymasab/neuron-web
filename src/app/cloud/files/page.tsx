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
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
} from "lucide-react";

import { useAuthStore } from "@/stores/useAuthStore";
import { useCloudStore } from "@/stores/useCloudStore";
import { CloudModel } from "@/types/CloudModel";

export default function Files() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { files, fetchFiles, updateFile, deleteFile } = useCloudStore();

  const [editFileId, setEditFileId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null);
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
          className="mx-3 border-gray-300"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-gray-300 bg-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.7)]"
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(sorted === "asc")}
            className="flex items-center bg-transparent hover:bg-transparent cursor-pointer"
          >
            Name
            {sorted === "asc" && <ChevronUp className="ml-2 h-4 w-4" />}
            {sorted === "desc" && <ChevronDown className="ml-2 h-4 w-4" />}
            {!sorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="max-w-[40vw] flex items-center gap-2 overflow-hidden">
          <span className="truncate inline-block max-w-full">
            {row.original.is_folder ? (
              <img
                src="/images/icons/folder-icon.png"
                alt="Folder"
                className="size-4 inline-block mr-2"
              />
            ) : row.original.file_extension === "pdf" ? (
              <img
                src="/images/icons/file-icon.png"
                alt="PDF"
                className="size-4 inline-block mr-3"
              />
            ) : row.original.type === "image" ? (
              <img
                src="/images/icons/image-icon.png"
                alt="Image"
                className="size-4 inline-block mr-3"
              />
            ) : row.original.type === "video" ? (
              <img
                src="/images/icons/video-icon.png"
                alt="Video"
                className="size-4 inline-block mr-3"
              />
            ) : row.original.type === "audio" ? (
              <img
                src="/images/icons/audio-icon.png"
                alt="Audio"
                className="size-4 inline-block mr-3"
              />
            ) : (
              "📄"
            )}
            {row.getValue("name")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(sorted === "asc")}
            className="flex items-center bg-transparent hover:bg-transparent cursor-pointer"
          >
            Modified
            {sorted === "asc" && <ChevronUp className="ml-2 h-4 w-4" />}
            {sorted === "desc" && <ChevronDown className="ml-2 h-4 w-4" />}
            {!sorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      cell: ({ row }) =>
        new Date(row.getValue("updated_at")).toLocaleDateString(),
    },
    {
      accessorKey: "size",
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(sorted === "asc")}
            className="flex items-center !px-0 bg-transparent hover:bg-transparent cursor-pointer mr-2"
          >
            File Size
            {sorted === "asc" && <ChevronUp className="ml-2 h-4 w-4" />}
            {sorted === "desc" && <ChevronDown className="ml-2 h-4 w-4" />}
            {!sorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      cell: ({ row }) =>
        row.original.is_folder
          ? "-"
          : `${((row.getValue("size") as number) / 1024 / 1024).toFixed(2)} MB`,
    },
    {
      accessorKey: "is_shared",
      header: "Sharing",
      cell: ({ row }) => (row.getValue("is_shared") ? "Shared" : "Private"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
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
                    await useCloudStore.getState().deleteFile(file.id);
                    useCloudStore.setState((state) => ({
                      files: state.files.filter((f) => f.id !== file.id),
                    }));
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
      setDialogOpen(false);
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
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-y-auto max-h-full">
            <Table className="bg-white">
              <TableHeader className="bg-white">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="bg-[rgba(255,255,255,0.5)] backdrop-blur-lg border border-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.5)]"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-[rgba(255,255,255,0.5)] cursor-pointer"
                  >
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
          <DialogHeader>
            <DialogTitle>
                Preview
            </DialogTitle>
          </DialogHeader>
          <DialogContent className="w-full h-auto p-0 overflow-hidden" >
            <img src={previewImageSrc} alt="Preview" className="w-[1920px] h-auto" />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}