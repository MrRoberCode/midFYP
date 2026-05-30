import { Bot, Loader2 } from "lucide-react";
import { usePreferences } from "@/contexts/preferences-context";

export const LoadingScreen = () => {
  const { t } = usePreferences();

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-background">
      <div className="soft-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="premium-panel animate-rise relative space-y-4 rounded-lg px-8 py-7 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl premium-gradient shadow-lg shadow-primary/25">
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
