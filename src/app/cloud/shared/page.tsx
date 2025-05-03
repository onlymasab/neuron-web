"use client";
import Image from "next/image";
import { useState } from "react";
import SharedHeader from "../components/shared_header";
import RecentFiles from "../components/recentFiles";

const shared = () => {
  const [data, setData] = useState([1,2,3]);

  return (
    <>
      <div className="w-full h-full">
        <div className=" pl-10 pr-5 2xl:px-15.5 flex flex-col h-full">
          <div className=" py-[4.5vh]">
            <SharedHeader id="shared" />
          </div>
          <div className="flex items-center justify-center h-full">
            {
              !data.length ? (
                <div className="flex flex-col items-center justify-center text-2xl">
                  <span className="text-[clamp(1rem,2vw,2rem)] font-semibold">Shared files will show up here.</span>
                  <Image src="/images/share_img.png" alt="Share" width={256} height={256} className="size-[13vw]" />
                </div>
              ) : (
                <div className="w-full overflow-y-scroll no-scrollbar h-[70vh]">
                  <RecentFiles id="memory"/>
                </div>
              )
            }
          </div>
        </div>
      </div>

    </>
  )
}

export default shared