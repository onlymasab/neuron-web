// app/page.tsx
"use client";

import Image from "next/image";
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";

import { useAuthStore } from "@/stores/useAuthStore";
import { useCloudStore } from "@/stores/useCloudStore";
import { CloudModel } from "@/types/CloudModel";

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { files, fetchFiles } = useCloudStore();
  const [editFileId, setEditFileId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    if (user?.id) {
      fetchFiles(user.id).catch((error) =>
        toast.error(`Failed to fetch recent files: ${error.message}`)
      );
    }
  }, [user, fetchFiles]);

  const recentImages = files
    .filter((file) => file.type === "image" && !file.is_trashed)
    .slice(0, 4)
    .map((file) => ({
      id: file.id,
      src: file.file_url,
      throwback: `Uploaded on ${new Date(file.created_at!).toLocaleDateString()}`,
      date: new Date(file.created_at!).getFullYear().toString(),
    }));

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
      cell: ({ row }) => (row.getValue("is_shared") ? "Shared" : "Private"),
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
                    await useCloudStore.getState().deleteFile(file.id);
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
      await useCloudStore.getState().updateFile(editFileId!, { name: editName });
      toast.success(`Renamed to ${editName}`);
      setEditFileId(null);
      setEditName("");
    } catch (error: any) {
      toast.error(`Failed to rename: ${error.message}`);
    }
  };

  return (
    <div className="w-full px-6 py-4">
      {files.length === 0 && !recentImages.length ? (
        <div className="flex flex-col items-center justify-center text-2xl h-[70vh]">
          <span className="text-[22px] font-medium">
            Your recent files will show up here.
          </span>
          <Image
            src="/images/recentFiles.png"
            alt="Cloud"
            width={200}
            height={200}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-[clamp(1rem,1.5vw,1.5rem)] font-medium">
              Recent Images
            </h2>
            {recentImages.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentImages.map((frame) => (
                  <Card
                    key={frame.id}
                    className="relative overflow-hidden h-[25vh]"
                  >
                    <Image
                      src={frame.src}
                      alt={frame.throwback}
                      layout="fill"
                      objectFit="cover"
                      className="absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
                      <CardTitle className="text-white font-semibold text-sm">
                        {frame.throwback}
                      </CardTitle>
                      <p className="text-xs text-white">{frame.date}</p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent images found.</p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-[clamp(1rem,1.5vw,1.5rem)] font-medium">
              Recent Files
            </h2>
            {files.length ? (
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
                          No recent files.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-gray-500">No recent files or folders found.</p>
            )}
          </div>
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