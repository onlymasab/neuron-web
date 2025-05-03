"use client";
import { useState } from "react"
import RecentFiles from "../components/recentFiles"
import { ChevronIcon } from "../components/icons"


const files = () => {
  const [data, setData] = useState([])
  return (
    <div className="flex flex-col gap-6 w-full text-4xl h-full px-15.5">
      <h2 className="text-2xl font-medium py-[4vh]">My Files</h2>
      {
        !data.length ? (
          <div className="flex gap-4 justify-between items-center py-[clamp(1vh,1.5vh,2vh)] max-2xl:pl-8 px-6 bg-white rounded-xl">
            <button disabled className="pr-8">
              <svg width="16px" height="16px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>

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
              <span className="text-sm 2xl:text-lg font-medium">Modified</span>
              <ChevronIcon />
            </div>
            <div className="flex flex-1 gap-3 items-center">
              <span className="text-sm 2xl:text-lg font-medium">File size</span>
              <ChevronIcon />
            </div>
            <div className="flex flex-1 gap-3 items-center">
              <span className="text-sm 2xl:text-lg font-medium">Sharing</span>
              <ChevronIcon />
            </div>
          </div>
        ) : (
          <div className="h-[70vh]">
            <RecentFiles id="memory"/>
          </div>
        )
      }

    </div>
  )
}

export default files