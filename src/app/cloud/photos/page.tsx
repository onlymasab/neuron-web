"use client";
import Image from "next/image";
import { useEffect, useMemo, useState, Component, ReactNode, useCallback, useRef } from "react";
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
import { useSharedWithOthersStore } from '@/stores/sharedWithOthersStore';
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
  ChevronDown,
  Clock,
  Users,
} from "lucide-react";
import convertToDNA from "../components/convertToDNA";
import convertToBrainSignals from "../components/convertToBrain";
import convertToGraphene from "../components/convertToGraphene";
import ConversionModal from "../components/ConversionModal";
import { useCloudStore } from "@/stores/useCloudStore";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-media-query";
import React from "react";
import { Input } from "@/components/ui/input";
import ShareDialog from "../components/ShareDialog";

// Constants
const MIN_ANIMATION_DURATION = 10000; // 10 seconds for conversion animation
const SKELETON_COUNT = 10;
const GRID_COLUMNS = {
  base: 2,
  sm: 3,
  md: 4,
  lg: 5,
  xl: 6
};

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
  icon: React.ReactElement<{ className?: string }>;
  count: number;
}

// Reusable Empty State Component
const EmptyStateMessage: React.FC<{
  icon?: ReactNode;
  title: string;
  message: string;
  actionText?: string;
  onActionClick?: () => void;
}> = ({ icon, title, message, actionText, onActionClick }) => (
  <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-white text-center">
    {icon || <ImageOff className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-400 opacity-70 mb-4" />}
    <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
    <p className="mt-1 text-sm text-gray-500 max-w-md px-4">{message}</p>
    {actionText && onActionClick && (
      <Button className="mt-6" variant="outline" onClick={onActionClick}>
        {actionText}
      </Button>
    )}
  </div>
);

// Image Card Component
const ImageCard: React.FC<{
  image: ImageFile;
  onConvert: (type: "dna" | "graphene" | "brain", src: string) => void;
  onDelete: (id: string, throwback: string) => void;
  onDownload: (src: string) => void;
  onShare: (src: string) => void;
  isMobile?: boolean;
}> = ({ image, onConvert, onDelete, onDownload, onShare, isMobile = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      key={image.id}
      className="group relative overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onClick={() => isMobile && setIsHovered(!isHovered)}
    >
      <div className="aspect-square overflow-hidden">
        <Image
          src={image.src}
          alt={`Photo uploaded on ${image.date}`}
          width={300}
          height={300}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = ``;
          }}
        />
      </div>
      <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 flex flex-col justify-end p-3`}>
        <p className="text-white text-xs font-medium truncate">{image.date}</p>
      </div>
      <div className={`absolute top-2 right-2 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8 bg-white/90 hover:bg-white rounded-full shadow-sm"
              aria-label="More options for image"
            >
              <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-700" />
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
            <DropdownMenuItem className="cursor-pointer" onClick={() => onShare(image.id)}>
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
const AlbumCard: React.FC<{ 
  album: Album; 
  onClick?: () => void; 
  isMobile?: boolean;
  isSelected?: boolean;
}> = ({ album, onClick, isMobile = false, isSelected = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt effect
  useEffect(() => {
    if (isMobile || !cardRef.current) return;

    const handleMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = (x - centerX) / 20;
      const rotateX = (centerY - y) / 20;
      
      cardRef.current.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(${isHovered ? 1.03 : 1})
      `;
    };

    const handleLeave = () => {
      if (cardRef.current) {
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      }
    };

    if (isHovered) {
      cardRef.current?.addEventListener('mousemove', handleMove);
      cardRef.current?.addEventListener('mouseleave', handleLeave);
    }

    return () => {
      cardRef.current?.removeEventListener('mousemove', handleMove);
      cardRef.current?.removeEventListener('mouseleave', handleLeave);
    };
  }, [isHovered, isMobile]);

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 ease-out cursor-pointer
                  ${isSelected ? 'ring-4 ring-blue-400/80 scale-[0.98]' : ''}
                  ${isHovered ? 'shadow-lg' : 'shadow-md'}`}
      onClick={onClick}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease-out'
      }}
    >
      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl" />
      
      {/* Album image with parallax effect */}
      <div className="aspect-[4/3] overflow-hidden">
        <Image
          src={album.src}
          alt={album.title}
          width={400}
          height={300}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          style={{
            transform: isHovered ? 'translateZ(20px)' : 'translateZ(0)',
            transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-album.jpg';
          }}
        />
      </div>
      
      {/* Floating metadata with depth */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 z-10" style={{
        transform: isHovered ? 'translateZ(30px)' : 'translateZ(0)',
        transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div className="bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-xl font-bold drop-shadow-lg">{album.title}</h3>
              <p className="text-white/80 text-sm mt-1 drop-shadow-lg">{album.subtitle}</p>
            </div>
            {album.isFavorite && (
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-2 rounded-full shadow-lg">
                <Star className="h-4 w-4 text-white" fill="currentColor" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Hover action button with floating effect */}
      <div className={`absolute inset-0 flex items-center justify-center z-20 transition-all duration-500
                      ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <Button 
          variant="default"
          size="sm"
          className="bg-white/90 hover:bg-white text-gray-900 shadow-xl hover:shadow-2xl 
                    transform transition-all duration-500
                    hover:-translate-y-1 hover:scale-105"
          style={{
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)'
          }}
        >
          View Album
        </Button>
      </div>
      
      {/* Floating particles decoration */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white/30 rounded-full"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: isHovered ? 0.8 : 0,
              transform: isHovered ? 'translateZ(10px)' : 'translateZ(0)',
              transition: `opacity 0.5s ease-out ${i * 0.1}s, transform 0.5s ease-out ${i * 0.1}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Category Pill Component
const CategoryPill: React.FC<{ category: Category; onClick?: () => void; isMobile?: boolean }> = ({ category, onClick, isMobile = false }) => (
  <div
    key={category.name}
    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all duration-200 cursor-pointer"
    onClick={onClick}
  >
    <div className={`flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-10 h-10'} bg-blue-100 rounded-full text-blue-600`}>
      {React.isValidElement(category.icon)
        ? React.cloneElement(category.icon, { className: `${isMobile ? 'w-4 h-4' : 'w-5 h-5'}` })
        : category.icon}
    </div>
    <div>
      <h4 className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'} text-gray-800`}>{category.name}</h4>
      <p className={`${isMobile ? 'text-2xs' : 'text-xs'} text-gray-500`}>{category.count} items</p>
    </div>
  </div>
);

const PhotosPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { files, fetchFiles, deleteFile } = useCloudStore();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 768px)');

  const [showConversionModal, setShowConversionModal] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState("");
  const [animationSrc, setAnimationSrc] = useState("");
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [conversionType, setConversionType] = useState<"dna" | "graphene" | "brain" | null>(null);
  const [conversionStatus, setConversionStatus] = useState<"idle" | "converting" | "completed">("idle");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [fileIdToShare, setFileIdToShare] = useState<string | null>(null);
  

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
          console.error("Failed to fetch photos:", error);
          toast.error(`Failed to fetch photos: ${error.message}`);
        })
        .finally(() => {
          setTimeout(() => setIsLoading(false), 300);
        });
    } else {
      setIsLoading(false);
    }
  }, [user?.id, fetchFiles]);

  const favoriteImages = useMemo<ImageFile[]>(() => {
    return files
      .filter((file) => file.is_liked)
      .map((file) => {
        const createdAt = file.created_at ? new Date(file.created_at) : new Date();
        return {
          id: file.id,
          src: file.file_url ?? "",
          throwback: `Uploaded on ${createdAt.toLocaleDateString()}`,
          date: createdAt.toLocaleDateString("default", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        };
      });
  }, [files]);

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
      setProgress(0);
      return;
    }

    let animationStartTimestamp = Date.now();
    let progressInterval: NodeJS.Timeout;

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
    setConversionType(type);
    setShowConversionModal(true);
    setShowAnimation(true);
    setProgress(0);
    setConversionStatus("converting");

    const conversionProcessStart = Date.now();

    const completeConversionProcess = () => {
      setConversionStatus("completed");
      const elapsedSinceProcessStart = Date.now() - conversionProcessStart;
      const remainingMinDisplayTime = Math.max(0, MIN_ANIMATION_DURATION - elapsedSinceProcessStart);

      setTimeout(() => {
        setProgress(100);
        toast.success(`${conversionName} completed successfully!`);
      }, remainingMinDisplayTime);
    };

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
  }, []);

  const handleDeleteImage = useCallback(async (id: string, throwback: string) => {
    try {
      await deleteFile(id);
      toast.success("Photo moved to trash", {
        description: throwback,
        action: {
          label: "Undo",
          onClick: () => {
            toast.info("Undo delete functionality coming soon.");
          },
        },
      });
    } catch (error: any) {
      console.error("Failed to delete photo:", error);
      toast.error(`Failed to delete photo: ${error.message}`);
    }
  }, [deleteFile]);

  // Placeholder handlers
  const handleUploadPhoto = useCallback(() => toast.info("Upload photo functionality coming soon!"), []);
  const handleDownloadImage = useCallback((src: string) => toast.info("Download functionality coming soon!"), []);
  const handleShareImage = (id: string) => {
      setFileIdToShare(id);
      setShareDialogOpen(true);
    };
  const handleCreateAlbum = useCallback(() => toast.info("Create new album feature will be available soon!"), []);
  const handleViewMap = useCallback(() => toast.info("View map functionality coming soon!"), []);
  const handleCategoryClick = useCallback((categoryName: string) => toast.info(`Viewing ${categoryName} category - coming soon!`), []);
    // State for selected album
