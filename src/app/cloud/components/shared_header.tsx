"use client";
import React, { useState } from "react";
import { AudioIcon, DocumentIcon, FolderIcon, ImageIcon, VideoIcon } from "./icons";

interface SharedHeaderProps {
    id: string;
}

const SharedHeader = ({ id }: SharedHeaderProps) => {

    const [activeTab, setActiveTab] = useState<"with-you" | "by-you">("with-you");

    const handleTabChange = (tab: "with-you" | "by-you") => {
        setActiveTab(tab);
    };

    const [filterOptions, setFilterOptions] = useState([
        { id: "all", label: "All", isActive: true, icon: null },
        { id: "folder", label: "Folder", isActive: false, icon: <FolderIcon /> },
        { id: "image", label: "Image", isActive: false, icon: <ImageIcon /> },
        { id: "video", label: "Video", isActive: false, icon: <VideoIcon /> },
        { id: "audio", label: "Audio", isActive: false, icon: <AudioIcon /> },
        { id: "document", label: "Document", isActive: false, icon: <DocumentIcon /> },
        { id: "filter", label: "Filter by name and person", isActive: false, icon: null },
    ]);

    const handleFilterOptions = (optionId: string) => {
        setFilterOptions((prevOptions) =>
            prevOptions.map((option) =>
                option.id === optionId
                    ? { ...option, isActive: true }
                    : { ...option, isActive: false }
            )
        );
    };
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-[1.3vw] w-full">
                {
                    id === "shared" && (
                        <nav className="flex gap-[0.8vw] items-center text-[clamp(1rem,1.3vw,1.5rem)] font-semibold leading-none">
                            <button
                                className={`self-stretch p-2.5 ${activeTab === "with-you"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-[#181818]"
                                    }`}
                                onClick={() => handleTabChange("with-you")}
                            >
                                With you
                            </button>
                            <button
                                className={`self-stretch p-2.5 ${activeTab === "by-you"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-[#181818]"
                                    }`}
                                onClick={() => handleTabChange("by-you")}
                            >
                                By you
                            </button>
                        </nav>
                    ) 
            }
                <div className="flex gap-[1vw] text-base text-black whitespace-nowrap grow">
                    {filterOptions.map((option) => (
                        <button
                            key={option.id}
                            className={`px-4 py-1 border rounded-full flex cursor-pointer gap-1 justify-center items-center  ${option.isActive ? " border-[#0d6aff] bg-[rgba(13,106,255,0.09)]" : "border-[rgba(116,114,111,0.30)] bg-[rgba(116,114,111,0.10)]"} ${option.id === "filter" ? "ml-auto" : ""}`}
                            onClick={() => handleFilterOptions(option.id)}
                        >
                            {option.icon ? (
                                <>
                                    {option.icon}
                                    <span className="max-2xl:text-xs max-2xl:font-medium">{option.label}</span>
                                </>
                            ) : (
                                <span className="max-2xl:text-xs  max-2xl:font-medium">{option.label}</span>

                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SharedHeader