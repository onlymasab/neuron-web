"use client";
import Link from 'next/link';
import Image from 'next/image'
import { usePathname } from 'next/navigation';
import { FileIcon, HomeIcon, PeopleIcon, PhotoIcon, ShareIcon, TrashIcon } from '../components/icons';
import { Plus } from 'lucide-react';
import { JSX } from 'react/jsx-runtime';
import { useAuthStore } from '@/stores/useAuthStore'; // adjust the path as needed
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuthStore();

    const navigation = [
        { name: 'Home', href: '/cloud', icon: <HomeIcon /> },
        { name: 'My files', href: '/cloud/files', icon: <FileIcon /> },
        { name: 'Photos', href: '/cloud/photos', icon: <PhotoIcon /> },
        { name: 'Shared', href: '/cloud/shared', icon: <ShareIcon /> },
        { name: 'Recycle bin', href: '/cloud/trash', icon: <TrashIcon /> },
    ];

    const browseFilesBy = [
        { name: 'People', href: '/cloud/people', icon: <PeopleIcon /> },
    ];

    return (
        <div className="flex flex-col h-full bg-[#ebf2fd] pt-[1vh] pb-[5vh] justify-between">
            <div>
                <div className="px-8 py-5">
                    <CreateMenu />
                </div>

                <span className='px-4 pb-8 mb-4 2xl:py-8  text-md font-semibold'>
                    {user?.name || 'User'}
                </span>

                <div>
                    {navigation.map((item) => (
                        <SidebarLink key={item.name} item={item} pathname={pathname} />
                    ))}
                </div>

                <div>
                    <h3 className="py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Browse files by
                    </h3>
                    {browseFilesBy.map((item) => (
                        <SidebarLink key={item.name} item={item} pathname={pathname} />
                    ))}
                </div>
            </div>

            <Link href="/cloud/storage" className="flex flex-col px-4 gap-2">
                <span className="text-sm font-semibold">Storage</span>
                <StorageIndicator />
            </Link>
        </div>
    );
}

interface SidebarItem {
    name: string;
    href: string;
    icon: JSX.Element;
}

const SidebarLink = ({ item, pathname }: { item: SidebarItem; pathname: string }) => {
    const isActive = pathname === item.href;
    return (
        <Link
            href={item.href}
            className={`flex items-center h-[6vh] gap-4 text-sm transition ease-in-out duration-150 ${
                isActive
                    ? 'pl-3 border-l-[5px] border-l-[#0D6AFF] bg-[#f5f9fc]'
                    : 'pl-4'
            }`}
        >
            {item.icon}
            {item.name}
        </Link>
    );
};

const StorageIndicator = () => {
    const usedStorage = 2.2;
    const totalStorage = 5;
    const usedPercentage = Math.round((usedStorage / totalStorage) * 100);

    return (
        <div>
            <div className="w-full bg-[#e8e8e8] rounded-full h-2.5">
                <div
                    className="h-2.5 bg-[#0d6aff] rounded-full"
                    style={{ width: `${usedPercentage}%` }}
                />
            </div>
            <p className="text-[#777] text-[11px]/5 mt-1">
                {usedStorage} GB used of {totalStorage} GB ({usedPercentage}%)
            </p>
        </div>
    );
};


function CreateMenu() {
    return (
        <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium"
                        style={{
                            background: "linear-gradient(93deg, #0D6AFF 4.18%, #0956D3 78.6%)",
                        }}
         >
        <Plus size={16} strokeWidth={2} />
        Create or Upload
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Create & Upload</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
              <Image src={"/images/icons/folder.png"} width={20} height={20} alt="folder" className='mr-2'/>  Folder
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            File Upload
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Folder Upload
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    );
}

 