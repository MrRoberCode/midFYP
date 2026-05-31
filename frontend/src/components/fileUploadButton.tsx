import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Paperclip } from "lucide-react";
import React, { useRef } from "react";
import { usePreferences } from "@/contexts/preferences-context";

interface FileUploadButtonProps {
  onFileSelect: (file: { base64: string; mimeType: string; fileName: string; previewUrl?: string }) => void;
  className?: string;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFileSelect,
  className,
}) => {
  const { t } = usePreferences();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const SUPPORTED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const MAX_SIZE_MB = 10;
  const MAX_SOURCE_IMAGE_SIZE_MB = 25;
  const TARGET_IMAGE_SIZE_MB = 3;
  const IMAGE_OUTPUT_TYPE = "image/jpeg";
  const IMAGE_MAX_DIMENSIONS = [2400, 2200, 2000, 1800];
  const IMAGE_QUALITY_STEPS = [0.92, 0.88, 0.84, 0.8, 0.76];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!SUPPORTED_TYPES.includes(file.type)) {
      alert(t("chat.invalidFileType"));
      return;
    }

    const isImage = file.type.startsWith("image/");
    const maxSourceSizeMb = isImage ? MAX_SOURCE_IMAGE_SIZE_MB : MAX_SIZE_MB;

    if (file.size > maxSourceSizeMb * 1024 * 1024) {
      alert(t("chat.maxFileSize", { size: String(maxSourceSizeMb) }));
      return;
    }

    let preparedFile: { file: File; mimeType: string; fileName: string };
    try {
      preparedFile = isImage
        ? await compressImageForAnalysis(file)
        : { file, mimeType: file.type, fileName: file.name };
    } catch (error) {
      console.error("Image compression failed:", error);
      alert(t("chat.fileAnalysisFailed"));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const base64 = await fileToBase64(preparedFile.file);
    const previewUrl = preparedFile.mimeType.startsWith("image/")
      ? `data:${preparedFile.mimeType};base64,${base64}`
      : undefined;

    onFileSelect({
      base64,
      mimeType: preparedFile.mimeType,
      fileName: preparedFile.fileName,
      previewUrl,
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const compressImageForAnalysis = async (
    file: File
  ): Promise<{ file: File; mimeType: string; fileName: string }> => {
    const targetBytes = TARGET_IMAGE_SIZE_MB * 1024 * 1024;
    const image = await loadImage(file);

    let bestBlob: Blob | null = null;

    for (const maxDimension of IMAGE_MAX_DIMENSIONS) {
      const { width, height } = fitInside(
        image.naturalWidth,
        image.naturalHeight,
        maxDimension
      );
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Image compression is not supported in this browser.");

      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(image, 0, 0, width, height);

      for (const quality of IMAGE_QUALITY_STEPS) {
        const blob = await canvasToBlob(canvas, IMAGE_OUTPUT_TYPE, quality);

        if (!bestBlob || blob.size < bestBlob.size) {
          bestBlob = blob;
        }

        if (blob.size <= targetBytes) {
          const fileName = compressedImageName(file.name);

          return {
            file: blobToFile(blob, fileName),
            mimeType: IMAGE_OUTPUT_TYPE,
            fileName,
          };
        }
      }
    }

    if (!bestBlob || (file.size <= targetBytes && file.size <= bestBlob.size)) {
      return { file, mimeType: file.type, fileName: file.name };
    }

    const fileName = compressedImageName(file.name);
    return {
      file: blobToFile(bestBlob, fileName),
      mimeType: IMAGE_OUTPUT_TYPE,
      fileName,
    };
  };

  const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const url = URL.createObjectURL(file);

      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Unable to read image."));
      };
      image.src = url;
    });
  };

  const fitInside = (width: number, height: number, maxDimension: number) => {
    const scale = Math.min(1, maxDimension / Math.max(width, height));

    return {
      width: Math.max(1, Math.round(width * scale)),
      height: Math.max(1, Math.round(height * scale)),
    };
  };

  const canvasToBlob = (
    canvas: HTMLCanvasElement,
    type: string,
    quality: number
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Image compression failed."));
        },
        type,
        quality
      );
    });
  };

  const blobToFile = (blob: Blob, fileName: string) => {
    return new File([blob], fileName, {
      type: blob.type,
      lastModified: Date.now(),
    });
  };

  const compressedImageName = (fileName: string) => {
    const extensionIndex = fileName.lastIndexOf(".");
    const baseName = extensionIndex > 0 ? fileName.slice(0, extensionIndex) : fileName;

    return `${baseName || "image"}-compressed.jpg`;
  };

  return (
    <div className={cn("relative", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
        className="h-9 w-9 rounded-md text-muted-foreground hover:text-foreground sm:h-8 sm:w-8"
        title={t("chat.uploadPdfOrImage")}
      >
        <Paperclip className="h-4 w-4" />
      </Button>
    </div>
  );
};
