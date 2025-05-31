// components/BlurImage.tsx
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true);
  // Fallback image if src is empty or invalid
  const fallbackSrc = "/images/fallback-image.png"; // Ensure you have a fallback image in your public folder

  return (
    <Image
      className={cn(
        "h-full w-full transition duration-300 object-cover",
        isLoading ? "blur-sm" : "blur-0",
        className
      )}
      onLoad={() => setLoading(false)}
      onError={() => setLoading(false)} // Handle image load errors
      src={src && typeof src === "string" && src.trim() !== "" ? src : fallbackSrc}
      width={width || 100}
      height={height || 100}
      loading="lazy"
      decoding="async"
      blurDataURL={typeof src === "string" && src.trim() !== "" ? src : undefined}
      alt={alt || "Background of a beautiful view"}
      {...rest}
    />
  );
};