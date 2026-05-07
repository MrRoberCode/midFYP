import React, { useState } from "react";
import { ArrowLeft, Bot, Loader2, MailCheck, ShieldCheck } from "lucide-react";
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Label } from "./ui/label";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";

interface LoginProps {
  onSwitchToSignup: () => void;
}

type AuthStep =
  | "login"
  | "loginOtp"
  | "forgotEmail"
  | "forgotOtp"
  | "resetPassword";

export const Login: React.FC<LoginProps> = ({ onSwitchToSignup }) => {
  const { t } = usePreferences();
  const [step, setStep] = useState<AuthStep>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    login,
    verifyLoginOtp,
    forgotPassword,
    verifyResetOtp,
    resetPassword,
  } = useAuth();
  const { toast } = useToast();

  const isOtpStep = step === "loginOtp" || step === "forgotOtp";

  const getErrorDescription = (error: any, fallback: string) => {
    const errorData = error.response?.data;

    if (errorData) {
      if (Array.isArray(errorData.message)) return errorData.message.join(", ");
      if (typeof errorData.message === "string") return errorData.message;
      if (errorData.error) return errorData.error;
    }

    return error.message || fallback;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (step === "login") {
        if (!email || !password) return;
        await login(email, password);
        setOtp("");
        setStep("loginOtp");
      } else if (step === "loginOtp") {
        if (otp.length !== 6) return;
        await verifyLoginOtp(otp);
      } else if (step === "forgotEmail") {
        if (!email) return;
        await forgotPassword(email);
        setOtp("");
        setStep("forgotOtp");
      } else if (step === "forgotOtp") {
        if (otp.length !== 6) return;
        await verifyResetOtp(otp);
        setStep("resetPassword");
      } else {
        if (otp.length !== 6 || !newPassword) return;
        await resetPassword(otp, newPassword);
      }
    } catch (error: any) {
      console.error("Authentication error details:", error.response?.data);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: getErrorDescription(
          error,
          "Something went wrong. Please try again.",
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const screenCopy = {
    login: {
      title: t("auth.welcomeBack"),
      description: t("auth.loginDescription"),
      action: t("auth.logIn"),
      loading: t("auth.loggingIn"),
    },
    loginOtp: {
      title: t("auth.verifyLoginOtp"),
      description: t("auth.otpDescription"),
      action: t("auth.verifyLoginOtp"),
      loading: t("auth.verifying"),
    },
    forgotEmail: {
      title: t("auth.resetPassword"),
      description: t("auth.resetDescription"),
      action: t("auth.sendOtp"),
      loading: t("auth.sending"),
    },
    forgotOtp: {
      title: t("auth.verifyResetOtp"),
      description: t("auth.otpDescription"),
      action: t("auth.verifyResetOtp"),
      loading: t("auth.verifying"),
    },
    resetPassword: {
      title: t("auth.createNewPassword"),
      description: t("auth.newPasswordDescription"),
      action: t("auth.updatePassword"),
      loading: t("auth.updating"),
    },
  }[step];

  return (
    <div className="flex h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            {isOtpStep ? (
              <ShieldCheck className="h-6 w-6 text-primary-foreground" />
            ) : step === "forgotEmail" || step === "resetPassword" ? (
              <MailCheck className="h-6 w-6 text-primary-foreground" />
            ) : (
              <Bot className="h-6 w-6 text-primary-foreground" />
            )}
          </div>
          <CardTitle className="text-xl font-semibold">
            {screenCopy.title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {screenCopy.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {(step === "login" || step === "forgotEmail") && (
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}

            {step === "login" && (
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
            )}

            {isOtpStep && (
              <div className="space-y-2">
                <Label htmlFor="otp">{t("auth.otp")}</Label>
                <InputOTP
                  id="otp"
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  containerClassName="justify-center"
                >
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            )}

            {step === "resetPassword" && (
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t("auth.newPassword")}</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder={t("auth.newPassword")}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {screenCopy.loading}
                </>
              ) : (
                screenCopy.action
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {step === "login" ? (
            <>
              <button
                onClick={() => {
                  setStep("forgotEmail");
                  setPassword("");
                  setOtp("");
                }}
                className="text-sm font-medium text-primary hover:underline"
              >
                {t("auth.forgotPassword")}
              </button>
              <div className="text-sm text-muted-foreground">
                {t("auth.noAccount")}{" "}
                <button
                  onClick={onSwitchToSignup}
                  className="font-medium text-primary hover:underline"
                >
                  {t("auth.signUp")}
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => {
                setStep("login");
                setOtp("");
                setNewPassword("");
              }}
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("auth.backToLogin")}
            </button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
