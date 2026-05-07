import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useChatContext } from "stream-chat-react";
import { Channel } from "stream-chat";
import { Loader2 } from "lucide-react";
import { usePreferences } from "@/contexts/preferences-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User } from "../types/auth";
import { ChatProvider } from "../providers/chat-provider";
import { BillingPage } from "./billing-page";
import { ChatInterface } from "./chat-interface";
import { ChatSidebar } from "./chat-sidebar";

interface AuthenticatedAppProps {
  user: User;
  onLogout: () => void;
}

export const AuthenticatedApp = ({ user, onLogout }: AuthenticatedAppProps) => (
  <ChatProvider user={user}>
    <AuthenticatedCore user={user} onLogout={onLogout} />
  </ChatProvider>
);

const AuthenticatedCore = ({ user, onLogout }: AuthenticatedAppProps) => {
  const { t } = usePreferences();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [channelToDelete, setChannelToDelete] = useState<Channel | null>(null);
  const { client, setActiveChannel } = useChatContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { channelId } = useParams<{ channelId: string }>();
  const backendUrl = import.meta.env.VITE_AI_URL as string;
  const isBillingView = location.pathname.startsWith("/billing");

  useEffect(() => {
    const syncChannelWithUrl = async () => {
      if (!client) return;

      if (channelId) {
        const channel = client.channel("messaging", channelId);
        await channel.watch();
        setActiveChannel(channel);
      } else {
        setActiveChannel(undefined);
      }
    };

    syncChannelWithUrl();
  }, [channelId, client, setActiveChannel]);

  const handleNewChatMessage = async (message: { text: string }) => {
    if (!user.id) return;

    try {
      const newChannel = client.channel("messaging", uuidv4(), {
        name: message.text.substring(0, 50),
        members: [user.id],
      });
      await newChannel.watch();

      const memberAddedPromise = new Promise<void>((resolve) => {
        const unsubscribe = newChannel.on("member.added", (event) => {
          if (event.member?.user?.id && event.member.user.id !== user.id) {
            unsubscribe.unsubscribe();
            resolve();
          }
        });
      });

      const response = await fetch(`${backendUrl}/start-ai-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel_id: newChannel.id,
          channel_type: "messaging",
        }),
      });

      if (!response.ok) {
        throw new Error("AI agent failed to join the chat.");
      }

      setActiveChannel(newChannel);
      navigate(`/chat/${newChannel.id}`);

      await memberAddedPromise;
      await newChannel.sendMessage(message);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      console.error("Error creating new chat:", errorMessage);
    }
  };

  const handleDeleteConfirm = async () => {
    if (channelToDelete) {
      try {
        if (channelId === channelToDelete.id) {
          navigate("/");
        }
        await channelToDelete.delete();
      } catch (error) {
        console.error("Error deleting channel:", error);
      }
    }

    setShowDeleteDialog(false);
    setChannelToDelete(null);
  };

  if (!client) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">
          {t("common.connectingChat")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full">
      <ChatSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
        onNewChat={() => {
          setActiveChannel(undefined);
          navigate("/");
          setSidebarOpen(false);
        }}
        onChannelDelete={(channel) => {
          setChannelToDelete(channel);
          setShowDeleteDialog(true);
        }}
      />

      {isBillingView ? (
        <div className="min-w-0 flex-1">
          <BillingPage />
        </div>
      ) : (
        <div className="flex min-w-0 flex-1 flex-col">
          <ChatInterface
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onNewChatMessage={handleNewChatMessage}
            backendUrl={backendUrl}
          />
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dialog.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("dialog.deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              {t("dialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {t("dialog.deleteSession")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
