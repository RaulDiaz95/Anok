import React from "react";

type FlyerFrameSize = "sm" | "md" | "lg" | "xl";

const sizeMap: Record<FlyerFrameSize, string> = {
  sm: "max-w-[200px]",   // 200x300
  md: "max-w-[300px]",   // 300x450
  lg: "max-w-[400px]",   // 400x600
  xl: "max-w-[600px]",   // 600x900
};

type FlyerFrameProps = {
  src?: string | null;
  alt?: string;
  size?: FlyerFrameSize;
  placeholder?: React.ReactNode;
  className?: string;
};

export function FlyerFrame({
  src,
  alt = "Event flyer",
  size = "lg",
  placeholder,
  className = "",
}: FlyerFrameProps) {
  const sizeClass = sizeMap[size] || sizeMap.lg;
  return (
    <div
      className={`w-full ${sizeClass} aspect-[2/3] rounded-xl border border-[#b11226]/20 overflow-hidden bg-black/20 shadow-lg flex items-center justify-center ${className}`}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        placeholder ?? (
          <span className="text-sm text-gray-400">Flyer not available</span>
        )
      )}
    </div>
  );
}
