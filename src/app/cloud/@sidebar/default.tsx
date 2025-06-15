"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
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
import { Plus, XIcon, Upload as UploadIcon, FolderOpen as FolderOpenIcon } from "lucide-react";
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
import { motion } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  const parentId = searchParams.get("folder") || undefined;

  const navigation = [
    { name: "Home", href: "/cloud", icon: <HomeIcon /> },
    { name: "My files", href: "/cloud/files", icon: <FileIcon /> },
    { name: "Photos", href: "/cloud/photos", icon: <PhotoIcon /> },
    { name: "Shared", href: "/cloud/shared", icon: <ShareIcon /> },
  ];

  const browseFilesBy = [
    { name: "People", href: "/cloud/people", icon: <PeopleIcon /> },
  ];

  return (
    <div className="flex flex-col h-full bg-[#ebf2fd] pt-4 pb-6 justify-between">
      <div>
        <div className="px-6 py-4">
          <CreateMenu parentId={parentId} />
        </div>

        <span className="px-6 pb-4 mb-3 text-md font-semibold text-gray-800">
          {user?.full_name || "User"}
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
          ? "pl-5 border-l-4 border-blue-600 bg-[#f5f9fc] text-blue-600"
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

interface UploadFile {
  id: string;
  name: string;
  type: string;
  progress: number;
  status: 'preparing' | 'uploading' | 'finalizing' | 'success' | 'failed';
  message: string;
  fakeSizeMB: number;
  uploadedAmountMB: number;
  error?: string;
}

const UploadModal: React.FC<{ 
  uploads: UploadFile[]; 
  onClose: () => void; 
  isOpen: boolean 
}> = ({ uploads, onClose, isOpen }) => {
  const allCompleted = uploads.every(u => u.status === 'success' || u.status === 'failed');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const getFileIcon = (mimeType: string, status: string) => {
    const baseIcon = (
      <div className={`relative ${status === 'uploading' ? 'animate-pulse' : ''}`}>
        {mimeType.startsWith('image/') ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        ) : mimeType.startsWith('video/') ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-film">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M7 3v18" />
            <path d="M3 7.5h4" />
            <path d="M3 12h18" />
            <path d="M3 16.5h4" />
            <path d="M17 3v18" />
            <path d="M17 7.5h4" />
            <path d="M17 12h4" />
            <path d="M17 16.5h4" />
          </svg>
        ) : mimeType.startsWith('audio/') ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-2">
            <path d="M11 5L6 9H2v6h4l5 4z" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        ) : mimeType === 'application/pdf' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          </svg>
        )}
        
        {status === 'success' && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </motion.div>
        )}
      </div>
    );
    
    return baseIcon;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && (allCompleted || uploads.length === 0)) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: uploads.some(u => u.status === 'uploading') ? Infinity : 0,
                  ease: "easeInOut",
                }}
              >
                <UploadIcon className="h-5 w-5 text-blue-600" />
              </motion.div>
              <span>File Uploads</span>
              {uploads.some(u => u.status === 'uploading') && (
                <motion.span 
                  className="text-xs text-blue-600"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Uploading...
                </motion.span>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              disabled={!allCompleted && uploads.length > 0}
              className="rounded-full"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {uploads.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8 text-center text-gray-500 flex flex-col items-center"
          >
            <FolderOpenIcon className="h-12 w-12 text-gray-300 mb-3" />
            <p>No active uploads</p>
            <p className="text-xs mt-1">Drag and drop files anywhere to upload</p>
          </motion.div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {uploads.map((upload) => (
              <motion.div
                key={upload.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.01 }}
                onHoverStart={() => setHoveredItem(upload.id)}
                onHoverEnd={() => setHoveredItem(null)}
                className={`relative p-3 border rounded-lg transition-all ${
                  upload.status === 'success' ? 'bg-green-50 border-green-100' :
                  upload.status === 'failed' ? 'bg-red-50 border-red-100' :
                  'bg-white border-gray-200'
                } ${
                  hoveredItem === upload.id ? 'shadow-md' : 'shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 p-2 rounded-full transition-colors ${
                    upload.status === 'success' ? 'bg-green-100 text-green-600' :
                    upload.status === 'failed' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {getFileIcon(upload.type, upload.status)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium truncate">
                        {upload.name}
                      </p>
                      <span className={`text-xs font-semibold whitespace-nowrap ${
                        upload.status === 'success' ? 'text-green-600' :
                        upload.status === 'failed' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {upload.status === 'failed' ? 'Failed' : `${Math.floor(upload.progress)}%`}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2 relative overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${upload.progress}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full rounded-full absolute top-0 left-0 ${
                          upload.status === 'success' ? 'bg-green-500' :
                          upload.status === 'failed' ? 'bg-red-500' :
                          upload.status === 'finalizing' ? 'bg-blue-400' :
                          'bg-blue-600'
                        }`}
                      />
                      {upload.status === 'uploading' && (
                        <motion.div
                          className="absolute top-0 left-0 w-1/4 h-full bg-white opacity-30"
                          animate={{
                            x: ['-100%', '400%'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                      )}
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{upload.message}</span>
                      {upload.status !== 'preparing' && upload.fakeSizeMB > 0 && (
                        <span>
                          {upload.uploadedAmountMB.toFixed(1)} MB / {upload.fakeSizeMB.toFixed(1)} MB
                        </span>
                      )}
                    </div>
                    
                    {upload.error && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-red-500 text-xs mt-1"
                      >
                        {upload.error}
                      </motion.p>
                    )}
                  </div>
                </div>
                
                {upload.status === 'success' && hoveredItem === upload.id && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                  >
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                        initial={{
                          x: '50%',
                          y: '50%',
                          opacity: 0,
                        }}
                        animate={{
                          x: `${50 + Math.random() * 100 - 50}%`,
                          y: `${50 + Math.random() * 100 - 50}%`,
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
        
        <DialogFooter>
          <Button 
            onClick={onClose} 
            disabled={!allCompleted}
            className="relative overflow-hidden"
          >
            {uploads.some(u => u.status === 'success') ? (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Done
              </motion.span>
            ) : (
              'Cancel'
            )}
            
            {!allCompleted && uploads.length > 0 && (
              <motion.div
                className="absolute inset-0 bg-blue-600 opacity-10"
                animate={{
                  left: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function CreateMenu({ parentId }: { parentId?: string }) {
  const [open, setOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [activeUploads, setActiveUploads] = useState<UploadFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createFolder, uploadFile, uploading } = useCloudStore();
  const { user } = useAuthStore();

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      toast.error("Folder name cannot be empty.");
      return;
    }

    if (/[<>:\"/\\|?*]/.test(folderName)) {
      toast.error("Folder name contains invalid characters.");
      return;
    }

    const toastId = toast.loading("Creating folder...");

    try {
      await createFolder(folderName, parentId);
      toast.success(`Folder created: ${folderName}`, { id: toastId });
      setFolderName("");
      setOpen(false);
    } catch (error: any) {
      toast.error(`Failed to create folder: ${error.message || "Unknown error"}`, {
        id: toastId,
      });
    }
  };

  const updateUploadStatus = (id: string, updates: Partial<UploadFile>) => {
    setActiveUploads((prevUploads) =>
      prevUploads.map((upload) =>
        upload.id === id ? { ...upload, ...updates } : upload
      )
    );
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadModalOpen(true);

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "video/mp4",
      "audio/mpeg",
      "audio/mp3",
    ];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Unsupported file: ${file.name}`);
        continue;
      }

      const fileId = `${file.name}-${Date.now()}`;
      const fakeSizeMB = parseFloat((Math.random() * (50 - 2) + 2).toFixed(1));

      setActiveUploads((prev) => [
        ...prev,
        {
          id: fileId,
          name: file.name,
          type: file.type,
          progress: 0,
          status: 'preparing',
          message: 'Initializing upload...',
          fakeSizeMB: fakeSizeMB,
          uploadedAmountMB: 0,
        },
      ]);

      updateUploadStatus(fileId, { status: 'preparing', message: 'Initializing upload...' });
      await new Promise((res) => setTimeout(res, 1000 + Math.random() * 500));

      let fakeProgress = 0;
      const progressInterval = setInterval(() => {
        if (fakeProgress < 90) {
          fakeProgress = Math.min(fakeProgress + Math.floor(Math.random() * 10) + 5, 90);
          const uploadedAmount = (fakeProgress / 100) * fakeSizeMB;
          updateUploadStatus(fileId, {
            status: 'uploading',
            message: `Uploading...`,
            progress: fakeProgress,
            uploadedAmountMB: uploadedAmount,
          });
        }
      }, 500 + Math.random() * 500);

      try {
        await uploadFile(file, parentId, (realProgress: number) => {
          // Real progress handling would go here
        });

        clearInterval(progressInterval);
        updateUploadStatus(fileId, {
          progress: 90,
          uploadedAmountMB: (90 / 100) * fakeSizeMB,
          message: 'Upload nearly complete...',
        });
        await new Promise((res) => setTimeout(res, 500));

        updateUploadStatus(fileId, {
          status: 'finalizing',
          message: 'Finalizing...',
          progress: 95,
          uploadedAmountMB: fakeSizeMB,
        });
        await new Promise((res) => setTimeout(res, 1500 + Math.random() * 500));

        updateUploadStatus(fileId, {
          status: 'success',
          message: 'Upload Complete ✔️',
          progress: 100,
          uploadedAmountMB: fakeSizeMB,
          error: undefined,
        });
      } catch (error: any) {
        clearInterval(progressInterval);
        updateUploadStatus(fileId, {
          status: 'failed',
          message: 'Upload Failed!',
          progress: 0,
          error: error.message || "Unknown error",
        });
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCloseUploadModal = () => {
    const allFinished = activeUploads.every(u => u.status === 'success' || u.status === 'failed');
    if (allFinished) {
      setUploadModalOpen(false);
      setActiveUploads([]);
    }
  };

  return (
    <>
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
              if (e.key === "Enter") {
                handleCreateFolder();
              }
            }}
            autoFocus
          />

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!folderName.trim() || uploading}
              onClick={handleCreateFolder}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UploadModal
        isOpen={uploadModalOpen}
        uploads={activeUploads}
        onClose={handleCloseUploadModal}
      />
    </>
  );
}