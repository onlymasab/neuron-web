"use client";
import Image from "next/image";
import { useEffect, useMemo, useState, Component, ReactNode, useCallback } from "react";
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
import {
  MoreHorizontal,
  MapPin,
  Smile,
  Video,
  FileText,
  Camera,
  Grid,
  Plus,
  Download as DownloadIcon,
  Share2,
  Trash2,
  Star,
  UploadCloud,
  ImageOff,
  FolderPlus,
  Search,
} from "lucide-react"; // Added more icons for clarity
import convertToDNA from "../components/convertToDNA"; // Assuming these are in ../components/
import convertToBrainSignals from "../components/convertToBrain";
import convertToGraphene from "../components/convertToGraphene";
import ConversionModal from "../components/ConversionModal";
import { useCloudStore } from "@/stores/useCloudStore";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// Constants
const MIN_ANIMATION_DURATION = 10000; // 10 seconds for conversion animation
const SKELETON_COUNT = 10;

// Types
interface ImageFile {
  id: string;
  src: string;
  throwback: string;
  date: string;
}

interface Album {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  isFavorite?: boolean;
}

interface Category {
  name: string;
  icon: ReactNode;
  count: number;
}

// Reusable Empty State Component
interface EmptyStateMessageProps {
  icon?: ReactNode;
  title: string;
  message: string;
  actionText?: string;
  onActionClick?: () => void;
}

const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({
  icon,
  title,
  message,
  actionText,
  onActionClick,
}) => (
  <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-white text-center">
    {icon || <ImageOff className="w-24 h-24 text-gray-400 opacity-70 mb-4" />}
    <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
    <p className="mt-1 text-sm text-gray-500">{message}</p>
    {actionText && onActionClick && (
      <Button className="mt-6" variant="outline" onClick={onActionClick}>
        {actionText}
      </Button>
    )}
  </div>
);

// Image Card Component
interface ImageCardProps {
  image: ImageFile;
  onConvert: (type: "dna" | "graphene" | "brain", src: string) => void;
  onDelete: (id: string, throwback: string) => void;
  onDownload: (src: string) => void;
  onShare: (src: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onConvert, onDelete, onDownload, onShare }) => {
  return (
    <div
      key={image.id}
      className="group relative overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="aspect-square overflow-hidden">
        <Image
          src={image.src}
          alt={`Photo uploaded on ${image.date}`}
          width={300}
          height={300}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            // Fallback for broken images
            (e.target as HTMLImageElement).src = `https://placehold.co/300x300/E5E7EB/6B7280?text=Error`;
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <p className="text-white text-xs font-medium truncate">{image.date}</p>
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-white/90 hover:bg-white rounded-full"
              aria-label="More options for image"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-700" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="cursor-pointer" onClick={() => onDownload(image.src)}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <Grid className="mr-2 h-4 w-4" /> Convert to
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => onConvert("dna", image.src)}
                    className="cursor-pointer"
                  >
                    DNA
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onConvert("graphene", image.src)}
                    className="cursor-pointer"
                  >
                    Graphene
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onConvert("brain", image.src)}
                    className="cursor-pointer"
                  >
                    Brain Signals
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem className="cursor-pointer" onClick={() => onShare(image.src)}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={() => onDelete(image.id, image.throwback)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

// Album Card Component
interface AlbumCardProps {
  album: Album;
  onClick?: () => void;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album, onClick }) => (
  <div
    key={album.id}
    className="group relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
    onClick={onClick}
  >
    <div className="aspect-[4/3] overflow-hidden">
      <Image
        src={album.src}
        alt={album.title}
        width={400}
        height={300}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://placehold.co/400x300/E5E7EB/6B7280?text=Album`;
        }}
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
      <h3 className="text-white text-lg font-semibold">{album.title}</h3>
      <p className="text-white/80 text-sm">{album.subtitle}</p>
    </div>
    {album.isFavorite && (
      <div className="absolute top-3 left-3 bg-yellow-400 text-white p-1.5 rounded-full shadow-md">
        <Star className="h-4 w-4" fill="white" />
      </div>
    )}
  </div>
);

