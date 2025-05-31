"use client";

import { useEffect, useMemo, useState } from "react";
import { PalmTreeIcon } from "../components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import convertToDNA from "../components/convertToDNA";
import convertToBrainSignals from "../components/convertToBrain";
import convertToGraphene from "../components/convertToGraphene";
import ConversionModal from "../components/ConversionModal";
import Image from "next/image";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCloudStore } from "@/stores/useCloudStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Photos = () => {
  const router = useRouter();

  const { user } = useAuthStore();
  const { files, fetchFiles } = useCloudStore();

  const [showConversionModal, setShowConversionModal] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState("");
  const [animationSrc, setAnimationSrc] = useState("");
  const [progress, setProgress] = useState(0);
  const [conversionDone, setConversionDone] = useState(false);
  const [animatedText, setAnimatedText] = useState(""); // 🆕 added
  const [currentAnimation, setCurrentAnimation] = useState(""); // 🆕 added

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user?.id) {
      router.push("/");
    }
  }, [user, router]);

  // Fetch files for authenticated user
  useEffect(() => {
    if (user?.id) {
      fetchFiles(user.id).catch((error) =>
        toast.error(`Failed to fetch recent files: ${error.message}`)
      );
    }
  }, [user, fetchFiles]);

  // Memoize recent images for Carousel
  const recentImages = useMemo(
    () =>
      files
        .filter((file) => file.type === "image" && !file.is_trashed && file.file_url)
        .map((file) => ({
          id: file.id,
          src: file.file_url,
          throwback: `Uploaded on ${new Date(file.created_at!).toLocaleDateString()}`,
          date: new Date(file.created_at!).getFullYear().toString(),
        })),
    [files]
  );

  useEffect(() => {
    if (!showAnimation) return;

    let start = Date.now();
    let progressInterval: NodeJS.Timeout;

    progressInterval = setTimeout(() => {
      progressInterval = setInterval(() => {
        const elapsed = Date.now() - start;
        const percent = Math.min((elapsed / 10000) * 90, 90); // cap at 90%
        setProgress(Math.round(percent));
      }, 100);
    }, 500); // start after 0.5s

    return () => clearInterval(progressInterval);
  }, [showAnimation]);

   const handleConvert = (type: "dna" | "graphene" | "brain", src: string) => {
  let animationVideo = "";
  let stages = [];

  switch (type) {
    case "dna":
      animationVideo = "/videos/DNA_Animation.mp4";
      stages = [
        { text: "Initializing DNA analysis...", duration: 1500, animation: "pulse" },
        { text: "Scanning molecular structure...", duration: 1500, animation: "ripple" },
        { text: "Mapping genome blueprint...", duration: 2000, animation: "wave" },
        { text: "Encoding base pairs...", duration: 1500, animation: "shimmer" },
        { text: "Simulating synthetic strands...", duration: 2000, animation: "spark" },
        { text: "Validating genetic sequence...", duration: 1500, animation: "glow" },
        { text: "Finalizing DNA encryption...", duration: 1000, animation: "flicker" },
      ];
      break;
    case "graphene":
      animationVideo = "/videos/Graphene_Animation.mp4";
      stages = [
        { text: "Preparing carbon lattice...", duration: 1500, animation: "pulse" },
        { text: "Aligning atomic layers...", duration: 1500, animation: "ripple" },
        { text: "Weaving graphene matrix...", duration: 2000, animation: "wave" },
        { text: "Synthesizing ultra-thin sheets...", duration: 1500, animation: "shimmer" },
        { text: "Applying tensile stress test...", duration: 2000, animation: "spark" },
        { text: "Analyzing electron flow...", duration: 1500, animation: "glow" },
        { text: "Finalizing graphene conversion...", duration: 1000, animation: "flicker" },
      ];
      break;
    case "brain":
      animationVideo = "/videos/Brain_Animation.mp4";
      stages = [
        { text: "Initializing neural scan...", duration: 1500, animation: "pulse" },
        { text: "Detecting synaptic signals...", duration: 1500, animation: "ripple" },
        { text: "Mapping cortical patterns...", duration: 2000, animation: "wave" },
        { text: "Encoding bioelectrical data...", duration: 1500, animation: "shimmer" },
        { text: "Synchronizing hemispheric nodes...", duration: 2000, animation: "spark" },
        { text: "Analyzing neurotransmission...", duration: 1500, animation: "glow" },
        { text: "Finalizing brain signal sync...", duration: 1000, animation: "flicker" },
      ];
      break;
  }

  setAnimationSrc(animationVideo);
  setSelectedImageSrc(src);
  setShowConversionModal(true);
  setShowAnimation(true);
  setProgress(0);
  setConversionDone(false);

  let totalElapsed = 0;

  stages.forEach((stage, index) => {
    totalElapsed += stage.duration;
    setTimeout(() => {
      setAnimatedText(stage.text);
      setCurrentAnimation(stage.animation);

      const progressValue = Math.min(
        Math.round(((index + 1) / stages.length) * 90),
        90
      );
      setProgress(progressValue);
    }, totalElapsed);
  });

  const finish = () => {
    setConversionDone(true);
    const remaining = Math.max(0, 10000 - totalElapsed);

    setTimeout(() => {
      setProgress(100);
      setAnimatedText("Conversion Complete!");
      setCurrentAnimation("none");
      setTimeout(() => {
        setShowAnimation(false);
      }, 1200);
    }, remaining);
  };

  switch (type) {
    case "dna":
      convertToDNA(src, finish);
      break;
    case "graphene":
      convertToGraphene(src, finish);
      break;
    case "brain":
      convertToBrainSignals(src, finish);
      break;
  }
};

  return (
    <div className="flex flex-col px-15.5">
      <Tabs defaultValue="gallery">
        <TabsList className="grid w-fit space-x-4 py-[4vh] grid-cols-3 bg-transparent">
          {["gallery", "album", "explore"].map((value) => (
            <TabsTrigger
              value={value}
              key={value}
              className="relative rounded-lg px-4 py-2 text-[clamp(1rem,1.5vw,1.5rem)]/5 font-semibold cursor-pointer data-[state=active]:bg-[linear-gradient(93deg,_#0D6AFF_4.18%,_#0956D3_78.6%)] data-[state=active]:text-white transition-all data-[state=active]:shadow-none"
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="gallery" className="mt-[5vh]">
          <div className="flex flex-col gap-[2vh] h-[70vh]">
            <h2 className="text-[#06367a] font-medium">All Photos</h2>

            <div className="flex flex-wrap gap-3 overflow-y-scroll no-scrollbar">
              {recentImages.map((image, index) => (
                <div
                  key={index}
                  className="flex w-[17vw] 2xl:w-[18vw] flex-col gap-2 border rounded-lg shadow bg-white"
                >
                  <div className="relative flex justify-between items-center px-2">
                    <span className="text-sm">{image.date}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 bg-transparent cursor-pointer hover:bg-transparent focus-visible:ring-0"
                        >
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
                              <DropdownMenuItem onClick={() => handleConvert("dna", image.src)}>DNA</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleConvert("graphene", image.src)}>Graphene</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleConvert("brain", image.src)}>Brain Signals</DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <Image
                    src={image.src}
                    alt={image.id}
                    width={296}
                    height={300}
                    className="rounded-lg w-full h-[28vh] object-cover"
                  />
                </div>
              ))}
            </div>

            {showConversionModal && (
              <ConversionModal
                videoSrc={animationSrc}
                progressBar={progress}
                animatedText={animatedText}
                animationClass={currentAnimation}
                showAnimation={showAnimation}
                conversionDone={conversionDone}
                onClose={() => {
                  setShowConversionModal(false);
                }}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Photos;