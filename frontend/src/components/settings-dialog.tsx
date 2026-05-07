import { Monitor, Palette, Settings2 } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { usePreferences, supportedLanguages, type SupportedLanguage } from "@/contexts/preferences-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export const SettingsDialog = () => {
  const { theme, setTheme } = useTheme();
  const {
    language,
    setLanguage,
    improveModelForEveryone,
    setImproveModelForEveryone,
    t,
  } = usePreferences();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings2 className="h-4 w-4" />
          <span className="sr-only">{t("settings.title")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("settings.title")}</DialogTitle>
          <DialogDescription>{t("settings.description")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
          <section className="rounded-xl border bg-muted/20 p-4">
            <h3 className="text-sm font-semibold text-foreground">
              {t("settings.general")}
            </h3>

            <div className="mt-4 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <Label>{t("settings.appearance")}</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("settings.appearanceDescription")}
                </p>
                <Select value={theme} onValueChange={(value) => setTheme(value as "system" | "dark" | "light")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">{t("theme.system")}</SelectItem>
                    <SelectItem value="dark">{t("theme.dark")}</SelectItem>
                    <SelectItem value="light">{t("theme.light")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <Label>{t("settings.language")}</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("settings.languageDescription")}
                </p>
                <Select value={language} onValueChange={(value) => setLanguage(value as SupportedLanguage)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedLanguages.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-muted/20 p-4">
            <h3 className="text-sm font-semibold text-foreground">
              {t("settings.dataControls")}
            </h3>

            <div className="mt-4 rounded-xl border bg-background p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">
                    {t("settings.improveTitle")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.improveDescription")}{" "}
                    <button className="font-medium text-primary underline-offset-4 hover:underline" type="button">
                      {t("settings.learnMore")}
                    </button>
                  </p>
                </div>
                <Switch
                  checked={improveModelForEveryone}
                  onCheckedChange={setImproveModelForEveryone}
                />
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
