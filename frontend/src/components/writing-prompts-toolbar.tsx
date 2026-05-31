import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Briefcase,
  ChevronDown,
  ChevronUp,
  List,
  Minimize2,
  Palette,
  PenLine,
  Smile,
  SpellCheck,
  Type,
} from "lucide-react";
import React, { useState } from "react";
import { usePreferences } from "@/contexts/preferences-context";

interface WritingPromptsToolbarProps {
  onPromptSelect: (prompt: string) => void;
  className?: string;
}

export const WritingPromptsToolbar: React.FC<WritingPromptsToolbarProps> = ({
  onPromptSelect,
  className = "",
}) => {
  const { t } = usePreferences();
  const [isExpanded, setIsExpanded] = useState(false);
  const toolbarPrompts = [
    {
      icon: SpellCheck,
      text: t("prompt.fixGrammar"),
      category: t("prompt.category.editing"),
    },
    {
      icon: Minimize2,
      text: t("prompt.moreConcise"),
      category: t("prompt.category.refinement"),
    },
    {
      icon: Briefcase,
      text: t("prompt.moreProfessional"),
      category: t("prompt.category.tone"),
    },
    {
      icon: Smile,
      text: t("prompt.moreHuman"),
      category: t("prompt.category.style"),
    },
    {
      icon: List,
      text: t("prompt.summarizeKeyPoints"),
      category: t("prompt.category.summary"),
    },
    {
      icon: PenLine,
      text: t("prompt.continueWriting"),
      category: t("prompt.category.generation"),
    },
    {
      icon: Type,
      text: t("prompt.suggestTitle"),
      category: t("prompt.category.ideas"),
    },
    {
      icon: Palette,
      text: t("prompt.changeTone"),
      category: t("prompt.category.tone"),
    },
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Expanded Menu */}
      {isExpanded && (
        <>
          {/* Backdrop to close menu when clicking outside */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsExpanded(false)}
          />

          {/* Menu content */}
          <div className="absolute bottom-full left-0 right-0 z-20 mb-2">
            <div className="mx-2 max-h-[52dvh] overflow-y-auto rounded-lg border bg-background shadow-xl sm:mx-4">
              <div className="grid grid-cols-1 gap-2 p-2.5 sm:grid-cols-2 sm:p-3 lg:grid-cols-3">
                {toolbarPrompts.map((prompt, index) => {
                  const IconComponent = prompt.icon;
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onPromptSelect(prompt.text);
                        setIsExpanded(false);
                      }}
                      className="h-auto min-w-0 justify-start p-2 text-left text-xs hover:bg-muted/50"
                    >
                      <IconComponent className="h-4 w-4 mr-2 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">
                          {prompt.text}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {prompt.category}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Toolbar - always visible */}
      <div className="border-t bg-background">
        <div className="flex min-w-0 items-center gap-1.5 px-2.5 py-2 sm:gap-2 sm:px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-9 flex-shrink-0 px-2 text-xs font-medium sm:h-7"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 mr-1" />
            ) : (
              <ChevronUp className="h-4 w-4 mr-1" />
            )}
            {t("prompt.toolbar")}
          </Button>

          <ScrollArea className="max-w-full min-w-0 flex-1">
            <div className="flex gap-1 pb-1">
              {toolbarPrompts.slice(0, 3).map((prompt, index) => {
                const IconComponent = prompt.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => onPromptSelect(prompt.text)}
                    className="h-9 flex-shrink-0 whitespace-nowrap px-2 text-xs hover:bg-muted/50 sm:h-7"
                  >
                    <IconComponent className="h-3 w-3 mr-1" />
                    <span className="max-w-[8rem] truncate sm:max-w-none">
                      {prompt.text}
                    </span>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
