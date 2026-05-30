import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowRight, FileText, Loader2, Square, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
// import { FileUploadButton } from "./file-upload-button";
import { FileUploadButton } from "./fileUploadButton";
import { WritingPromptsToolbar } from "./writing-prompts-toolbar";
import { usePreferences } from "@/contexts/preferences-context";

export interface ChatInputProps {
  className?: string;
  sendMessage: (message: {
    text: string;
    attachments?: Array<Record<string, unknown>>;
    skip_ai_analysis?: boolean;
  }) => Promise<void> | void;
  isGenerating?: boolean;
  onStopGenerating?: () => void;
  placeholder?: string;
  value: string;
  onValueChange: (text: string) => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
  showPromptToolbar?: boolean;
  channelId?: string;
  backendUrl?: string;
}

interface SelectedFile {
  base64: string;
  mimeType: string;
  fileName: string;
  previewUrl?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  className,
  sendMessage,
  isGenerating,
  onStopGenerating,
  placeholder = "Ask me to write something, or paste text to improve...",
  value,
  onValueChange,
  textareaRef: externalTextareaRef,
  showPromptToolbar = false,
  channelId,
  backendUrl,
}) => {
  const { t } = usePreferences();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const internalTextareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = externalTextareaRef || internalTextareaRef;

  const handlePromptSelect = (prompt: string) => {
    onValueChange(value ? `${value.trim()} ${prompt}` : prompt);
    textareaRef.current?.focus();
  };

  const updateTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 120;
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [textareaRef]);

  useEffect(() => {
    updateTextareaHeight();
  }, [value, updateTextareaHeight]);

  const handleFileSelect = (file: SelectedFile) => {
    setSelectedFile(file);
    textareaRef.current?.focus();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!value.trim() && !selectedFile) || isLoading || isGenerating) return;

    setIsLoading(true);
    try {
      if (selectedFile && channelId && backendUrl) {
        const messageText =
          value.trim() ||
          (selectedFile.mimeType.startsWith("image/")
            ? t("chat.analyzeImage")
            : t("chat.analyzeFile"));
        const attachment = selectedFile.mimeType.startsWith("image/")
          ? {
              type: "image",
              image_url: selectedFile.previewUrl,
              fallback: selectedFile.fileName,
              mime_type: selectedFile.mimeType,
              title: selectedFile.fileName,
            }
          : {
              type: "file",
              asset_url: `data:${selectedFile.mimeType};base64,${selectedFile.base64}`,
              mime_type: selectedFile.mimeType,
              title: selectedFile.fileName,
              file_size: selectedFile.base64.length,
            };

        await sendMessage({
          text: messageText,
          attachments: [attachment],
          skip_ai_analysis: true,
        });

        const response = await fetch(`${backendUrl}/analyze-file`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64Data: selectedFile.base64,
            mimeType: selectedFile.mimeType,
            fileName: selectedFile.fileName,
            prompt: value.trim() || undefined,
            channelId,
            channelType: "messaging",
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.reason || t("chat.fileAnalysisFailed"));
        }
        handleRemoveFile();
        onValueChange("");
      } else if (value.trim()) {
        await sendMessage({ text: value.trim() });
        onValueChange("");
      }

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const canSend = (value.trim() || selectedFile) && !isLoading && !isGenerating;

  return (
    <div
      className={cn(
        "flex flex-col bg-background/80 backdrop-blur-xl",
        showPromptToolbar && "border-t border-border/60"
      )}
    >
      {showPromptToolbar && (
        <WritingPromptsToolbar onPromptSelect={handlePromptSelect} />
      )}

      <div className={cn("p-4", className)}>
        {/* File Preview — ChatGPT style */}
        {selectedFile && (
          <div className="mb-3 flex w-fit max-w-xs items-center gap-2 rounded-lg border border-border/70 bg-muted/45 p-2 shadow-sm">
            {selectedFile.previewUrl ? (
              <img
                src={selectedFile.previewUrl}
                alt="Preview"
                className="h-10 w-10 flex-shrink-0 rounded-md object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-red-100 dark:bg-red-900/30">
                <FileText className="h-5 w-5 text-red-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{selectedFile.fileName}</p>
              <p className="text-xs text-muted-foreground">
                {selectedFile.mimeType === "application/pdf"
                  ? t("chat.fileTypePdf")
                  : t("chat.fileTypeImage")}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemoveFile}
              className="h-6 w-6 flex-shrink-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Input Area */}
        <div className="relative rounded-lg border border-border/70 bg-card/70 p-1 shadow-[0_16px_36px_hsl(222_47%_4%/0.12)] transition-all focus-within:border-primary/35 focus-within:shadow-primary/10">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedFile
                ? t("chat.askAboutFile")
                : placeholder
            }
            className={cn(
              "min-h-[52px] max-h-[120px] resize-none border-0 bg-transparent py-3 pl-4 pr-24 text-sm shadow-none",
              "focus-visible:ring-0"
            )}
            disabled={isLoading || isGenerating}
          />

          {/* Right side buttons */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1">
            {/* File Upload */}
            {channelId && backendUrl && !isGenerating && !selectedFile && (
              <FileUploadButton onFileSelect={handleFileSelect} />
            )}

            {/* Clear text */}
            {value.trim() && !isLoading && !isGenerating && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onValueChange("")}
                className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            {/* Send / Stop */}
            {isGenerating ? (
              <Button
                type="button"
                onClick={onStopGenerating}
                className="h-9 w-9 rounded-md p-0"
                variant="destructive"
              >
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={!canSend}
                className={cn(
                  "h-9 w-9 rounded-md p-0 transition-all duration-200",
                  "disabled:opacity-30 disabled:cursor-not-allowed",
                  !canSend ? "bg-muted hover:bg-muted" : ""
                )}
                variant={canSend ? "default" : "ghost"}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
