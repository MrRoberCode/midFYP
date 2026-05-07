import { Bot, Loader2 } from "lucide-react";
import { usePreferences } from "@/contexts/preferences-context";

export const LoadingScreen = () => {
  const { t } = usePreferences();

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <Bot className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-sm text-muted-foreground">
              {t("auth.loading")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
