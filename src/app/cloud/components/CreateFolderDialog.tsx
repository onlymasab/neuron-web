// components/CreateFolderDialog.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDriveStore } from '@/stores/useDriveStore';
import Image from 'next/image';
import { DropdownMenuItem, DropdownMenuShortcut } from '@/components/ui/dropdown-menu';

export function CreateFolderDialogItem() {
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const createFolder = useDriveStore((state) => state.createFolder);

  const handleCreate = async () => {
    if (!folderName.trim()) return;
    await createFolder(folderName);
    setFolderName('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Image src="/images/icons/folder.png" width={20} height={20} alt="folder" className="mr-2" />
          Folder
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Enter folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={handleCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}