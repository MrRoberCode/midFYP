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
    <div className="flex h-full flex-col bg-transparent">
      <div className="flex flex-1 items-center justify-center overflow-y-auto p-4 sm:p-6">
        <div className="w-full max-w-3xl text-center">
          <div className="mb-7 animate-rise">
            <div className="relative mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl premium-gradient shadow-xl shadow-primary/20">
              <div className="absolute inset-0 rounded-2xl bg-white/10 animate-pulse"></div>
              <Bot className="relative z-10 h-8 w-8 text-primary-foreground" />
              <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="mb-2 text-3xl font-semibold text-foreground sm:text-4xl">
              {t("chat.heroTitle")}
            </h1>
            <p className="mx-auto mb-4 max-w-xl text-sm leading-6 text-muted-foreground">
              {t("chat.heroDescription")}
            </p>
          </div>

          <div className="animate-rise mb-6 rounded-lg border border-border/70 bg-card/60 p-3 shadow-xl shadow-black/5 backdrop-blur">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {t("chat.writeToday")}
            </h2>

            <Tabs defaultValue="business" className="w-full">
              <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-muted/60 p-1 sm:grid-cols-4">
                {writingCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex items-center gap-1.5 rounded-md py-2 text-xs"
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
                        className="group rounded-lg border border-border/70 bg-background/55 p-3 text-left text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/5 hover:shadow-md"
                      >
                        <span className="text-foreground transition-colors group-hover:text-primary">
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

      <div className="border-t border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="p-4">
          <ChatInput
            sendMessage={onNewChatMessage}
            placeholder={t("chat.inputPlaceholder")}
            value={inputText}
            onValueChange={setInputText}
            className="!p-4"
            isGenerating={false}
            onStopGenerating={() => {}}
          />
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>{t("chat.pressEnter")}</span>
            <span>&bull;</span>
            <span>{t("chat.shiftEnter")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageListEmptyIndicator = () => {
  const { t } = usePreferences();

  return (
    <div className="flex h-full items-center justify-center">
      <div className="px-4 text-center">
        <div className="relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Bot className="relative z-10 h-6 w-6 text-primary/80" />
        </div>
        <h2 className="mb-2 text-lg font-medium text-foreground">
          {t("chat.readyTitle")}
        </h2>
        <p className="text-sm text-muted-foreground">
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
    <div className="flex-1 min-h-0">
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
        className="!p-4"
        isGenerating={isGenerating}
        onStopGenerating={handleStopGenerating}
        channelId={activeChannel?.id}
        backendUrl={backendUrl}
      />
    );
  };

  return (
    <div className="flex h-full flex-col bg-transparent">
      <header className="z-10 flex shrink-0 items-center justify-between border-b border-border/70 bg-background/75 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="h-9 w-9 lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg premium-gradient shadow-lg shadow-primary/20">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              {channel?.id && agentStatus.status === "connected" && (
                <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-background bg-green-500"></div>
              )}
            </div>
            <div>
              <h2 className="max-w-[42vw] truncate text-sm font-semibold text-foreground sm:max-w-md">
                {channel?.data?.name || t("chat.newSession")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("chat.brandSubtitle")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {channel?.id && agentStatus.status === "connected" && (
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 sm:flex">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="text-xs font-medium text-muted-foreground">
                {t("chat.online")}
              </span>
            </div>
          )}
          <SettingsDialog />
        </div>
      </header>

      <div className="flex flex-1 flex-col min-h-0">
        {!channel ? (
          <EmptyStateWithInput onNewChatMessage={onNewChatMessage} />
        ) : (
          <Channel channel={channel}>
            <Window>
              <MessageListContent />
              <ChannelMessageInputComponent />
            </Window>
          </Channel>
        )}
      </div>
    </div>
  );
};
