import React, { useState } from "react";
import { AlertCircle, Bot, Loader2, Sparkles, UserPlus } from "lucide-react";
import { usePreferences } from "@/contexts/preferences-context";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import { LanguageSelector } from "./language-selector";

interface SignupProps {
  onSwitchToLogin: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onSwitchToLogin }) => {
  const { t } = usePreferences();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { signup } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setIsSubmitting(true);
    setFormError(null);
    try {
      await signup(name, email, password);
      toast({
        title: t("auth.success"),
        description: t("auth.accountCreated"),
      });
    } catch (error: any) {
      const errorData = error.response?.data;
      let description = t("auth.signupFailedDescription");

      if (errorData) {
        if (Array.isArray(errorData.message)) {
          description = errorData.message.join(", ");
        } else if (typeof errorData.message === "string") {
          description = errorData.message;
        } else if (errorData.error) {
          description = errorData.error;
        }
      } else if (error.message) {
        description = error.message;
      }

      setFormError(description);
      toast({
        variant: "destructive",
        title: t("auth.signupFailed"),
        description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex h-screen overflow-hidden bg-background p-4">
      <div className="soft-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="animate-rise w-full max-w-md justify-self-center overflow-hidden">
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl premium-gradient shadow-lg shadow-primary/25">
                <UserPlus className="h-7 w-7 text-primary-foreground" />
              </div>
              <LanguageSelector className="shrink-0" />
            </div>
            <div className="space-y-2 text-left">
              <CardTitle className="text-2xl font-semibold">
                {t("auth.createAccount")}
              </CardTitle>
              <CardDescription className="text-sm leading-6">
                {t("auth.createAccountDescription")}
              </CardDescription>
            </div>
            {formError && (
              <Alert variant="destructive" className="text-left">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t("auth.signupFailed")}</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("auth.name")}</Label>
                <Input
                  id="name"
                  placeholder={t("auth.namePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("auth.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("auth.password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("auth.creatingAccount")}
                  </>
                ) : (
                  t("auth.signUp")
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <div className="text-sm text-muted-foreground">
              {t("auth.alreadyAccount")}{" "}
              <button
                onClick={onSwitchToLogin}
                className="font-semibold text-primary transition-colors hover:text-primary/80"
              >
                {t("auth.logIn")}
              </button>
            </div>
          </CardFooter>
        </Card>

        <section className="hidden animate-rise lg:block">
          <div className="ml-auto max-w-xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Premium student showcase
            </div>
            <div className="space-y-4">
              <h1 className="max-w-lg text-5xl font-semibold leading-tight text-foreground">
                Start with a workspace that feels production-ready.
              </h1>
              <p className="max-w-lg text-base leading-7 text-muted-foreground">
                Thoughtful forms, clear feedback, accessible controls, and a
                refined visual system make every interaction feel intentional.
              </p>
            </div>
            <div className="premium-panel relative overflow-hidden rounded-lg p-6">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-primary/10" />
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">AI assistant ready</p>
                  <p className="text-sm text-muted-foreground">
                    Clean onboarding into your chat experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
