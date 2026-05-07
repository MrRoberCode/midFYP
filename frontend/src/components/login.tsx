import React, { useEffect, useState } from "react";
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
  const defaultOtpDuration = 120;
  const [step, setStep] = useState<AuthStep>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpExpiresAt, setOtpExpiresAt] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const {
    login,
    verifyLoginOtp,
    forgotPassword,
    verifyResetOtp,
    resetPassword,
  } = useAuth();
  const { toast } = useToast();

  const isOtpStep = step === "loginOtp" || step === "forgotOtp";
  const isOtpExpired = isOtpStep && secondsLeft === 0;

  useEffect(() => {
    if (!otpExpiresAt) {
      setSecondsLeft(0);
      return;
    }

    const updateCountdown = () => {
      setSecondsLeft(Math.max(0, Math.ceil((otpExpiresAt - Date.now()) / 1000)));
    };

    updateCountdown();

    const interval = window.setInterval(() => {
      const remainingSeconds = Math.max(
        0,
        Math.ceil((otpExpiresAt - Date.now()) / 1000),
      );
      setSecondsLeft(remainingSeconds);

      if (remainingSeconds === 0) {
        window.clearInterval(interval);
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [otpExpiresAt]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const startOtpTimer = (durationSeconds?: number) => {
    const expiresIn = durationSeconds ?? defaultOtpDuration;
    setOtpExpiresAt(Date.now() + expiresIn * 1000);
    setSecondsLeft(expiresIn);
  };

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
        const expiresInSeconds = await login(email, password);
        setOtp("");
        startOtpTimer(expiresInSeconds);
        setStep("loginOtp");
      } else if (step === "loginOtp") {
        if (otp.length !== 6 || isOtpExpired) return;
        await verifyLoginOtp(otp);
      } else if (step === "forgotEmail") {
        if (!email) return;
        const expiresInSeconds = await forgotPassword(email);
        setOtp("");
        startOtpTimer(expiresInSeconds);
        setStep("forgotOtp");
      } else if (step === "forgotOtp") {
        if (otp.length !== 6 || isOtpExpired) return;
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

  const handleResendOtp = async () => {
    if (!email) return;

    setIsSubmitting(true);
    try {
      const expiresInSeconds =
        step === "loginOtp" ? await login(email, password) : await forgotPassword(email);
      setOtp("");
      startOtpTimer(expiresInSeconds);
      toast({
        title: "OTP sent",
        description: "A fresh verification code has been sent to your email.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Resend Failed",
        description: getErrorDescription(
          error,
          "We could not send a new OTP right now.",
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <div className="space-y-3">
                <Label htmlFor="otp">{t("auth.otp")}</Label>
                <InputOTP
                  id="otp"
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  containerClassName="justify-center"
                  disabled={isOtpExpired}
                >
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                <div className="rounded-xl border border-border/70 bg-muted/30 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary/80">
                    OTP Timer
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {isOtpExpired
                          ? "This code has expired"
                          : `Code expires in ${formatTime(secondsLeft)}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isOtpExpired
                          ? "Request a new OTP to continue."
                          : "Enter the code before the countdown ends."}
                      </p>
                    </div>
                    <div className="rounded-full bg-background px-3 py-1 text-sm font-semibold text-primary shadow-sm">
                      {formatTime(secondsLeft)}
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleResendOtp}
                  disabled={isSubmitting || (step === "loginOtp" && !password)}
                >
                  Resend OTP
                </Button>
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

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || (isOtpStep && isOtpExpired)}
            >
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
                  setOtpExpiresAt(null);
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
                setOtpExpiresAt(null);
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