const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

// Handle album click
const handleAlbumClick = useCallback((album: Album) => {
  setSelectedAlbum(album);
}, []);

const fixedAlbums = useMemo((): Album[] => [
  {
    id: "1",
    src: favoriteImages.length > 1
      ? favoriteImages[1].src
      : "https://images.unsplash.com/photo-1566487097168-e91a4f38bee2?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Favorites",
    subtitle: `${favoriteImages.length} items`,
    isFavorite: true,
  },
  {
    id: "2",
    src: recentImages.length > 2
      ? recentImages[2].src
      : "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=400&h=300&q=80",
    title: "Recents",
    subtitle:  `${recentImages.length} items`,
  },
  {
    id: "3",
    src: recentImages.length > 3
      ? recentImages[3].src
      : "https://images.unsplash.com/photo-1745962981818-1883892e7d58?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhbWlseSUyMGtvcmVhbnxlbnwwfHwwfHx8MA%3D%3D",
    title: "Family",
    subtitle: `${recentImages.length} items`,
  },
  {
    id: "4",
    src: recentImages.length > 4
      ? recentImages[4].src
      : "https://images.unsplash.com/photo-1552900651-b2a53060a085?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGZyZWluZHMlMjBjaGluZXNlfGVufDB8fDB8fHww",
    title: "Friends",
    subtitle: `${recentImages.length} items`,
  },
  {
    id: "5",
    src: recentImages.length > 5
      ? recentImages[5].src
      : "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fHdvcmt8ZW58MHx8MHx8fDA%3D",
    title: "Work",
    subtitle: `${recentImages.length} items`,
  },
  {
    id: "6",
    src: recentImages.length > 6
      ? recentImages[6].src
      : "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJpcnRoZGF5fGVufDB8fDB8fHww",
    title: "Events",
    subtitle: `${recentImages.length} items`,
  },
], [recentImages, favoriteImages]);



  const categories: Category[] = [
    { name: "Selfies", icon: <Smile />, count: 12 },
    { name: "Videos", icon: <Video />, count: 8 },
    { name: "Receipts", icon: <FileText />, count: 5 },
    { name: "Documents", icon: <Grid />, count: 15 },
    { name: "Screenshots", icon: <Camera />, count: 23 },
  ];

  const TABS = [
    { value: "gallery", label: "Gallery" },
    { value: "album", label: "Albums" },
    { value: "explore", label: "Explore" },
  ];

  // Calculate grid columns based on screen size
  const getGridColumns = () => {
    if (isMobile) return `grid-cols-${GRID_COLUMNS.base}`;
    if (isTablet) return `grid-cols-${GRID_COLUMNS.sm}`;
    return `grid-cols-${GRID_COLUMNS.md} lg:grid-cols-${GRID_COLUMNS.lg} xl:grid-cols-${GRID_COLUMNS.xl}`;
  };

  // Add these to your existing state declarations
