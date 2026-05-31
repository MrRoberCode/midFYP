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
  const closeAfterNavigation = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="chat-sidebar"
        aria-label={t("chat.sessions")}
        aria-hidden={!isOpen}
        inert={!isOpen ? "" : undefined}
        className={cn(
          "premium-panel fixed inset-y-0 left-0 z-50 flex w-[min(20rem,calc(100vw-1.5rem))] transform flex-col overflow-hidden border-r transition-[transform,opacity,width,margin] duration-300 ease-out will-change-transform lg:relative lg:inset-auto lg:w-80 lg:shrink-0 lg:rounded-lg",
          isOpen
            ? "translate-x-0 opacity-100 lg:mr-3"
            : "-translate-x-full opacity-0 pointer-events-none lg:mr-0 lg:w-0 lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg premium-gradient shadow-lg shadow-primary/20">
              <MessageCircle className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold">{t("chat.sessions")}</h2>
              <p className="truncate text-xs text-muted-foreground">{t("chat.brandSubtitle")}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <SettingsDialog />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-1 px-2.5 py-3">
            <ChannelList
              filters={filters}
              sort={sort}
              options={options}
              EmptyStateIndicator={ChannelListEmptyStateIndicator}
              Preview={(previewProps) => (
                <div
                  role="button"
                  tabIndex={isOpen ? 0 : -1}
                  className={cn(
                    "group mb-1 grid w-full cursor-pointer grid-cols-[1rem_minmax(0,1fr)_2rem] items-center gap-2 rounded-lg border border-transparent px-2.5 py-2.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    previewProps.active
                      ? "border-primary/30 bg-primary/10 text-foreground shadow-sm"
                      : "hover:border-border/80 hover:bg-muted/60",
                  )}
                  onClick={() => {
                    setActiveChannel(previewProps.channel);
                    navigate(`/chat/${previewProps.channel.id}`);
                    closeAfterNavigation();
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActiveChannel(previewProps.channel);
                      navigate(`/chat/${previewProps.channel.id}`);
                      closeAfterNavigation();
                    }
                  }}
                >
                  <MessageSquare className="h-4 w-4 text-primary/80" />
                  <span className="min-w-0 truncate text-sm font-medium leading-5">
                    {previewProps.channel.data?.name || t("chat.newSession")}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 justify-self-end text-muted-foreground opacity-70 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 sm:opacity-0 sm:focus-visible:opacity-100"
                    onClick={async (e) => {
                      e.stopPropagation();
                      onChannelDelete(previewProps.channel);
                    }}
                    title={t("dialog.deleteTitle")}
                    aria-label={t("dialog.deleteTitle")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            />
          </div>
        </ScrollArea>

        <div className="border-t border-border/70 p-3">
          <Button onClick={onNewChat} className="h-11 w-full justify-start">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("chat.newSession")}
          </Button>
        </div>

        <div className="border-t border-border/70 bg-background/40 p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto w-full items-center justify-start p-2 text-left"
                aria-label={user.name || t("common.online")}
              >
                <Avatar className="mr-2 h-8 w-8">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("common.online")}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72" align="end">
              <DropdownMenuItem
                onClick={() => {
                  navigate("/billing");
                  closeAfterNavigation();
                }}
              >
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
      </aside>
    </>
  );
};
