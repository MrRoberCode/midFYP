import { useEffect, useRef, useState } from "react";
import { useAIAgentStatus } from "@/hooks/use-ai-agent-status";
import { usePreferences } from "@/contexts/preferences-context";
import {
  Bot,
  Briefcase,
  FileText,
  Lightbulb,
  Menu,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import {
  Channel,
  MessageList,
  useAIState,
  useChannelActionContext,
  useChannelStateContext,
  useChatContext,
  Window,
} from "stream-chat-react";
import { ChatInput, type ChatInputProps } from "./chat-input";
import ChatMessage from "./chat-message";
import { SettingsDialog } from "./settings-dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ChatInterfaceProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onNewChatMessage: (message: { text: string }) => Promise<void>;
  backendUrl: string;
}

const EmptyStateWithInput: React.FC<{
  onNewChatMessage: ChatInputProps["sendMessage"];
}> = ({ onNewChatMessage }) => {
  const [inputText, setInputText] = useState("");
  const { t } = usePreferences();

  const writingCategories = [
    {
      id: "business",
      icon: <Briefcase className="h-4 w-4" />,
      title: t("chat.business"),
      prompts: [
        t("chat.prompt.business1"),
        t("chat.prompt.business2"),
        t("chat.prompt.business3"),
        t("chat.prompt.business4"),
      ],
    },
    {
      id: "content",
      icon: <FileText className="h-4 w-4" />,
      title: t("chat.content"),
      prompts: [
        t("chat.prompt.content1"),
        t("chat.prompt.content2"),
        t("chat.prompt.content3"),
        t("chat.prompt.content4"),
      ],
    },
    {
      id: "communication",
      icon: <MessageSquare className="h-4 w-4" />,
      title: t("chat.communication"),
      prompts: [
        t("chat.prompt.communication1"),
        t("chat.prompt.communication2"),
        t("chat.prompt.communication3"),
        t("chat.prompt.communication4"),
      ],
    },
    {
      id: "creative",
      icon: <Lightbulb className="h-4 w-4" />,
      title: t("chat.creative"),
      prompts: [
        t("chat.prompt.creative1"),
        t("chat.prompt.creative2"),
        t("chat.prompt.creative3"),
        t("chat.prompt.creative4"),
      ],
    },
  ];

  return (
    <div className="flex h-full min-w-0 flex-col bg-transparent">
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto overflow-x-hidden px-3 py-4 sm:px-5 sm:py-6 lg:px-6">
        <div className="w-full max-w-3xl text-center">
          <div className="mb-5 animate-rise sm:mb-7">
            <div className="relative mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl premium-gradient shadow-xl shadow-primary/20 sm:mb-5 sm:h-16 sm:w-16">
              <div className="absolute inset-0 rounded-2xl bg-white/10 animate-pulse"></div>
              <Bot className="relative z-10 h-7 w-7 text-primary-foreground sm:h-8 sm:w-8" />
              <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="mx-auto mb-2 max-w-[18rem] text-[clamp(1.65rem,8vw,2.5rem)] font-semibold leading-tight text-foreground sm:max-w-none">
              {t("chat.heroTitle")}
            </h1>
            <p className="mx-auto mb-3 max-w-xl text-[clamp(0.875rem,3.6vw,0.95rem)] leading-6 text-muted-foreground sm:mb-4">
              {t("chat.heroDescription")}
            </p>
          </div>

          <div className="animate-rise mb-4 rounded-lg border border-border/70 bg-card/60 p-2.5 shadow-xl shadow-black/5 backdrop-blur sm:mb-6 sm:p-3">
            <h2 className="mb-3 px-1 text-[clamp(0.78rem,3.5vw,0.9rem)] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:mb-4 sm:tracking-[0.16em]">
              {t("chat.writeToday")}
            </h2>

            <Tabs defaultValue="business" className="w-full">
              <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-muted/60 p-1 sm:grid-cols-4">
                {writingCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="min-w-0 gap-1.5 rounded-md px-2 py-2 text-xs"
                  >
                    {category.icon}
                    <span className="hidden sm:inline">{category.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {writingCategories.map((category) => (
                <TabsContent
                  key={category.id}
                  value={category.id}
                  className="mt-4"
                >
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {category.prompts.map((prompt, promptIndex) => (
                      <button
                        key={promptIndex}
                        onClick={() => setInputText(prompt)}
                        className="group min-w-0 rounded-lg border border-border/70 bg-background/55 p-2.5 text-left text-[0.83rem] leading-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/5 hover:shadow-md sm:p-3 sm:text-sm"
                      >
                        <span className="break-words text-foreground transition-colors group-hover:text-primary">
                          {prompt}
                        </span>
                      </button>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-4xl px-2.5 py-2.5 sm:px-4 sm:py-3">
          <ChatInput
            sendMessage={onNewChatMessage}
            placeholder={t("chat.inputPlaceholder")}
            value={inputText}
            onValueChange={setInputText}
            className="!p-0"
            isGenerating={false}
            onStopGenerating={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

const MessageListEmptyIndicator = () => {
  const { t } = usePreferences();

  return (
    <div className="flex h-full min-w-0 items-center justify-center px-3">
      <div className="max-w-sm px-2 text-center">
        <div className="relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Bot className="relative z-10 h-6 w-6 text-primary/80" />
        </div>
        <h2 className="mb-2 text-[clamp(1rem,4vw,1.125rem)] font-medium text-foreground">
          {t("chat.readyTitle")}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {t("chat.readyDescription")}
        </p>
      </div>
    </div>
  );
};

const MessageListContent = () => {
  const { messages, thread } = useChannelStateContext();

  if (thread) return null;

  return (
    <div className="min-h-0 min-w-0 flex-1">
      {!messages?.length ? (
        <MessageListEmptyIndicator />
      ) : (
        <MessageList Message={ChatMessage} />
      )}
    </div>
  );
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  onNewChatMessage,
  backendUrl,
}) => {
  const { channel } = useChatContext();
  const { t } = usePreferences();
  const agentStatus = useAIAgentStatus({
    channelId: channel?.id ?? null,
    backendUrl,
  });

  useEffect(() => {
    if (channel?.id && agentStatus.status === "disconnected") {
      agentStatus.connectAgent();
    }
  }, [agentStatus, channel?.id]);

  const ChannelMessageInputComponent = () => {
    const { sendMessage } = useChannelActionContext();
    const { channel: activeChannel, messages } = useChannelStateContext();
    const { aiState } = useAIState(activeChannel);
    const [inputText, setInputText] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const isGenerating =
      aiState === "AI_STATE_THINKING" ||
      aiState === "AI_STATE_GENERATING" ||
      aiState === "AI_STATE_EXTERNAL_SOURCES";

    const handleStopGenerating = () => {
      if (!activeChannel) return;

      const aiMessage = [...messages]
        .reverse()
        .find((message) => message.user?.id.startsWith("ai-bot"));

      if (aiMessage) {
        activeChannel.sendEvent({
          type: "ai_indicator.stop",
          cid: activeChannel.cid,
          message_id: aiMessage.id,
        });
      }
    };

    return (
      <ChatInput
        sendMessage={sendMessage}
        value={inputText}
        onValueChange={setInputText}
        textareaRef={textareaRef}
        showPromptToolbar={true}
        className="!px-3 !py-3 sm:!px-4"
        isGenerating={isGenerating}
        onStopGenerating={handleStopGenerating}
        channelId={activeChannel?.id}
        backendUrl={backendUrl}
      />
    );
  };

  return (
    <div className="flex h-full min-w-0 flex-col bg-transparent">
      <header className="z-10 flex min-w-0 shrink-0 items-center justify-between gap-2 border-b border-border/70 bg-background/75 px-2.5 py-2.5 backdrop-blur-xl sm:px-4 sm:py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="h-10 w-10 shrink-0 sm:h-9 sm:w-9"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            aria-controls="chat-sidebar"
            aria-expanded={isSidebarOpen}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="relative shrink-0 [@media(max-width:360px)]:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg premium-gradient shadow-lg shadow-primary/20">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              {channel?.id && agentStatus.status === "connected" && (
                <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-background bg-green-500"></div>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-foreground sm:max-w-md">
                {channel?.data?.name || t("chat.newSession")}
              </h2>
              <p className="truncate text-xs text-muted-foreground [@media(max-width:360px)]:hidden">
                {t("chat.brandSubtitle")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {channel?.id && agentStatus.status === "connected" && (
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 sm:flex">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="text-xs font-medium text-muted-foreground">
                {t("chat.online")}
              </span>
            </div>
          )}
          {!isSidebarOpen && <SettingsDialog />}
        </div>
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {!channel ? (
          <EmptyStateWithInput onNewChatMessage={onNewChatMessage} />
        ) : (
          <Channel channel={channel}>
            <div className="chat-channel-shell min-w-0">
              <Window>
                <MessageListContent />
                <ChannelMessageInputComponent />
              </Window>
            </div>
          </Channel>
        )}
      </div>
    </div>
  );
};