const [geolocationEnabled, setGeolocationEnabled] = useState(false);
const [showMapView, setShowMapView] = useState(false);
const [categorySearch, setCategorySearch] = useState("");
const [memoryFilter, setMemoryFilter] = useState<"all" | "year" | "month" | "week">("all");

// Sample data for locations
const locationGroups = [
  {
    id: "1",
    name: "New York, USA",
    count: 24,
    previewImage: recentImages[0]?.src || "/placeholder-location.jpg"
  },
  {
    id: "2",
    name: "Paris, France",
    count: 18,
    previewImage: recentImages[1]?.src || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHJpcHxlbnwwfHwwfHx8MA%3D%3D"
  },
  // Add more locations as needed
];

// Sample data for people
const people = [
  {
    id: "1",
    name: "Alex Johnson",
    count: 42,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyc3xlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: "2",
    name: "Sam Wilson",
    count: 36,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyc3xlbnwwfHwwfHx8MA%3D%3D"
  },
  // Add more people as needed
];

// Filter categories based on search
const filteredCategories = useMemo(() => {
  return categories.filter(category => 
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  );
}, [categories, categorySearch]);

// Filter memories based on selected filter
const filteredMemories = useMemo(() => {
  const baseMemories = [
    {
      id: "1",
      title: "This Day Last Year",
      count: 12,
      dateRange: "June 15, 2022",
      previewImage: recentImages[2]?.src || "https://images.unsplash.com/photo-1529171696861-bac785a44828?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHRyaXB8ZW58MHx8MHx8fDA%3D"
    },
    {
      id: "2",
      title: "Recent Highlights",
      count: 8,
      dateRange: "Last 30 days",
      previewImage: recentImages[3]?.src  || "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dHJpcHxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
      id: "3",
      title: "Vacation Memories",
      count: 15,
      dateRange: "Summer 2022",
      previewImage: recentImages[4]?.src || "https://images.unsplash.com/photo-1529171696861-bac785a44828?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHRyaXB8ZW58MHx8MHx8fDA%3D"
    }
  ];

  if (memoryFilter === 'all') return baseMemories;
  return baseMemories.filter(m => m.id === "1"); // Simplified filtering
}, [memoryFilter, recentImages]);

