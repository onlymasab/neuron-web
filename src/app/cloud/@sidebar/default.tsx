// app/cloud/@sidebar/default.js
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileIcon, HomeIcon, PeopleIcon, PhotoIcon, ShareIcon, TrashIcon } from '../components/icons';

export default function Sidebar() {
    const pathname = usePathname();

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
        <div className="flex flex-col h-full bg-[#ebf2fd] pt-[1vh] pb-[5vh] justify-between ">
            <div className='flex flex-col'>
                <div className="px-7.5 py-5">
                    <button className='px-2.5 py-1.5 rounded-full text-white text-sm' style={{ background: "linear-gradient(93deg, #0D6AFF 4.18%, #0956D3 78.6%)" }}>+ Create or upload</button>
                </div>
                <span className='px-4 pb-3 2xl:py-5 text-sm font-semibold'>Aneela Kiran</span>
                <div>
                    {navigation.map((item) => (
                        <Link key={item.name} href={item.href} className={`flex items-center h-[6vh] p-px gap-4 text-sm transition ease-in-out duration-150 ${pathname === item.href
                            ? 'border-l-5 border-l-[#0D6AFF] bg-[#f5f9fc] pl-3'
                            : 'border-none pl-4'
                            }`}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                </div>
                <div>
                    <h3 className="py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Browse files by
                    </h3>
                    <div>
                        {browseFilesBy.map((item) => (
                            <Link key={item.name} href={item.href} className={`flex items-center h-[6vh] p-px pl-4 gap-4 text-sm transition ease-in-out duration-150 ${pathname === item.href
                                ? 'border-l-5 border-l-[#0D6AFF] bg-[#f5f9fc] pl-3'
                                : 'border-none pl-4'
                                }`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <Link href={"/cloud/storage"} className='flex flex-col px-4 gap-2'>
                <span className='text-sm font-semibold'>Storage</span>
                <div>
                    <StorageIndicator />
                </div>
            </Link>
        </div>
    );
}

const StorageIndicator = () => {
    const usedStorage = 2.2;
    const totalStorage = 5;

    const usedPercentage = Math.round((usedStorage / totalStorage) * 100);
    return (
        <div>
            <div className='w-full bg-[#e8e8e8] rounded-full h-2.5'>
                <div className="h-2.5 bg-[#0d6aff] rounded-full" style={{ width: `${usedPercentage}%` }}></div>
            </div>
            <p className='text-[#777] text-[11px]/5 mt-1'>{usedStorage} GB used of {totalStorage} GB {"("}{usedPercentage}{"%)"}</p>
        </div>
    )
}