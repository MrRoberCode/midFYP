import { SettingsDialog } from "@/components/settings-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePreferences } from "@/contexts/preferences-context";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  LogOut,
  MessageCircle,
  MessageSquare,
  PlusCircle,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Channel, ChannelFilters, ChannelSort } from "stream-chat";
import { ChannelList, useChatContext } from "stream-chat-react";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onNewChat: () => void;
  onChannelDelete: (channel: Channel) => void;
}

const ChannelListEmptyStateIndicator = () => {
  const { t } = usePreferences();

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/15 via-primary/8 to-transparent shadow-sm">
          <MessageCircle className="h-8 w-8 text-primary/70" />
        </div>
      </div>
      <div className="max-w-xs space-y-2">
        <h3 className="text-sm font-medium text-foreground">
          {t("chat.noSessionsTitle")}
        </h3>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {t("chat.noSessionsDescription")}
        </p>
      </div>
      <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground/60">
        <span>{t("chat.noSessionsHint")}</span>
      </div>
    </div>
  );
};

export const ChatSidebar = ({
  isOpen,
  onClose,
  onLogout,
  onNewChat,
  onChannelDelete,
}: ChatSidebarProps) => {
  const { client, setActiveChannel } = useChatContext();
  const { t } = usePreferences();
  const { user } = client;
  const navigate = useNavigate();

  if (!user) return null;

  const filters: ChannelFilters = {
    type: "messaging",
    members: { $in: [user.id] },
  };
  const sort: ChannelSort = { last_message_at: -1 };
  const options = { state: true, presence: true, limit: 10 };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-80 transform flex-col border-r bg-background transition-transform duration-300 ease-in-out lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{t("chat.sessions")}</h2>
            <SettingsDialog />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-0 p-4">
            <ChannelList
              filters={filters}
              sort={sort}
              options={options}
              EmptyStateIndicator={ChannelListEmptyStateIndicator}
              Preview={(previewProps) => (
                <div
                  className={cn(
                    "group relative mb-1 flex cursor-pointer items-center rounded-lg p-2 transition-colors",
                    previewProps.active
                      ? "bg-primary/20 text-primary-foreground"
                      : "hover:bg-muted/50",
                  )}
                  onClick={() => {
                    setActiveChannel(previewProps.channel);
                    navigate(`/chat/${previewProps.channel.id}`);
                    onClose();
                  }}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span className="flex-1 truncate text-sm font-medium">
                    {previewProps.channel.data?.name || t("chat.newSession")}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 z-10 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={async (e) => {
                      e.stopPropagation();
                      onChannelDelete(previewProps.channel);
                    }}
                    title={t("dialog.deleteTitle")}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground/70 hover:text-destructive" />
                  </Button>
                </div>
              )}
            />
          </div>
        </ScrollArea>

        <div className="border-t p-2">
          <Button onClick={onNewChat} className="w-full justify-start">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("chat.newSession")}
          </Button>
        </div>

        <div className="border-t bg-background p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto w-full items-center justify-start p-2"
              >
                <Avatar className="mr-2 h-8 w-8">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("common.online")}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72" align="end">
              <DropdownMenuItem onClick={() => navigate("/billing")}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>{t("billing.title")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("auth.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};