// Add these handler functions
const handleLocationClick = (locationName: string) => {
  toast.info(`Showing photos from ${locationName}`);
  // In a real app, you would filter and display photos from this location
};

const handleMemoryClick = (memory: any) => {
  toast.info(`Showing ${memory.title} photos`);
  // In a real app, you would filter and display these photos
};

const handlePersonClick = (personId: string) => {
  toast.info(`Showing photos of this person`);
  // In a real app, you would filter and display photos with this person
};

// Check geolocation permissions on mount
useEffect(() => {
  if (navigator.permissions) {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      setGeolocationEnabled(result.state === 'granted');
    });
  }
}, []);

  return (
    <div className="flex flex-col px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-slate-50 min-h-screen font-sans">
      <header className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Photos</h1>
        <p className="text-gray-600 mt-1 text-xs sm:text-sm">
          {isLoading ? 'Loading memories...' : `${recentImages.length} memories stored securely`}
        </p>
      </header>

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className={`grid w-full ${isMobile ? 'max-w-xs' : 'max-w-lg'} grid-cols-3 bg-slate-200/80  rounded-lg mb-4 sm:mb-6 md:mb-8`}>
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="relative rounded-md px-2 sm:px-3 text-xs sm:text-sm md:text-base font-medium text-slate-700
                         data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500
                         data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 ease-in-out"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="mt-2">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700">All Photos</h2>
              <div className="text-xs sm:text-sm text-gray-500">Sorted by recent</div>
            </div>

            {isLoading ? (
              <div className={`grid ${getGridColumns()} gap-2 sm:gap-3 md:gap-4`}>
                {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                  <Skeleton key={`gallery-skeleton-${index}`} className="h-40 sm:h-48 md:h-56 lg:h-64 w-full rounded-lg bg-gray-200" />
                ))}
              </div>
            ) : recentImages.length === 0 ? (
              <EmptyStateMessage
                icon={<UploadCloud className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-400 opacity-70 mb-4" />}
                title="No Photos Yet"
                message="Upload your first photo to see it here and start building your memories."
                actionText="Upload Photo"
                onActionClick={handleUploadPhoto}
              />
            ) : (
              <div className={`grid ${getGridColumns()} gap-2 sm:gap-3 md:gap-4`}>
                {recentImages.map((image) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    onConvert={handleConvert}
                    onDelete={handleDeleteImage}
                    onDownload={handleDownloadImage}
                    onShare={handleShareImage}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Albums Tab */}
         <TabsContent value="album" className="mt-2">
  <div className="flex flex-col gap-6 sm:gap-8">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Your Albums</h2>
        <p className="text-gray-500 text-sm sm:text-base mt-1">
          {selectedAlbum ? selectedAlbum.title : `${fixedAlbums.length} collections`}
        </p>
      </div>
      
      {selectedAlbum ? (
        <Button
          onClick={() => setSelectedAlbum(null)}
          size={isMobile ? "sm" : "default"}
          variant="ghost"
          className="text-blue-600 hover:text-blue-700 gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          All Albums
        </Button>
      ) : (
        <div className="relative">
          <Input 
            type="text" 
            placeholder="Search albums..." 
            className="pl-10 w-[180px] sm:w-[220px] rounded-full bg-white border-gray-300 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      )}
    </div>

    {selectedAlbum ? (
      <div className="space-y-6 animate-fadeIn">
        {/* Album Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200/50">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            {/* Album cover with floating badge */}
            <div className="relative w-full sm:w-1/4 min-w-[200px]">
              <div className="aspect-[4/3] overflow-hidden rounded-xl shadow-lg border-4 border-white">
                <Image
                  src={selectedAlbum.src}
                  alt={selectedAlbum.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-album.jpg';
                  }}
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white p-2 rounded-full shadow-lg border border-gray-200">
                <div className="bg-blue-100 p-2 rounded-full">
                  {selectedAlbum.isFavorite ? (
                    <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                  ) : (
                    <Grid className="h-5 w-5 text-blue-600" />
                  )}
                </div>
              </div>
            </div>
            
            {/* Album metadata */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">{selectedAlbum.title}</h3>
                {selectedAlbum.isFavorite && (
                  <Star className="h-6 w-6 text-yellow-400" fill="currentColor" />
                )}
              </div>
              <p className="text-gray-600">{selectedAlbum.subtitle}</p>
              
              {/* Action buttons with hover effects */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button 
                  className="gap-2 hover:-translate-y-0.5 transition-transform" 
                  variant="default"
                >
                  <Share2 className="h-4 w-4" />
                  Share Album
                </Button>
                <Button 
                  className="gap-2 hover:-translate-y-0.5 transition-transform" 
                  variant="outline"
                >
                  <DownloadIcon className="h-4 w-4" />
                  Download All
                </Button>
                <Button 
                  className="gap-2 hover:-translate-y-0.5 transition-transform" 
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                  Add Photos
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Album Content */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              Photos in this album
            </h4>
            <div className="text-sm text-gray-500">
              {recentImages.length > 0 ? `${recentImages.length} items` : 'Empty'}
            </div>
          </div>

          {recentImages.length > 0 ? (
            <div className={`grid ${getGridColumns()} gap-3 sm:gap-4`}>
              {recentImages.slice(0, 12).map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  onConvert={handleConvert}
                  onDelete={handleDeleteImage}
                  onDownload={handleDownloadImage}
                  onShare={handleShareImage}
                  isMobile={isMobile}
                />
              ))}
            </div>
          ) : (
            <EmptyStateMessage
              icon={<ImageOff className="w-16 h-16 text-gray-400 opacity-70 mb-4" />}
              title="This Album is Empty"
              message="Add photos to this album to see them here."
              actionText="Add Photos Now"
              onActionClick={() => toast.info("Add photos functionality coming soon")}
            />
          )}
        </div>
      </div>
    ) : (
      <div className="space-y-6">
        {/* Featured Album section */}
        {fixedAlbums.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              Featured Album
            </h3>
            <AlbumCard 
              album={fixedAlbums[0]} 
              onClick={() => handleAlbumClick(fixedAlbums[0])}
              isMobile={isMobile}
            />
          </div>
        )}

        {/* All Albums Grid */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            All Albums
          </h3>
          
          {fixedAlbums.length > 1 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {fixedAlbums.slice(1).map((album) => (
                <AlbumCard 
                  key={album.id} 
                  album={album} 
                  onClick={() => handleAlbumClick(album)}
                  isMobile={isMobile}
                />
              ))}
            </div>
          ) : (
            <EmptyStateMessage
              icon={<FolderPlus className="w-16 h-16 text-gray-400 opacity-70 mb-4" />}
              title="No Albums Found"
              message="You don't have any albums yet."
            />
          )}
        </div>
      </div>
    )}
  </div>
          </TabsContent>

        {/* Explore Tab */}
          <TabsContent value="explore" className="mt-2">
            <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
              {/* Places Section with Map Integration */}
              <div>
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Places</h2>
                  {geolocationEnabled && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowMapView(!showMapView)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {showMapView ? 'List View' : 'Map View'}
                    </Button>
                  )}
                </div>

                {showMapView ? (
                  <div className="h-64 sm:h-80 md:h-96 bg-gray-100 rounded-xl overflow-hidden relative">
                    {/* Map Component Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100">
                      <MapPin className="h-12 w-12 text-blue-400 animate-bounce" />
                      <div className="absolute bottom-4 left-0 right-0 text-center">
                        <p className="text-sm text-gray-600">Map integration coming soon</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {locationGroups.map((location) => (
                      <div 
                        key={location.id} 
                        className="relative rounded-xl overflow-hidden h-32 sm:h-36 md:h-40 shadow-md group cursor-pointer"
                        onClick={() => handleLocationClick(location.name)}
                      >
                        <Image
                          src={location.previewImage || 'https://images.unsplash.com/photo-1746704948438-f3e307e1833c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDQwfEZ6bzN6dU9ITjZ3fHxlbnwwfHx8fHw%3D'}
                          alt={location.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-white" />
                            <h3 className="text-white font-medium text-sm sm:text-base">{location.name}</h3>
                          </div>
                          <p className="text-white/80 text-xs mt-1">{location.count} photos</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories Section with Search */}
              <div>
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Categories</h2>
                  <div className="relative w-40 sm:w-56">
                    <Input
                      type="text"
                      placeholder="Search categories..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="pl-8 pr-3 h-8 sm:h-9 text-sm rounded-full"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  </div>
                </div>

                {filteredCategories.length === 0 ? (
                  <EmptyStateMessage
                    title={categorySearch ? "No matching categories" : "No Categories Found"}
                    message={categorySearch ? "Try a different search term" : "Photos will be automatically categorized here."}
                  />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    {filteredCategories.map((category) => (
                      <CategoryPill 
                        key={category.name} 
                        category={category} 
                        onClick={() => handleCategoryClick(category.name)}
                        isMobile={isMobile}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Memories Section with Time-based Grouping */}
              <div>
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Memories</h2>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                        <span className="mr-1">Filter</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setMemoryFilter('all')}>
                        All Memories
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setMemoryFilter('year')}>
                        This Time Last Year
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setMemoryFilter('month')}>
                        This Month in Past Years
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setMemoryFilter('week')}>
                        This Week in Past Years
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredMemories.map((memory) => (
                    <div 
                      key={memory.id}
                      className="relative rounded-xl overflow-hidden h-40 sm:h-48 md:h-56 shadow-lg group cursor-pointer"
                      onClick={() => handleMemoryClick(memory)}
                    >
                      <Image
                        src={memory.previewImage || '/placeholder-memory.jpg'}
                        alt={memory.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3 sm:p-4">
                        <h3 className="text-white font-semibold text-sm sm:text-base">{memory.title}</h3>
                        <p className="text-white/80 text-xs sm:text-sm">{memory.count} photos</p>
                        <p className="text-white/60 text-xs mt-1">{memory.dateRange}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredMemories.length === 0 && (
                  <EmptyStateMessage
                    icon={<Clock className="w-16 h-16 text-gray-400 opacity-70 mb-4" />}
                    title="No Memories Yet"
                    message="As time passes, we'll show you memories from this time in previous years."
                  />
                )}
              </div>

              {/* People Recognition Section */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">People</h2>
                {people.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {people.map((person) => (
                      <div 
                        key={person.id}
                        className="flex flex-col items-center cursor-pointer group"
                        onClick={() => handlePersonClick(person.id)}
                      >
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-transparent group-hover:border-blue-400 transition-colors duration-200">
                          <Image
                            src={person.avatar || '/placeholder-person.jpg'}
                            alt={person.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-full" />
                        </div>
                        <span className="mt-2 text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                          {person.name}
                        </span>
                        <span className="text-xs text-gray-500">{person.count} photos</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyStateMessage
                    icon={<Users className="w-16 h-16 text-gray-400 opacity-70 mb-4" />}
                    title="No People Recognized"
                    message="As we recognize faces in your photos, they'll appear here for easy organization."
                    actionText="Enable Face Recognition"
                    onActionClick={() => toast.info("Face recognition feature coming soon")}
                  />
                )}
              </div>
            </div>
          </TabsContent>
      </Tabs>

      {fileIdToShare && (
        <ShareDialog
          fileId={fileIdToShare}
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
        />
      )}

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
              setConversionStatus("idle");
            }}
            conversionType={conversionType}
          />
        </ErrorBoundary>
      )}
    </div>
  );
};

class ErrorBoundary extends Component<{ children: ReactNode, fallbackMessage?: string }, { hasError: boolean }> {
  constructor(props: { children: ReactNode, fallbackMessage?: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
          <h2 className="font-bold text-sm sm:text-base md:text-lg mb-2">Oops! Something went wrong.</h2>
          <p className="text-xs sm:text-sm">{this.props.fallbackMessage || "We encountered an issue with this part of the application. Please try again later."}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default PhotosPage;