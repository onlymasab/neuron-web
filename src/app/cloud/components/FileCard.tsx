import Image from "next/image";
import { CloudModel } from "@/types/CloudModel";
import { Button } from "@/components/ui/button";
import { FileText, Folder, ImageIcon, Music, VideoIcon } from "lucide-react";

interface FileCardProps {
  file: CloudModel;
}

export default function FileCard({ file }: FileCardProps) {
  // Determine the icon based on file type
  const getFileIcon = () => {
    if (file.is_folder) return <Folder className="w-5 h-5" />;
    if (file.file_extension === "pdf") return <FileText className="w-5 h-5" />;
    if (file.type === "image") return <ImageIcon className="w-5 h-5" />;
    if (file.type === "audio") return <Music className="w-5 h-5" />;
    if (file.type === "video") return <VideoIcon className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  return (
    <div className="bg-white border shadow-sm rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="bg-gray-100 p-2 rounded-full">
          {getFileIcon()}
        </div>
        <div className="truncate">
          <p className="font-medium text-sm truncate">{file.name}</p>
          <p className="text-xs text-gray-500">
            {file.updated_at ? new Date(file.updated_at).toLocaleDateString() : "-"}
          </p>
        </div>
      </div>
      <div className="text-xs text-gray-400">
        {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "-"}
      </div>
      {file.file_url && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(file.file_url, "_blank")}
        >
          View
        </Button>
      )}
    </div>
  );
}
