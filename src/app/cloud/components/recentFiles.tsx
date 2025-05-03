"use client";
import { useState } from "react";
import { ChevronIcon } from "./icons";

interface RecentFilesProps {
    id: string;
}

const RecentFiles = ({ id }: RecentFilesProps) => {
    const [recentFiles, setRecentFiles] = useState([
        {
            id: "1",
            src: "/images/folder.png",
            name: "Desktop",
            modifiedDate: "Sep 17, 2024",
            size: "38.9 MB",
            checked: false,
            deleteDate: "Aug 24, 2024"
        },
        {
            id: "2",
            src: "/images/folder.png",
            name: "Documents",
            modifiedDate: "Sep 25, 2024",
            size: "58.9 MB",
            checked: false,
            deleteDate: "Aug 24, 2024"
        },
        {
            id: "3",
            src: "/images/folder.png",
            name: "Desktop",
            modifiedDate: "Sep 17, 2024",
            size: "38.9 MB",
            checked: false,
            deleteDate: "Aug 24, 2024"
        },
        {
            id: "4",
            src: "/images/folder.png",
            name: "Desktop",
            modifiedDate: "Sep 17, 2024",
            size: "38.9 MB",
            checked: false,
            deleteDate: "Aug 24, 2024"
        },
        {
            id: "5",
            src: "/images/folder.png",
            name: "Desktop",
            modifiedDate: "Sep 17, 2024",
            size: "38.9 MB",
            checked: false,
            deleteDate: "Aug 24, 2024"
        },
        {
            id: "6",
            src: "/images/folder.png",
            name: "Desktop",
            modifiedDate: "Sep 17, 2024",
            size: "38.9 MB",
            checked: false,
            deleteDate: "Aug 24, 2024"
        },
        {
            id: "7",
            src: "/images/folder.png",
            name: "Desktop",
            modifiedDate: "Sep 17, 2024",
            size: "38.9 MB",
            checked: false,
            deleteDate: "Aug 24, 2024"
        },
    ])

    const toggleCheckbox = (index: number) => {
        setRecentFiles((prev) =>
            prev.map((item, i) => (
                i === index ? { ...item, checked: !item.checked } : item
            )))
    };

    const toggleSelectAll = () => {
        const areAllChecked = recentFiles.every(item => item.checked);
        setRecentFiles(prev =>
            prev.map(item => ({ ...item, checked: !areAllChecked }))
        );
    };
    return (
        <div className="w-full flex flex-col gap-2 h-full">
            <div className="flex gap-4 justify-between items-center py-[clamp(1vh,1.5vh,2vh)] max-2xl:pl-8 px-6 bg-white rounded-md">
                <button onClick={() => toggleSelectAll()} className="pr-8 active:scale-90 transition-all duration-300">
                    {
                        recentFiles.every(item => item.checked) ? (<svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#0956d3" strokeWidth="1.5"><path fillRule="evenodd" clipRule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM7.53044 11.9697C7.23755 11.6768 6.76268 11.6768 6.46978 11.9697C6.17689 12.2626 6.17689 12.7374 6.46978 13.0303L9.46978 16.0303C9.76268 16.3232 10.2376 16.3232 10.5304 16.0303L17.5304 9.03033C17.8233 8.73744 17.8233 8.26256 17.5304 7.96967C17.2375 7.67678 16.7627 7.67678 16.4698 7.96967L10.0001 14.4393L7.53044 11.9697Z" fill="#0956d3"></path></svg>)
                            : (<svg width="16px" height="16px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>)
                    }
                </button>
                <div className="flex flex-1 gap-6 items-center">
                    <div className="max-2xl:size-4.5 size-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="none">
                            <path d="M6 2C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V9.82777C20 9.29733 19.7893 8.78863 19.4142 8.41355L13.5864 2.58579C13.2114 2.21071 12.7027 2 12.1722 2H6ZM5.5 4C5.5 3.72386 5.72386 3.5 6 3.5H12V8C12 9.10457 12.8954 10 14 10H18.5V20C18.5 20.2761 18.2761 20.5 18 20.5H6C5.72386 20.5 5.5 20.2761 5.5 20V4ZM17.3793 8.5H14C13.7239 8.5 13.5 8.27614 13.5 8V4.62066L17.3793 8.5Z" fill="#242424" />
                        </svg>
                    </div>
                    <div className="flex gap-3 items-center">
                        <span className="text-sm 2xl:text-lg font-medium">Name</span>
                        <ChevronIcon />
                    </div>
                </div>
                <div className="flex flex-1 gap-3 items-center">
                    <span className="text-sm 2xl:text-lg font-medium">{id === "trash" ? "Delete Data" : "Modified"}</span>
                    <ChevronIcon />
                </div>
                <div className="flex flex-1 gap-3 items-center">
                    <span className="text-sm 2xl:text-lg font-medium">File size</span>
                    <ChevronIcon />
                </div>
                {
                    id === "memory" && (
                        <div className="flex flex-1 gap-3 items-center">
                            <span className="text-sm 2xl:text-lg font-medium">Sharing</span>
                            <ChevronIcon />
                        </div>
                    )
                }
            </div>

            <div className="flex flex-col gap-1 overflow-y-scroll no-scrollbar">
                {
                    recentFiles.map((item, index) => (
                        <div key={index} className="flex items-center gap-12 py-[clamp(1vh,1.5vh,2vh)] px-6 max-2xl:pl-8 bg-white rounded-md">
                            <button onClick={() => toggleCheckbox(index)} className="active:scale-90 transition-all duration-300">
                                {
                                    item.checked ? (<svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#0956d3" strokeWidth="1.5"><path fillRule="evenodd" clipRule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM7.53044 11.9697C7.23755 11.6768 6.76268 11.6768 6.46978 11.9697C6.17689 12.2626 6.17689 12.7374 6.46978 13.0303L9.46978 16.0303C9.76268 16.3232 10.2376 16.3232 10.5304 16.0303L17.5304 9.03033C17.8233 8.73744 17.8233 8.26256 17.5304 7.96967C17.2375 7.67678 16.7627 7.67678 16.4698 7.96967L10.0001 14.4393L7.53044 11.9697Z" fill="#0956d3"></path></svg>)
                                        : (<svg width="16px" height="16px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>)
                                }
                            </button>
                            <div className="flex gap-4 justify-between items-center w-full ">
                                <div className="flex flex-1 gap-6 items-center">
                                    <div className="max-2xl:size-5 size-6">

                                        <img src={item.src} alt="" className="w-full h-full object-cover" />

                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <span className="text-sm 2xl:text-lg font-medium">{item.name}</span>
                                    </div>
                                </div>
                                {
                                    id === "trash" ? (
                                        <div className="flex flex-1 items-center">
                                            <span className="text-sm  font-semibold text-[#74726f]">{item.deleteDate}</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-1 items-center">
                                            <span className="text-sm  font-semibold text-[#74726f]">{item.modifiedDate}</span>
                                        </div>
                                    )
                                }
                                <div className="flex flex-1 items-center">
                                    <span className="text-sm  font-semibold text-[#74726f]">{item.size}</span>
                                </div>
                                {
                                    id === "memory" && (
                                        <div className="flex flex-1 items-center">
                                            <img src="/images/p1.png" alt="People" className="size-8 rounded-full" />
                                            <img src="/images/p2.png" alt="People" className="size-8 rounded-full -ml-1.5" />
                                            <img src="/images/p3.png" alt="People" className="size-8 rounded-full -ml-1.5" />
                                            <div className="size-8 rounded-full -ml-1.5 bg-[#e1e1e1] flex items-center justify-center text-xs text-[#484848] font-semibold">+2</div>
                                        </div>
                                    )
                                }

                            </div>
                        </div>
                    ))
                }
            </div>

        </div>
    )
}

export default RecentFiles