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

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector = ({ className }: LanguageSelectorProps) => {
  const { language, setLanguage, t } = usePreferences();

  return (
    <div className={className}>
      <Select
        value={language}
        onValueChange={(value) => setLanguage(value as SupportedLanguage)}
      >
        <SelectTrigger
          className="h-9 min-w-[148px] bg-background/90"
          aria-label={t("auth.languageAriaLabel")}
        >
          <SelectValue placeholder={t("common.language")} />
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
