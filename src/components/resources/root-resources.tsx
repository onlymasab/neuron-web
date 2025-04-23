"use client";

import Image from "next/image"
import { useState, useRef } from "react";

const RootResources = () => {
    const resource = [
        {
            type: "Blog",
            title: "New look for Neuron for personal use",
            image: "/images/r1.png",
        },
        {
            type: "Article",
            title: "Cool things you can do with cloud backup",
            image: "/images/r2.png",
        },
        {
            type: "Article",
            title: "5 Simple steps to secure your cloud storage",
            image: "/images/r3.png",
        },
        {
            type: "Article",
            title: "How cloud-based projects in Neuron bring the Waltons together",
            image: "/images/r2.png",
        },
    ]

    const containerRef = useRef<HTMLDivElement>(null);
    const [activeButton, setActiveButton] = useState<"left" | "right" | null>(null);

    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: -200, // Adjust scroll distance as needed
                behavior: 'smooth',
            });
            setActiveButton('left');
        }
    };

    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: 200, // Adjust scroll distance as needed
                behavior: 'smooth',
            });
            setActiveButton('right');
        }
    };

    return (
        <div id="resources" className='w-full mt-30'>
            <div className='container mx-auto px-4 sm:px-10'>
                <div className='flex flex-col gap-16 items-start'>

                    {/* Title */}
                    <div className="max-lg:text-center">
                        <h1 className="text-[#74726f] font-medium text-base/6">RESOURCES</h1>
                        <h2 className="text-[#121211] text-[40px]/13 font-semibold mt-4">Discover more about Neuron</h2>
                    </div>

                    {/* Cards */}
                    <div ref={containerRef} className="flex gap-6 w-full overflow-x-scroll scroll-smooth no-scrollbar p-4 ">
                        {
                            resource.map((item, index) => (
                                <div key={index} className="flex flex-col p-1 rounded-[28px] shadow-[0_4px_12px_2px_rgba(0,0,0,0.15)] min-w-[80vw] sm:min-w-sm xl:min-w-[488px] ">
                                    <div className="max-w-[488px] max-h-[209px]">
                                        <Image src={item.image} alt="resources" height={209} width={488} className="rounded-[24px] h-auto" />
                                    </div>
                                    <div className="flex flex-col p-6 gap-8 justify-between">
                                        <div>
                                            <span className="text-[#74726f] text-xs">{item.type}</span>
                                            <p className="text-[#121211] text-lg/7 font-semibold">{item.title}</p>
                                        </div>
                                        <div className="flex gap-3 items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 25" fill="none">
                                                <path d="M6 19.3941L19 6.39404M19 6.39404V18.8741M19 6.39404H6.52" stroke="#121211" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <a href="#" className="text-[#121211] text-sm font-medium hover:underline">Learn more</a>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                        {/* Left/Right Arrows */}
                    <div className="flex gap-4 items-center -mt-3 justify-center w-full">
                        <button onClick={scrollLeft} className={`size-12 flex items-center justify-center p-2 border rounded-full  ${activeButton == 'left' ? "border-[#121211]" : "border-[#74726f]"} `}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="35" viewBox="0 0 34 35" fill="none">
                                <g clipPath="url(#clip0_995_5084)">
                                    <path d="M26.1924 16.687L7.80765 16.687M7.80765 16.687L16.6324 7.86232M7.80765 16.687L16.6323 25.5117" stroke={activeButton == 'left' ? "#121211" : "#74726f"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_995_5084">
                                        <rect width="24" height="24" fill="white" transform="translate(17 34.3647) rotate(-135)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                        <button onClick={scrollRight} className={`size-12 flex items-center justify-center p-2 border rounded-full ${activeButton == 'right' ? "border-[#121211]" : "border-[#74726f]"} `}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="35" viewBox="0 0 34 35" fill="none">
                                <g clipPath="url(#clip0_995_5077)">
                                    <path d="M7.80758 18.1011L26.1924 18.101M26.1924 18.101L17.3676 26.9258M26.1924 18.101L17.3677 9.27639" stroke={activeButton == 'right' ? "#121211" : "#74726f"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_995_5077">
                                        <rect width="24" height="24" fill="white" transform="translate(17 0.42334) rotate(45)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RootResources