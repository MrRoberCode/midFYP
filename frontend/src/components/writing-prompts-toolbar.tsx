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
          <div className="absolute bottom-full left-0 right-0 mb-2 z-20">
            <div className="bg-background border rounded-lg shadow-xl mx-4">
              <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                      className="h-auto p-2 text-xs text-left justify-start hover:bg-muted/50"
                    >
                      <IconComponent className="h-4 w-4 mr-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
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
      <div className="bg-background border-t">
        <div className="flex items-center px-4 py-2 gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 px-2 text-xs font-medium flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 mr-1" />
            ) : (
              <ChevronUp className="h-4 w-4 mr-1" />
            )}
            {t("prompt.toolbar")}
          </Button>

          <ScrollArea className="flex-1 max-w-full">
            <div className="flex gap-1 pb-1">
              {toolbarPrompts.slice(0, 3).map((prompt, index) => {
                const IconComponent = prompt.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => onPromptSelect(prompt.text)}
                    className="h-7 px-2 text-xs whitespace-nowrap flex-shrink-0 hover:bg-muted/50"
                  >
                    <IconComponent className="h-3 w-3 mr-1" />
                    {prompt.text}
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
