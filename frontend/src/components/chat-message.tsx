import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bot, Check, Copy, FileText } from "lucide-react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { usePreferences } from "@/contexts/preferences-context";
import {
  useAIState,
  useChannelStateContext,
  useMessageContext,
  useMessageTextStreaming,
} from "stream-chat-react";

const ChatMessage: React.FC = () => {
  const { t } = usePreferences();
  const { message } = useMessageContext();
  const { channel } = useChannelStateContext();
  const { aiState } = useAIState(channel);

  const { streamedMessageText } = useMessageTextStreaming({
    text: message.text ?? "",
    renderingLetterCount: 10,
    streamingLetterIntervalMs: 50,
  });

  const isUser = !message.user?.id?.startsWith("ai-bot");
  const [copied, setCopied] = useState(false);
  const attachments = message.attachments || [];

  const copyToClipboard = async () => {
    if (streamedMessageText) {
      await navigator.clipboard.writeText(streamedMessageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getAiStateMessage = () => {
    switch (aiState) {
      case "AI_STATE_THINKING":
        return t("chat.aiThinking");
      case "AI_STATE_GENERATING":
        return t("chat.aiGenerating");
      case "AI_STATE_EXTERNAL_SOURCES":
        return t("chat.aiExternalSources");
      case "AI_STATE_ERROR":
        return t("chat.aiError");
      default:
        return null;
    }
  };

  const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className={cn(
        "group mb-3 flex w-full min-w-0 px-2.5 sm:mb-4 sm:px-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex min-w-0 max-w-[92%] sm:max-w-[78%] lg:max-w-[64%] xl:max-w-[56rem]",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {!isUser && (
          <div className="mr-2 hidden flex-shrink-0 self-end sm:mr-3 sm:block">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-muted text-muted-foreground">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        <div className="flex min-w-0 flex-col space-y-1">
          <div
            className={cn(
              "min-w-0 rounded-2xl px-3 py-2.5 text-[0.92rem] leading-relaxed transition-all duration-200 sm:px-4 sm:py-3 sm:text-sm",
              isUser
                ? "str-chat__message-bubble str-chat__message-bubble--me rounded-br-md"
                : "str-chat__message-bubble rounded-bl-md"
            )}
          >
            {attachments.length > 0 && (
              <div className="mb-3 space-y-2">
                {attachments.map((attachment, index) => {
                  const isImage =
                    attachment.type === "image" || !!attachment.image_url;

                  if (isImage && attachment.image_url) {
                    return (
                      <img
                        key={attachment.id || index}
                        src={attachment.image_url}
                        alt={attachment.title || t("chat.uploadedImage")}
                        className="max-h-60 max-w-full rounded-xl border border-border/50 object-cover"
                      />
                    );
                  }

                  return (
                    <div
                      key={attachment.id || index}
                      className="flex min-w-0 items-center gap-3 rounded-xl border border-border/50 bg-background/40 p-3"
                    >
                      <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {attachment.title || t("chat.attachment")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {attachment.mime_type || attachment.type || t("chat.file")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="min-w-0 break-words [overflow-wrap:anywhere]">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
                  ),
                  code: ({ children, ...props }) => {
                    const { node, ...rest } = props;
                    const isInline = !rest.className?.includes("language-");

                    return isInline ? (
                      <code
                        className="px-1.5 py-0.5 rounded text-xs font-mono bg-black/10 dark:bg-white/10"
                        {...rest}
                      >
                        {children}
                      </code>
                    ) : (
                      <pre className="my-2 max-w-full overflow-x-auto rounded-md bg-black/5 p-3 text-xs font-mono dark:bg-white/5">
                        <code {...rest}>{children}</code>
                      </pre>
                    );
                  },
                  ul: ({ children }) => (
                    <ul className="list-disc ml-4 mb-3 space-y-1">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal ml-4 mb-3 space-y-1">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-3 pl-3 my-2 italic border-current/30">
                      {children}
                    </blockquote>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-lg font-semibold mb-2 mt-4 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-semibold mb-2 mt-3 first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-semibold mb-2 mt-3 first:mt-0">
                      {children}
                    </h3>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold">{children}</strong>
                  ),
                  em: ({ children }) => <em className="italic">{children}</em>,
                }}
              >
                {streamedMessageText || message.text || ""}
              </ReactMarkdown>
            </div>

            {aiState && !streamedMessageText && !message.text && (
              <div className="flex items-center gap-2 mt-2 pt-2">
                <span className="text-xs opacity-70">
                  {getAiStateMessage()}
                </span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-current rounded-full typing-dot opacity-70"></div>
                  <div className="w-1 h-1 bg-current rounded-full typing-dot opacity-70"></div>
                  <div className="w-1 h-1 bg-current rounded-full typing-dot opacity-70"></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-muted-foreground/70">
              {formatTime(message.created_at || new Date())}
            </span>

            {!isUser && !!streamedMessageText && (
              <div className="opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="h-6 px-2 text-xs hover:bg-muted rounded-md"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 mr-1 text-green-600" />
                      <span className="text-green-600">{t("chat.copied")}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      <span>{t("chat.copy")}</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
