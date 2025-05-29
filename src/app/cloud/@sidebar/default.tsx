// components/Sidebar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { JSX } from "react/jsx-runtime";
import { toast } from "sonner";

import {
  FileIcon,
  HomeIcon,
  PeopleIcon,
  PhotoIcon,
  ShareIcon,
  TrashIcon,
} from "../components/icons";
import { Plus } from "lucide-react";

import { useAuthStore } from "@/stores/useAuthStore";
import { useCloudStore } from "@/stores/useCloudStore";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const navigation = [
    { name: "Home", href: "/cloud", icon: <HomeIcon /> },
    { name: "My files", href: "/cloud/files", icon: <FileIcon /> },
    { name: "Photos", href: "/cloud/photos", icon: <PhotoIcon /> },
    { name: "Shared", href: "/cloud/shared", icon: <ShareIcon /> },
    { name: "Recycle bin", href: "/cloud/trash", icon: <TrashIcon /> },
  ];

  const browseFilesBy = [
    { name: "People", href: "/cloud/people", icon: <PeopleIcon /> },
  ];

  return (
    <div className="flex flex-col h-full bg-[#ebf2fd] pt-4 pb-6 justify-between">
      <div>
        <div className="px-6 py-4">
          <CreateMenu />
        </div>

        <span className="px-6 pb-4 mb-3 text-md font-semibold text-gray-800">
          {user?.name || "User"}
        </span>

        <nav>
          {navigation.map((item) => (
            <SidebarLink key={item.name} item={item} pathname={pathname} />
          ))}
        </nav>

        <div>
          <h3 className="pt-6 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Browse files by
          </h3>
          {browseFilesBy.map((item) => (
            <SidebarLink key={item.name} item={item} pathname={pathname} />
          ))}
        </div>
      </div>

      <Link href="/cloud/storage" className="flex flex-col px-6 gap-2">
        <span className="text-sm font-semibold">Storage</span>
        <StorageIndicator />
      </Link>
    </div>
  );
}

const SidebarLink = ({
  item,
  pathname,
}: {
  item: SidebarItem;
  pathname: string;
}) => {
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={`flex items-center h-[6vh] gap-4 text-sm font-medium transition ${
        isActive
          ? "pl-3 border-l-4 border-blue-600 bg-[#f5f9fc] text-blue-600"
          : "pl-6 text-gray-700 hover:bg-[#f0f5fc]"
      }`}
    >
      {item.icon}
      {item.name}
    </Link>
  );
};

interface SidebarItem {
  name: string;
  href: string;
  icon: JSX.Element;
}

const StorageIndicator = () => {
  const usedStorage = 2.2;
  const totalStorage = 5;
  const usedPercentage = Math.round((usedStorage / totalStorage) * 100);

  return (
    <div>
      <div className="w-full bg-[#e0e0e0] rounded-full h-2.5">
        <div
          className="h-2.5 bg-blue-600 rounded-full"
          style={{ width: `${usedPercentage}%` }}
        />
      </div>
      <p className="text-gray-500 text-xs mt-1">
        {usedStorage} GB used of {totalStorage} GB ({usedPercentage}%)
      </p>
    </div>
  );
};

export function CreateMenu() {
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createFolder, uploadFile, uploading } = useCloudStore();
  const { user } = useAuthStore();

  console.log('Authenticated user:', user);

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      toast.error("Folder name cannot be empty.");
      return;
    }

    if (/[<>:"/\\|?*]/.test(folderName)) {
      toast.error("Folder name contains invalid characters.");
      return;
    }

    const toastId = toast.loading("Creating folder...");

    try {
      await createFolder(folderName);
      toast.success(`Folder created: ${folderName}`, { id: toastId });
      setFolderName("");
      setOpen(false);
    } catch (error: any) {
      toast.error(`Failed to create folder: ${error.message || 'Unknown error'}`, { id: toastId });
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "video/mp4",
      "audio/mpeg",
      "audio/mp3",
    ];

    for (const file of Array.from(files)) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Unsupported file: ${file.name}`);
        continue;
      }

      const fileId = `${file.name}-${Date.now()}`; // Unique ID for progress tracking
      const toastId = toast.loading(
        <div>
          <span>Uploading {file.name}...</span>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress[fileId] || 0}%` }}
            />
          </div>
          {/* <span>{Math.round(uploadProgress[fileId] || 0)}%</span> */}
        </div>,
        { duration: Infinity }
      );

      try {
        await uploadFile(file, undefined, (progress) => {
          setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
        });
        toast.success(`Uploaded: ${file.name}`, { id: toastId });
      } catch (error: any) {
        toast.error(`Failed to upload ${file.name}: ${error.message || 'Unknown error'}`, { id: toastId });
      } finally {
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
      }
    }

    e.target.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="w-full text-white font-medium rounded-full text-sm flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(93deg, #0D6AFF 4.18%, #0956D3 78.6%)",
            }}
            disabled={uploading || !user}
          >
            <Plus size={16} />
            Create or Upload
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Create & Upload</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Image
                  src="/images/icons/folder.png"
                  width={20}
                  height={20}
                  alt="folder"
                  className="mr-2"
                />
                New Folder
              </DropdownMenuItem>
            </DialogTrigger>

            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.mp4,.mp3"
              onChange={handleUpload}
              className="hidden"
            />

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                fileInputRef.current?.click();
              }}
            >
              Upload File
            </DropdownMenuItem>

            <DropdownMenuItem disabled>Upload Folder</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Enter folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && folderName.trim() && !uploading) {
              e.preventDefault();
              handleCreateFolder();
            }
          }}
          disabled={uploading || !user}
        />

        <DialogFooter>
          <Button
            onClick={() => setOpen(false)}
            variant="outline"
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateFolder}
            disabled={!folderName.trim() || uploading || !user}
          >
            {uploading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}