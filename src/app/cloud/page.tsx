"use client";
import Image from "next/image";
import { useState } from "react";
import RecentFiles from "./components/recentFiles";


export default function Home() {
    const [data, setData] = useState([1, 2, 3]);

    const recentImages = [
        {
            id: "1",
            src: "/images/img_1.jpg",
            throwback: "On this day",
            date: "throughout the photos",
        },
        {
            id: "2",
            src: "/images/img_2.jpg",
            throwback: "Last week",
            date: "throughout the year",
        },
        {
            id: "3",
            src: "/images/img_3.jpg",
            throwback: "On this September",
            date: "2025",
        },
        {
            id: "4",
            src: "/images/img_4.jpg",
            throwback: "Full Year",
            date: "2025",
        },
        {
            id: "5",
            src: "/images/img_1.jpg",
            throwback: "Full Year",
            date: "2025",
        },
        {
            id: "6",
            src: "/images/img_2.jpg",
            throwback: "Last week",
            date: "throughout the year",
        },
    ]
 
    return (
        <>
            {
                !data.length ? (
                    <div className="flex flex-col items-center justify-center text-2xl h-full">
                        <span className="text-[22px] font-medium">Your recent files will show up here.</span>
                        <Image src="/images/recentFiles.png" alt="Cloud" width={200} height={200} />
                    </div>
                ) : (
                    <div className="w-full px-15.5">
                        <div className="py-[4.5vh] flex flex-col gap-[2vh]">
                            <h2 className="text-[clamp(1rem,1.5vw,1.5rem)] font-medium">For you</h2>
                            <div className="w-full flex gap-6 overflow-x-scroll no-scrollbar">
                                {
                                    recentImages.map((frame, index) => (
                                        <div key={index} className="min-w-[19vw] h-[25vh] 2xl:h-[23vh] p-4 flex flex-col gap-1 justify-end items-start rounded-2xl" style={{ background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${frame.src}')`, backgroundSize: "cover", backgroundPosition: "center" }}>
                                            <h4 className="text-white font-semibold">{frame.throwback}</h4>
                                            <span className="text-xs font-medium text-white">{frame.date}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="flex flex-col gap-[2vh] h-[40vh]">
                            <h2 className="text-[clamp(1rem,1.5vw,1.5rem)] font-medium">For you</h2>
                            <RecentFiles id="memory"/>
                        </div>
                    </div >
                )
            }
        </>
    );
}