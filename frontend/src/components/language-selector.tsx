import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  supportedLanguages,
  type SupportedLanguage,
  usePreferences,
} from "@/contexts/preferences-context";
import { cn } from "@/lib/utils";
import { Globe2 } from "lucide-react";

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector = ({ className }: LanguageSelectorProps) => {
  const { language, setLanguage, t } = usePreferences();
  const currentLanguage =
    supportedLanguages.find((item) => item.value === language)?.label ??
    t("common.language");

  return (
    <div className={cn("inline-flex", className)}>
      <Select
        value={language}
        onValueChange={(value) => setLanguage(value as SupportedLanguage)}
      >
        <SelectTrigger
          className="h-9 w-auto min-w-[124px] gap-2 rounded-full border-border/70 bg-background/55 px-3 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur transition-all hover:border-primary/35 hover:bg-primary/5 hover:text-foreground focus:ring-ring/35"
          aria-label={t("auth.languageAriaLabel")}
        >
          <Globe2 className="h-3.5 w-3.5 text-primary" />
          <SelectValue placeholder={currentLanguage} />
        </SelectTrigger>
        <SelectContent dir="ltr">
          {supportedLanguages.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
