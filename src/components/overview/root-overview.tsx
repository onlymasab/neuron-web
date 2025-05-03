"use client"
import Image from "next/image";
import { useState } from "react";
const RootOverview = () => {

    const [dropdownOpen, setDropdownOpen] = useState<number | null>(0);

    const toggle = (index: number) => {
        setDropdownOpen(dropdownOpen === index ? null : index);
    };

    const features = [
        {
            title: "For your desktop",
            description: "Back up your important files, photos, apps, and settings so they're available no matter what happens to your device."
        },
        {
            title: "For your Browser",
            description: "Back up your important files, photos, apps, and settings so they're available no matter what happens to your device."
        },
        {
            title: "For your PWA",
            description: "Back up your important files, photos, apps, and settings so they're available no matter what happens to your device."
        },
    ]

    return (
        <div id="overview" className="w-full flex flex-col gap-8 mt-14">
            <div>
                <h1 className="font-medium text-base/6">OVERVIEW</h1>
                <h2 className="text-[40px] font-semibold mt-4">Securely save and share whats important</h2>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
                <div className="px-5 py-2 bg-[#121211] rounded-[56px] text-white font-medium">Backup and Protect</div>
                <div className="px-5 py-2 bg-[#e7e5e2] rounded-[56px] font-medium">Access from anywhere</div>
                <div className="px-5 py-2 bg-[#e7e5e2] rounded-[56px] font-medium">Rediscover and share</div>
                <div className="px-5 py-2 bg-[#e7e5e2] rounded-[56px] font-medium">AI in Neuron</div>
            </div>

            <div className="flex justify-between max-lg:flex-col-reverse max-2xl:gap-25">
                <div className="flex w-[394px] flex-col gap-12">
                    {
                        features.map((feature, index) => (
                            <div key={index} className="border-l-[2px] border-l-[#121211] pl-8 ">
                                <div className="flex flex-col gap-9 border-b border-b-[#999793] pb-12">
                                    <button onClick={() => toggle(index)} className="flex items-center gap-4">
                                        <h4>{feature.title}</h4>
                                        <div>
                                            <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform duration-300 ${dropdownOpen === index ? "rotate-180" : ""}`}>
                                                <path d="M0 0.5C0 0.364583 0.0494792 0.247396 0.148438 0.148438C0.247396 0.0494792 0.364583 0 0.5 0C0.635417 0 0.752604 0.0494792 0.851562 0.148438L6 5.28906L11.1484 0.148438C11.2474 0.0494792 11.3646 0 11.5 0C11.6354 0 11.7526 0.0494792 11.8516 0.148438C11.9505 0.247396 12 0.364583 12 0.5C12 0.635417 11.9505 0.752604 11.8516 0.851562L6.35156 6.35156C6.2526 6.45052 6.13542 6.5 6 6.5C5.86458 6.5 5.7474 6.45052 5.64844 6.35156L0.148438 0.851562C0.0494792 0.752604 0 0.635417 0 0.5Z" fill="#121211" />
                                            </svg>
                                        </div>
                                    </button>
                                    {
                                        dropdownOpen === index && (
                                            <>
                                                <p className="text-[#74726f] font-medium">{feature.description}</p>
                                                <a href="" className="text-[#121211] text-sm font-medium underline cursor-pointer">Learn more</a>
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>

                <div>
                    <Image src="/images/overview_img.png" alt="overview" width={930} height={600}/>
                </div>
            </div>
        </div>
    )
}

export default RootOverview