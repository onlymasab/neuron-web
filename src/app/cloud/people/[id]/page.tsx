import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react'
import SharedHeader from '../../components/shared_header';
import RecentFiles from '../../components/recentFiles';




export default async function ProfileDetail({ params }: { params: { id: string } }) {
    const {id} = await params;

    const profiles = {
        '1': { name: "Alina Hania", avatar: "/images/p1.png" },
        '2': { name: "John Doe", avatar: "/images/p2.png" },
        '3': { name: "Richard", avatar: "/images/p3.png" },
        '4': { name: "Alina Hania", avatar: "/images/p1.png" },
        '5': { name: "Alina Hania", avatar: "/images/p1.png" },
        '6': { name: "John Doe", avatar: "/images/p2.png" },
        '7': { name: "Richard", avatar: "/images/p3.png" },
        '8': { name: "Alina Hania", avatar: "/images/p1.png" },
    }

    const profile = profiles[id as keyof typeof profiles];

    if (!profile) return notFound();
    console.log("Params", params);

    return (
        <div className="flex flex-col gap-6 w-full text-4xl h-full px-15.5">
            <Link href={"/cloud/people"} className='flex gap-3 self-stretch items-center py-[3vh]  border-b border-b-[#A2A2A2]'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M10.7327 19.791C11.0326 20.0766 11.5074 20.0651 11.7931 19.7652C12.0787 19.4652 12.0672 18.9905 11.7673 18.7048L5.51587 12.7502L20.25 12.7502C20.6642 12.7502 21 12.4144 21 12.0002C21 11.586 20.6642 11.2502 20.25 11.2502L5.51577 11.2502L11.7673 5.29551C12.0672 5.00982 12.0787 4.53509 11.7931 4.23516C11.5074 3.93523 11.0326 3.92369 10.7327 4.20938L3.31379 11.2761C3.14486 11.437 3.04491 11.6422 3.01393 11.8556C3.00479 11.9024 3 11.9507 3 12.0002C3 12.0498 3.00481 12.0982 3.01398 12.1451C3.04502 12.3583 3.14496 12.5634 3.31379 12.7243L10.7327 19.791Z" fill="#242424" />
                </svg>
                <h2 className="text-sm font-semibold">Back to People</h2>
            </Link>
            <div className='flex gap-4 items-center'>
                <div className='flex gap-2.5 items-center'>
                    <Image src={profile.avatar} alt="Profile" width={40} height={40} className='rounded-full'/>
                    <h1 className='text-[#181818] text-[22px] font-semibold'>{profile.name}</h1>
                </div>
                <div className='grow 2xl:ml-10'>
                <SharedHeader id="people"/>
                </div>
            </div>
            <div className='h-[60vh]'>
                <RecentFiles id='memory' />
            </div>
        </div>
    )
}