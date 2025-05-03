'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function Page() {
    const persons = [
        {
            id: "1",
            name: "Alina Hania",
            email: "example@email.com",
            fileCount: "25",
            avatar: "/images/p1.png"
        },
        {
            id: "2",
            name: "John Doe",
            email: "john.doe@example.com",
            fileCount: "20",
            avatar: "/images/p2.png"
        },
        {
            id: "3",
            name: "richard",
            email: "rici@example.com",
            fileCount: "15",
            avatar: "/images/p3.png"
        },
        {
            id: "4",
            name: "Alina Hania",
            email: "example@email.com",
            fileCount: "25",
            avatar: "/images/p1.png"
        },
        {
            id: "5",
            name: "Alina Hania",
            email: "example@email.com",
            fileCount: "25",
            avatar: "/images/p1.png"
        },
        {
            id: "6",
            name: "John Doe",
            email: "john.doe@example.com",
            fileCount: "20",
            avatar: "/images/p2.png"
        },
        {
            id: "7",
            name: "richard",
            email: "rici@example.com",
            fileCount: "15",
            avatar: "/images/p3.png"
        },
        {
            id: "8",
            name: "Alina Hania",
            email: "example@email.com",
            fileCount: "25",
            avatar: "/images/p1.png"
        },

    ]
    const router = useRouter();
    return (
        <div className="flex flex-col gap-6 w-full text-4xl h-full px-15.5">
            <h2 className="text-2xl font-medium py-[3vh] border-b border-b-[#A2A2A2]">People</h2>
            <div className='mt-[2.5vh] flex flex-wrap gap-4'>
                {
                    persons.map((person) => (
                        <Link href={`/cloud/people/${person.id}`} key={person.id}>
                            <article className="flex flex-col gap-[3vh] p-4 bg-white rounded-lg 2xl:w-58 w-43 shadow-[0px_0px_4px_rgba(0,0,0,0.15)]">
                                <header className="flex justify-between items-start w-full text-[10px] font-medium tracking-wide">
                                    <img src={person.avatar} alt="People" className="size-[clamp(3vw,40px,5vw)] rounded-full object-contain aspect-square" />
                                    <p>{person.fileCount} Files</p>
                                </header>

                                <section className="max-w-full">
                                    <h2 className="text-[clamp(1rem,1.3vw,1.5rem)] font-medium text-black">{person.name}</h2>
                                    <p className="mt-1 text-xs 2xl:text-sm font-semibold tracking-normal text-[#74726f]">
                                        {person.email}
                                    </p>
                                </section>
                            </article>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}