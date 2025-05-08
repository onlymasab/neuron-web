"use client";
import Image from "next/image"
import { useState } from "react"
import { PalmTreeIcon } from "../components/icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";


const photos = () => {

  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState("");

  const handleAnimation = (src: string) => {
    setSelectedImageSrc(src);
    setShowAnimation(true);
  };

  const images = [
    {
      id: 1,
      date: "Feb 29",
      src: "/images/img_1.jpg",
      alt: "Image 1",
    },
    {
      id: 2,
      date: "Feb 29",
      src: "/images/img_2.jpg",
      alt: "Image 2",
    },
    {
      id: 3,
      date: "Feb 29",
      src: "/images/img_3.jpg",
      alt: "Image 3",
    },
    {
      id: 4,
      date: "Feb 29",
      src: "/images/img_1.jpg",
      alt: "Image 4",
    },
    {
      id: 5,
      date: "Feb 29",
      src: "/images/img_2.jpg",
      alt: "Image 5",
    },
    {
      id: 6,
      date: "Feb 29",
      src: "/images/img_3.jpg",
      alt: "Image 6",
    },
    {
      id: 7,
      date: "Feb 29",
      src: "/images/img_1.jpg",
      alt: "Image 7",
    },
    {
      id: 8,
      date: "Feb 29",
      src: "/images/img_2.jpg",
      alt: "Image 8",
    },
    {
      id: 9,
      date: "Feb 29",
      src: "/images/img_3.jpg",
      alt: "Image 9",
    },
  ]

  const albums = [
    {
      id: "1",
      src: "/images/img_1.jpg",
      title: "Favorites",
      subtitle: "1 item",
    },
    {
      id: "2",
      src: "/images/img_2.jpg",
      title: "Year 2025",
      subtitle: "Created 2025",
    },
  ]

  return (
    <div className="flex flex-col px-15.5">

      <Tabs defaultValue="gallery">
        <TabsList className="grid w-fit space-x-4 py-[4vh] grid-cols-3 bg-transparent">
          {["gallery", "album", "explore"].map((value) => (
        <TabsTrigger value={value}
        key={value}
          className="relative rounded-lg px-4 py-2 text-[clamp(1rem,1.5vw,1.5rem)]/5 font-semibold cursor-pointer data-[state=active]:bg-[linear-gradient(93deg,_#0D6AFF_4.18%,_#0956D3_78.6%)] data-[state=active]:text-white transition-all data-[state=active]:shadow-none"
        >{value.charAt(0).toUpperCase() + value.slice(1)}</TabsTrigger>
        
          ))}
        </TabsList>
        <TabsContent value="gallery" className="mt-[5vh]">
          <div className="flex flex-col gap-[2vh] h-[70vh]">
            <h2 className="text-[#06367a] font-medium">All Photos</h2>
            <div className="flex flex-wrap justify-between gap-3 overflow-y-scroll no-scrollbar">
              {
                images.map((image, index) => (
                  <div key={index} className="flex w-[17vw] 2xl:w-[18vw] flex-col gap-2 border rounded-lg shadow bg-white">
                    <div className="relative flex justify-between items-center px-2">
                      <span className="text-sm">{image.date}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 bg-transparent hover:bg-transparent focus-visible:ring-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">

                          <DropdownMenuItem>Download</DropdownMenuItem>

                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Convert</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => handleAnimation(image.src)}>DNA</DropdownMenuItem>
                                <DropdownMenuItem>Graphene</DropdownMenuItem>
                                <DropdownMenuItem>Brain Signals</DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>

                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>

                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Image src={image.src} alt={image.alt} width={296} height={300} className="rounded-lg w-full h-[28vh] object-cover" />
                  </div>

                ))
              }
            </div>
            {showAnimation && 
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] transition-all duration-300">
                <div className="w-[60vw] h-[62vh] bg-[#101218] flex flex-col items-center justify-center overflow-hidden rounded-md">
                  {/* Animation goes here */}
                </div>
              </div>
            }
          </div>
        </TabsContent>
        <TabsContent value="album" className="mt-[5vh]">
          <div className="flex flex-col gap-[2vh] h-[70vh]">
            <h2 className="text-[#06367a] font-medium">My albums</h2>
            <div className="flex gap-4 ">
              <div className="w-[14vw] h-[23vh] min-h-[190px] flex flex-col justify-center items-center bg-white gap-[2vh] rounded-lg shadow-[0_0_4px_0_rgba(0,0,0,0.15)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16.25 3C16.9404 3 17.5 3.55964 17.5 4.25V15H28.25C28.9404 15 29.5 15.5596 29.5 16.25C29.5 16.9404 28.9404 17.5 28.25 17.5H17.5V28.25C17.5 28.9404 16.9404 29.5 16.25 29.5C15.5596 29.5 15 28.9404 15 28.25V17.5H4.25C3.55964 17.5 3 16.9404 3 16.25C3 15.5596 3.55964 15 4.25 15H15V4.25C15 3.55964 15.5596 3 16.25 3Z" fill="black" />
                </svg>
                <div>
                  <span className="text-center">Create new album</span>
                  <span className="text-center block text-xs mt-2">Add Photos</span>
                </div>
              </div>
              {
                albums.map((album, index) => (
                  <div key={index} className="w-[14vw] h-[23vh] min-h-[190px] px-6 py-4 flex flex-col justify-end items-start bg-white rounded-lg shadow-[0_0_4px_0_rgba(0,0,0,0.15)]" style={{ background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${album.src}')`, backgroundSize: "cover", backgroundPosition: "center" }}>
                    <h4 className="text-white font-semibold">{album.title}</h4>
                    <span className="text-xs font-medium text-white">{album.subtitle}</span>
                  </div>
                ))
              }
            </div>
          </div>
        </TabsContent>
        <TabsContent value="explore" className="mt-[5vh]">
          <div className="flex flex-col h-[70vh] overflow-y-scroll no-scrollbar">
            <h2 className="text-[#06367a] font-medium">Places</h2>
            <div className="flex items-center justify-center mt-3 gap-19 w-full py-2" style={{ background: "linear-gradient(90deg, rgba(53,130,223,0) 0%, #a8d0ff 30%, #EBFAFF 50%, #a8d0ff 70%, rgba(53,130,223,0) 100%)" }}>
              <div className="size-35 2xl:size-57">
                <PalmTreeIcon />
              </div>
              <div>
                <h4 className="text-[clamp(1rem,1.5vw,1.5rem)] font-semibold">Explore places near and far away</h4>
                <span className="block mt-3 text-xs 2xl:text-sm">Back up photos to view them grouped by location.</span>
              </div>
            </div>
            <div className="mt-[3vh] 2xl:mt-12">
              <h2 className="text-[#06367a] font-medium">Things</h2>
              <div className="w-[14vw] h-[25vh] p-6 rounded-lg mt-3" style={{ background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/images/img_3.jpg')`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
            </div>
            <div className="mt-[3vh] 2xl:mt-12">
              <h2 className="text-[#06367a] font-medium">Categories</h2>
              <div className="flex gap-12 w-full mt-3">
                <div className="w-49 flex px-2.5 py-1 items-center gap-1 rounded-full border border-[#919191]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M13.5 8.5C13.5 7.94772 13.0523 7.5 12.5 7.5C11.9477 7.5 11.5 7.94772 11.5 8.5C11.5 9.05228 11.9477 9.5 12.5 9.5C13.0523 9.5 13.5 9.05228 13.5 8.5ZM8.5 8.5C8.5 7.94772 8.05228 7.5 7.5 7.5C6.94772 7.5 6.5 7.94772 6.5 8.5C6.5 9.05228 6.94772 9.5 7.5 9.5C8.05228 9.5 8.5 9.05228 8.5 8.5ZM8.47361 13.0528C8.22662 12.9293 7.92628 13.0294 7.80279 13.2764C7.67929 13.5234 7.7794 13.8237 8.02639 13.9472C8.60996 14.239 9.3149 14.375 10 14.375C10.6851 14.375 11.39 14.239 11.9736 13.9472C12.2206 13.8237 12.3207 13.5234 12.1972 13.2764C12.0737 13.0294 11.7734 12.9293 11.5264 13.0528C11.11 13.261 10.5649 13.375 10 13.375C9.4351 13.375 8.89004 13.261 8.47361 13.0528ZM18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10ZM3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10Z" fill="#0D6AFF" />
                  </svg>
                  <span className="text-[11px]">Selfies</span>
                </div>
                <div className="w-49 flex px-2.5 py-1 items-center gap-1 rounded-full border border-[#919191]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M8.76512 7.07608C8.61099 6.97969 8.41669 6.97454 8.25768 7.06264C8.09867 7.15075 8 7.31821 8 7.5V12.65C8 12.8341 8.10118 13.0033 8.26337 13.0905C8.42557 13.1776 8.62252 13.1685 8.77603 13.0669L12.776 10.4185C12.9178 10.3246 13.0022 10.1651 13 9.99508C12.9978 9.82505 12.9093 9.6678 12.7651 9.57764L8.76512 7.07608ZM4.5 3C3.11929 3 2 4.11929 2 5.5V14.5C2 15.8807 3.11929 17 4.5 17H15.5C16.8807 17 18 15.8807 18 14.5V5.5C18 4.11929 16.8807 3 15.5 3H4.5ZM3 5.5C3 4.67157 3.67157 4 4.5 4H15.5C16.3284 4 17 4.67157 17 5.5V14.5C17 15.3284 16.3284 16 15.5 16H4.5C3.67157 16 3 15.3284 3 14.5V5.5Z" fill="#0D6AFF" />
                  </svg>
                  <span className="text-[11px]">Videos</span>
                </div>
                <div className="w-49 flex px-2.5 py-1 items-center gap-1 rounded-full border border-[#919191]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 5C3 3.89543 3.89543 3 5 3H12C13.1046 3 14 3.89543 14 5V12H17V14C17 15.6569 15.6569 17 14 17H6C4.34315 17 3 15.6569 3 14V5ZM14 13V16C15.1046 16 16 15.1046 16 14V13H14ZM13 16V5C13 4.44772 12.5523 4 12 4H5C4.44772 4 4 4.44772 4 5V14C4 15.1046 4.89543 16 6 16H13ZM6 6.5C6 6.22386 6.22386 6 6.5 6H10.5C10.7761 6 11 6.22386 11 6.5C11 6.77614 10.7761 7 10.5 7H6.5C6.22386 7 6 6.77614 6 6.5ZM6 9.5C6 9.22386 6.22386 9 6.5 9H10.5C10.7761 9 11 9.22386 11 9.5C11 9.77614 10.7761 10 10.5 10H6.5C6.22386 10 6 9.77614 6 9.5ZM6 12.5C6 12.2239 6.22386 12 6.5 12H8.5C8.77614 12 9 12.2239 9 12.5C9 12.7761 8.77614 13 8.5 13H6.5C6.22386 13 6 12.7761 6 12.5Z" fill="#0D6AFF" />
                  </svg>
                  <span className="text-[11px]">Receipts</span>
                </div>
                <div className="w-49 flex px-2.5 py-1 items-center gap-1 rounded-full border border-[#919191]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M6 2C4.89543 2 4 2.89543 4 4V16C4 17.1046 4.89543 18 6 18H14C15.1046 18 16 17.1046 16 16V7.41421C16 7.01639 15.842 6.63486 15.5607 6.35355L11.6464 2.43934C11.3651 2.15804 10.9836 2 10.5858 2H6ZM5 4C5 3.44772 5.44772 3 6 3H10V6.5C10 7.32843 10.6716 8 11.5 8H15V16C15 16.5523 14.5523 17 14 17H6C5.44772 17 5 16.5523 5 16V4ZM14.7929 7H11.5C11.2239 7 11 6.77614 11 6.5V3.20711L14.7929 7Z" fill="#0D6AFF" />
                  </svg>
                  <span className="text-[11px]">Documents</span>
                </div>
                <div className="w-49 flex px-2.5 py-1 items-center gap-1 rounded-full border border-[#919191]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 5.75C3 4.23122 4.23122 3 5.75 3H14.25C15.7688 3 17 4.23122 17 5.75V14.25C17 15.7688 15.7688 17 14.25 17H5.75C4.23122 17 3 15.7688 3 14.25V5.75ZM5.75 4C4.7835 4 4 4.7835 4 5.75V14.25C4 15.2165 4.7835 16 5.75 16H14.25C15.2165 16 16 15.2165 16 14.25V5.75C16 4.7835 15.2165 4 14.25 4H5.75ZM6.5 6C6.22386 6 6 6.22386 6 6.5V8.5C6 8.77614 5.77614 9 5.5 9C5.22386 9 5 8.77614 5 8.5V6.5C5 5.67157 5.67157 5 6.5 5H8.5C8.77614 5 9 5.22386 9 5.5C9 5.77614 8.77614 6 8.5 6H6.5ZM6 13.5C6 13.7761 6.22386 14 6.5 14H8.5C8.77614 14 9 14.2239 9 14.5C9 14.7761 8.77614 15 8.5 15H6.5C5.67157 15 5 14.3284 5 13.5V11.5C5 11.2239 5.22386 11 5.5 11C5.77614 11 6 11.2239 6 11.5V13.5ZM13.5 6C13.7761 6 14 6.22386 14 6.5V8.5C14 8.77614 14.2239 9 14.5 9C14.7761 9 15 8.77614 15 8.5V6.5C15 5.67157 14.3284 5 13.5 5H11.5C11.2239 5 11 5.22386 11 5.5C11 5.77614 11.2239 6 11.5 6H13.5ZM14 13.5C14 13.7761 13.7761 14 13.5 14H11.5C11.2239 14 11 14.2239 11 14.5C11 14.7761 11.2239 15 11.5 15H13.5C14.3284 15 15 14.3284 15 13.5V11.5C15 11.2239 14.7761 11 14.5 11C14.2239 11 14 11.2239 14 11.5V13.5Z" fill="#0D6AFF" />
                  </svg>
                  <span className="text-[11px]">Screenshots</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

    </div>
  )
}

export default photos