// Category Pill Component
interface CategoryPillProps {
  category: Category;
  onClick?: () => void;
}
const CategoryPill: React.FC<CategoryPillProps> = ({ category, onClick }) => (
  <div
    key={category.name}
    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all duration-200 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full text-blue-600">
      {category.icon}
    </div>
    <div>
      <h4 className="font-medium text-sm text-gray-800">{category.name}</h4>
      <p className="text-xs text-gray-500">{category.count} items</p>
    </div>
  </div>
);


const PhotosPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { files, fetchFiles, deleteFile } = useCloudStore();

  const [showConversionModal, setShowConversionModal] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState("");
  const [animationSrc, setAnimationSrc] = useState("");
  const [progress, setProgress] = useState(0);
  // const [conversionDone, setConversionDone] = useState(false); // This state seems not directly used for logic after refactor
  const [isLoading, setIsLoading] = useState(true);
  const [conversionType, setConversionType] = useState<"dna" | "graphene" | "brain" | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user?.id) {
      router.push("/"); // Or your login page
    }
  }, [user, router]);

  // Fetch files for authenticated user
  useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      fetchFiles(user.id)
        .catch((error) => {
          console.error("Failed to fetch photos:", error);
          toast.error(`Failed to fetch photos: ${error.message}`);
        })
        .finally(() => {
          // Adding a small delay for smoother perceived loading, ensuring skeletons are visible briefly
          setTimeout(() => setIsLoading(false), 300);
        });
    } else {
        setIsLoading(false); // Not logged in, so not loading files
    }
  }, [user?.id, fetchFiles]); // fetchFiles from Zustand is typically stable

  // Memoize recent images for Carousel and Gallery
  const recentImages = useMemo((): ImageFile[] =>
    files
      .filter((file) => file.type === "image" && !file.is_trashed && file.file_url)
      .map((file) => ({
        id: file.id,
        src: file.file_url!,
        throwback: `Uploaded on ${new Date(file.created_at!).toLocaleDateString()}`,
        date: new Date(file.created_at!).toLocaleDateString("default", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      })),
    [files]
  );

  // Effect for conversion progress simulation
  useEffect(() => {
    if (!showAnimation) {
      setProgress(0); // Reset progress when animation is not shown
      return;
    }

    let animationStartTimestamp = Date.now();
    let progressInterval: NodeJS.Timeout;

    // Start visual progress simulation (up to 99%)
    progressInterval = setInterval(() => {
      const elapsed = Date.now() - animationStartTimestamp;
      const percent = Math.min((elapsed / MIN_ANIMATION_DURATION) * 99, 99);
      setProgress(Math.round(percent));
      if (percent >= 99) {
        clearInterval(progressInterval);
      }
    }, 100);
    

    return () => {
      clearInterval(progressInterval);
    };
  }, [showAnimation]);

  const handleConvert = useCallback((type: "dna" | "graphene" | "brain", src: string) => {
    let animationVideo = "";
    let conversionName = "";

    switch (type) {
      case "dna":
        animationVideo = "/videos/DNA_Animation.mp4"; // Ensure these paths are correct in `public`
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
    setConversionType(type);
    setShowConversionModal(true);
    setShowAnimation(true);
    setProgress(0);
    // setConversionDone(false); // Reset (though not directly used for logic now)

    const conversionProcessStart = Date.now();

    const completeConversionProcess = () => {
      // setConversionDone(true); // Mark actual conversion as done
      const elapsedSinceProcessStart = Date.now() - conversionProcessStart;
      const remainingMinDisplayTime = Math.max(0, MIN_ANIMATION_DURATION - elapsedSinceProcessStart);

      // Ensure progress reaches 100% and modal closes after minimum animation time
      setTimeout(() => {
        setProgress(100);
        toast.success(`${conversionName} completed successfully!`);
        setTimeout(() => {
          setShowAnimation(false);
          setShowConversionModal(false);
          setConversionType(null);
        }, 500); // Short delay before closing modal
      }, remainingMinDisplayTime);
    };

    // Call the actual conversion utility
    switch (type) {
      case "dna":
        convertToDNA(src, completeConversionProcess);
        break;
      case "graphene":
        convertToGraphene(src, completeConversionProcess);
        break;
      case "brain":
        convertToBrainSignals(src, completeConversionProcess);
        break;
    }
  }, []); // No dependencies if conversion functions are stable imports

  const handleDeleteImage = useCallback(async (id: string, throwback: string) => {
    try {
      await deleteFile(id);
      toast.success("Photo moved to trash", {
        description: throwback,
        action: {
          label: "Undo",
          onClick: () => {
            toast.info("Undo delete functionality coming soon.");
            // Implement undo logic here if possible, e.g., by calling an `undoDeleteFile` method
          },
        },
      });
    } catch (error: any) {
      console.error("Failed to delete photo:", error);
      toast.error(`Failed to delete photo: ${error.message}`);
    }
  }, [deleteFile]);

  // Placeholder handlers
  const handleUploadPhoto = useCallback(() => {
    toast.info("Upload photo functionality coming soon!");
  }, []);
  const handleDownloadImage = useCallback((src: string) => {
    // For actual download, you might need to create an <a> tag and click it
    // or use a library if src is a data URL or requires special handling.
    toast.info("Download functionality coming soon!");
    console.log("Download image:", src);
  }, []);
  const handleShareImage = useCallback((src: string) => {
    toast.info("Share functionality coming soon!");
    console.log("Share image:", src);
  }, []);
  const handleCreateAlbum = useCallback(() => {
    toast.info("Create new album feature will be available soon!");
  }, []);
  const handleViewMap = useCallback(() => {
    toast.info("View map functionality coming soon!");
  }, []);
  const handleCategoryClick = useCallback((categoryName: string) => {
    toast.info(`Viewing ${categoryName} category - coming soon!`);
  }, []);
   const handleAlbumClick = useCallback((albumTitle: string) => {
    toast.info(`Opening album: ${albumTitle} - coming soon!`);
  }, []);


  // Static data for UI (can be fetched or dynamic in a real app)
  const albums = useMemo((): Album[] => [
    {
      id: "1",
      src: recentImages.length > 1 && recentImages[1] ? recentImages[1].src : "https://placehold.co/400x300/A6B1E1/FFFFFF?text=Favorites",
      title: "Favorites",
      subtitle: `${Math.min(recentImages.length, 12)} items`, // Example: cap at 12 for display
      isFavorite: true,
    },
    {
      id: "2",
      src: recentImages.length > 0 ? recentImages[0].src : "https://placehold.co/400x300/A0AEC0/FFFFFF?text=Recent",
      title: "Recent Memories",
      subtitle: `Created ${new Date().toLocaleDateString("default", {
        month: "long",
        year: "numeric",
      })}`,
    },
  ], [recentImages]);

  const categories: Category[] = [
    { name: "Selfies", icon: <Smile className="w-5 h-5" />, count: 12 },
    { name: "Videos", icon: <Video className="w-5 h-5" />, count: 8 },
    { name: "Receipts", icon: <FileText className="w-5 h-5" />, count: 5 },
    { name: "Documents", icon: <Grid className="w-5 h-5" />, count: 15 },
    { name: "Screenshots", icon: <Camera className="w-5 h-5" />, count: 23 },
  ];

  const TABS = [
    { value: "gallery", label: "Gallery" },
    { value: "album", label: "Albums" },
    { value: "explore", label: "Explore" },
  ];

  return (
    <div className="flex flex-col px-4 md:px-6 lg:px-8 py-6 bg-slate-100 min-h-screen font-sans">
      <header className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Photos</h1>
        <p className="text-gray-600 mt-1 text-sm">
          {isLoading ? 'Loading memories...' : `${recentImages.length} memories stored securely`}
        </p>
      </header>

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-3 bg-slate-200/80 p-1 rounded-lg mb-6 md:mb-8">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="relative rounded-md px-3 py-2 text-sm sm:text-base font-medium text-slate-700
                         data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500
                         data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 ease-in-out"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="mt-2">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">All Photos</h2>
              <div className="text-sm text-gray-500">Sorted by recent</div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                  <Skeleton key={`gallery-skeleton-${index}`} className="h-48 sm:h-56 md:h-64 w-full rounded-lg bg-gray-300" />
                ))}
              </div>
            ) : recentImages.length === 0 ? (
              <EmptyStateMessage
                icon={<UploadCloud className="w-24 h-24 text-gray-400 opacity-70 mb-4" />}
                title="No Photos Yet"
                message="Upload your first photo to see it here and start building your memories."
                actionText="Upload Photo"
                onActionClick={handleUploadPhoto}
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {recentImages.map((image) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    onConvert={handleConvert}
                    onDelete={handleDeleteImage}
                    onDownload={handleDownloadImage}
                    onShare={handleShareImage}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Albums Tab */}
        <TabsContent value="album" className="mt-2">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">My Albums</h2>
              <Button
                onClick={handleCreateAlbum}
                size="sm"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4" />
                New Album
              </Button>
            </div>

            {albums.length === 0 && !isLoading ? ( // Show empty state only if not loading and albums are truly empty
               <EmptyStateMessage
                icon={<FolderPlus className="w-24 h-24 text-gray-400 opacity-70 mb-4" />}
                title="No Albums Yet"
                message="Create an album to organize your photos into collections."
                actionText="Create First Album"
                onActionClick={handleCreateAlbum}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Special "Create New Album" Card */}
                <div
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl bg-white hover:bg-gray-50/50 transition-colors cursor-pointer aspect-[4/3] hover:border-blue-400"
                  onClick={handleCreateAlbum}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateAlbum()}
                  aria-label="Create new album"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 text-gray-400 group-hover:text-blue-500 transition-colors">
                    <Plus className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">New Album</h3>
                  <p className="text-sm text-gray-500 mt-1">Add photos</p>
                </div>
                {/* Existing Albums */}
                {albums.map((album) => (
                  <AlbumCard key={album.id} album={album} onClick={() => handleAlbumClick(album.title)} />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Explore Tab */}
        <TabsContent value="explore" className="mt-2">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Places</h2>
              <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50 rounded-xl p-6 gap-6 shadow-sm">
                <div className="flex-shrink-0">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <MapPin className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-medium text-gray-900">
                    Explore photos by location
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm">
                    View your memories grouped by where they were taken. Enable
                    location services to see photos on a map.
                  </p>
                  <Button variant="outline" className="mt-4 border-blue-500 text-blue-600 hover:bg-blue-50" onClick={handleViewMap}>
                    <Search className="mr-2 h-4 w-4" />
                    View Map
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Categories</h2>
              {categories.length === 0 ? (
                 <EmptyStateMessage
                    title="No Categories Found"
                    message="Photos will be automatically categorized here."
                  />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {categories.map((category) => (
                    <CategoryPill key={category.name} category={category} onClick={() => handleCategoryClick(category.name)} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Memories</h2>
              {/* Placeholder for Memories - can be dynamic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative rounded-xl overflow-hidden h-48 shadow-lg group">
                  <Image
                    src={"https://placehold.co/600x400/A6B1E1/FFFFFF?text=Memory+1"} // Placeholder
                    alt="Memory: This Day Last Year"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white font-semibold">This Day Last Year</h3>
                    <p className="text-white/80 text-sm">12 photos</p>
                  </div>
                </div>
                <div className="relative rounded-xl overflow-hidden h-48 shadow-lg group">
                  <Image
                    src={"https://placehold.co/600x400/A0AEC0/FFFFFF?text=Memory+2"} // Placeholder
                    alt="Memory: Recent Highlights"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white font-semibold">Recent Highlights</h3>
                    <p className="text-white/80 text-sm">8 photos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {showConversionModal && conversionType && (
        <ErrorBoundary>
          <ConversionModal
            videoSrc={animationSrc}
            progressBar={progress}
            showAnimation={showAnimation}
            onClose={() => {
              setShowConversionModal(false);
              setShowAnimation(false);
              setConversionType(null);
            }}
            conversionType={conversionType}
          />
        </ErrorBoundary>
      )}
    </div>
  );
};

// ErrorBoundary must be a class component
class ErrorBoundary extends Component<{ children: ReactNode, fallbackMessage?: string }, { hasError: boolean }> {
  constructor(props: { children: ReactNode, fallbackMessage?: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
          <h2 className="font-bold text-lg mb-2">Oops! Something went wrong.</h2>
          <p>{this.props.fallbackMessage || "We encountered an issue with this part of the application. Please try again later."}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default PhotosPage;
