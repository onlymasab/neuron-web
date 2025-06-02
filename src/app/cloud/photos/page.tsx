"use client";
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
// import { PalmTreeIcon, Plus } from "";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MapPin, Smile, Video, FileText, Camera, Grid } from "lucide-react";
import convertToDNA from "../components/convertToDNA";
import convertToBrainSignals from "../components/convertToBrain";
import convertToGraphene from "../components/convertToGraphene";
import ConversionModal from "../components/ConversionModal";
import { useCloudStore } from "@/stores/useCloudStore";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// Enhanced design system constants
const styles = {
  colors: {
    primary: "#0D6AFF",
    primaryLight: "#E6F0FF",
    primaryDark: "#0956D3",
    text: "#1F2937",
    textLight: "#6B7280",
    background: "#F9FAFB",
    cardBackground: "#FFFFFF",
    border: "#E5E7EB",
  },
  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
  },
  radii: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
  },
  transitions: {
    default: "all 0.2s ease-in-out",
  },
};

const PhotosPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { files, fetchFiles, updateFile, deleteFile } = useCloudStore();
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState("");
  const [animationSrc, setAnimationSrc] = useState("");
  const [progress, setProgress] = useState(0);
  const [conversionDone, setConversionDone] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user?.id) {
      router.push("/");
    }
  }, [user, router]);

  // Fetch files for authenticated user
  useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      fetchFiles(user.id)
        .catch((error) => {
          toast.error(`Failed to fetch photos: ${error.message}`);
        })
        .finally(() => {
          setTimeout(() => setIsLoading(false), 500); // Smooth loading transition
        });
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
          date: new Date(file.created_at!).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' }),
        })),
    [files]
  );

  useEffect(() => {
    if (!showAnimation) return;

    let start = Date.now();
    let interval: NodeJS.Timeout;

    // Visual progress (up to 90%)
    interval = setTimeout(() => {
      interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const percent = Math.min((elapsed / 10000) * 99, 99); // cap at 90%
        setProgress(Math.round(percent));
      }, 100);
    }, 500); // Start after 0.5 second

    return () => clearInterval(interval);
  }, [showAnimation]);

  const handleConvert = (type: "dna" | "graphene" | "brain", src: string) => {
    let animationVideo = "";
    let conversionName = "";

    switch (type) {
      case "dna":
        animationVideo = "/videos/DNA_Animation.mp4";
        conversionName = "DNA Conversion";
        break;
      case "graphene":
        animationVideo = "/videos/Graphene_Animation.mp4";
        conversionName = "Graphene Conversion";
        break;
      case "brain":
        animationVideo = "/videos/Brain_Animation.mp4";
        conversionName = "Brain Signals Conversion";
        break;
    }

    toast.info(`Starting ${conversionName}...`);
    setAnimationSrc(animationVideo);
    setSelectedImageSrc(src);
    setShowConversionModal(true);
    setShowAnimation(true);
    setProgress(0);
    setConversionDone(false);

    const animationStart = Date.now();

    const finish = () => {
      setConversionDone(true);
      const elapsed = Date.now() - animationStart;
      const remaining = Math.max(0, 10000 - elapsed);

      setTimeout(() => {
        setProgress(100);
        toast.success(`${conversionName} completed successfully!`);
        setTimeout(() => {
          setShowAnimation(false);
          setShowConversionModal(false);
        }, 500);
      }, remaining);
    }

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

  const albums = [
    {
      id: "1",
      src: "/images/img_1.jpg",
      title: "Favorites",
      subtitle: `${recentImages.length > 0 ? Math.min(recentImages.length, 12) : 0} items`,
      isFavorite: true,
    },
    {
      id: "2",
      src: recentImages.length > 0 ? recentImages[0].src : "/images/img_2.jpg",
      title: "Recent Memories",
      subtitle: `Created ${new Date().toLocaleDateString('default', { month: 'long', year: 'numeric' })}`,
    },
  ];

  const categories = [
    { name: "Selfies", icon: <Smile className="w-4 h-4" />, count: 12 },
    { name: "Videos", icon: <Video className="w-4 h-4" />, count: 8 },
    { name: "Receipts", icon: <FileText className="w-4 h-4" />, count: 5 },
    { name: "Documents", icon: <Grid className="w-4 h-4" />, count: 15 },
    { name: "Screenshots", icon: <Camera className="w-4 h-4" />, count: 23 },
  ];

  const handleCreateAlbum = () => {
    toast.message("Create new album", {
      description: "This feature will be available soon!",
    });
  };

  const handleDeleteImage = async (id: string, throwback: string) => {
    try {
      await deleteFile(id);
      toast.success("Photo moved to trash", {
        description: throwback,
        action: {
          label: "Undo",
          onClick: () => {
            // Implement undo logic here
            toast.info("Undo delete functionality coming soon");
          },
        },
      });
    } catch (error: any) {
      toast.error(`Failed to delete photo: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col px-4 md:px-8 lg:px-12 py-6 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Photos</h1>
        <p className="text-gray-600 mt-2">
          {recentImages.length} memories stored securely
        </p>
      </header>

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-100 p-1 rounded-lg">
          {[
            { value: "gallery", label: "Gallery" },
            { value: "album", label: "Albums" },
            { value: "explore", label: "Explore" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary py-2 rounded-md transition-all"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="gallery" className="mt-6">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">All Photos</h2>
              <div className="text-sm text-gray-500">
                Sorted by recent
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <Skeleton key={index} className="h-64 w-full rounded-lg" />
                ))}
              </div>
            ) : recentImages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-white">
                <Image
                  src="/images/empty-photos.svg"
                  alt="No photos"
                  width={200}
                  height={200}
                  className="opacity-70"
                />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No photos yet</h3>
                <p className="mt-1 text-sm text-gray-500">Upload your first photo to get started</p>
                <Button className="mt-4" variant="outline">
                  Upload Photo
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {recentImages.map((image) => (
                  <div
                    key={image.id}
                    className="group relative overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={image.src}
                        alt={`Photo ${image.id}`}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                      <p className="text-white text-sm truncate">{image.date}</p>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-white/90 hover:bg-white"
                          >
                            <MoreHorizontal className="h-4 w-4 text-gray-700" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="cursor-pointer">
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="cursor-pointer">
                              Convert to
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() => handleConvert("dna", image.src)}
                                  className="cursor-pointer"
                                >
                                  DNA
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleConvert("graphene", image.src)}
                                  className="cursor-pointer"
                                >
                                  Graphene
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleConvert("brain", image.src)}
                                  className="cursor-pointer"
                                >
                                  Brain Signals
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuItem className="cursor-pointer">
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteImage(image.id, image.throwback)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="album" className="mt-6">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">My Albums</h2>
              <Button
                onClick={handleCreateAlbum}
                size="sm"
                className="flex items-center gap-2"
              >
                {/* <Plus className="h-4 w-4" /> */}
                New Album
              </Button>
            </div>

            {albums.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-white">
                <Image
                  src="/images/empty-album.svg"
                  alt="No albums"
                  width={200}
                  height={200}
                  className="opacity-70"
                />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No albums yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create an album to organize your photos
                </p>
                <Button className="mt-4" onClick={handleCreateAlbum}>
                  Create Album
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Create New Album Card */}
                <div
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={handleCreateAlbum}
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    {/* <Plus className="h-8 w-8 text-gray-400" /> */}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">New Album</h3>
                  <p className="text-sm text-gray-500 mt-1">Add photos</p>
                </div>

                {/* Album Cards */}
                {albums.map((album) => (
                  <div
                    key={album.id}
                    className="group relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <Image
                        src={album.src}
                        alt={album.title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-4">
                      <h3 className="text-white font-medium">{album.title}</h3>
                      <p className="text-white/80 text-sm">{album.subtitle}</p>
                    </div>
                    {album.isFavorite && (
                      <div className="absolute top-2 left-2 bg-yellow-400 text-white p-1 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="explore" className="mt-6">
          <div className="flex flex-col gap-8">
            {/* Places Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Places</h2>
              <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 gap-6">
                <div className="flex-shrink-0">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <MapPin className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    Explore photos by location
                  </h3>
                  <p className="text-gray-600 mt-2">
                    View your memories grouped by where they were taken. Enable location
                    services to see photos on a map.
                  </p>
                  <Button variant="outline" className="mt-4">
                    View Map
                  </Button>
                </div>
              </div>
            </div>

            {/* Categories Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Categories</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-full text-blue-600">
                      {category.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <p className="text-xs text-gray-500">
                        {category.count} items
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Memories Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Memories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative rounded-xl overflow-hidden h-48">
                  <Image
                    src="/images/memories-1.jpg"
                    alt="Memory"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white font-medium">This Day Last Year</h3>
                    <p className="text-white/80 text-sm">12 photos</p>
                  </div>
                </div>
                <div className="relative rounded-xl overflow-hidden h-48">
                  <Image
                    src="/images/memories-2.jpg"
                    alt="Memory"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white font-medium">Recent Highlights</h3>
                    <p className="text-white/80 text-sm">8 photos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {showConversionModal && (
        <ConversionModal
          videoSrc={animationSrc}
          progressBar={progress}
          showAnimation={showAnimation}
          onClose={() => {
            setShowConversionModal(false);
            setShowAnimation(false);
          }}
        />
      )}
    </div>
  );
};

export default PhotosPage;