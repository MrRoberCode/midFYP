import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Loader2,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePreferences } from "@/contexts/preferences-context";
import { useToast } from "@/hooks/use-toast";
import {
  BillingPlan,
  BillingPlanId,
  SubscriptionState,
  billingService,
} from "@/services/billing.service";

const planIcon = {
  free: Sparkles,
  plus: Zap,
  pro: ShieldCheck,
};

const featureCount: Record<BillingPlanId, number> = {
  free: 3,
  plus: 4,
  pro: 4,
};

export const BillingPage = () => {
  const { t } = usePreferences();
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionState | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [checkoutPlan, setCheckoutPlan] = useState<BillingPlanId | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const sessionId = searchParams.get("session_id");
  const checkoutCancelled = searchParams.get("checkout") === "cancelled";
  const currentPlan = subscription?.plan || "free";
  const featuredPlan = useMemo(
    () => plans.find((plan) => plan.id === "plus"),
    [plans],
  );

  useEffect(() => {
    const loadBilling = async () => {
      try {
        const [plansResponse, subscriptionResponse] = await Promise.all([
          billingService.getPlans(),
          billingService.getSubscription(),
        ]);
        setPlans(plansResponse);
        setSubscription(subscriptionResponse);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: t("billing.unavailable"),
          description:
            error.response?.data?.message || t("billing.unavailableDescription"),
        });
      } finally {
        setLoading(false);
      }
    };

    loadBilling();
  }, [toast]);

  useEffect(() => {
    if (!checkoutCancelled) return;

    toast({
      title: t("billing.checkoutCancelled"),
      description: t("billing.checkoutCancelledDescription"),
    });
    setSearchParams({});
  }, [checkoutCancelled, setSearchParams, toast]);

  useEffect(() => {
    const verifyCheckout = async () => {
      if (!sessionId || verifying) return;

      setVerifying(true);
      try {
        const response = await billingService.completeCheckout(sessionId);
        setSubscription({
          plan: response.data.plan,
          status: response.data.status,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
        });
        toast({
          title: t("billing.planActivated"),
          description: response.message,
        });
        setSearchParams({});
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: t("billing.checkoutVerificationFailed"),
          description:
            error.response?.data?.message ||
            t("billing.checkoutVerificationFailedDescription"),
        });
      } finally {
        setVerifying(false);
      }
    };

    verifyCheckout();
  }, [sessionId, setSearchParams, toast, verifying]);

  const handleChoosePlan = async (planId: BillingPlanId) => {
    setCheckoutPlan(planId);
    try {
      const response = await billingService.createCheckoutSession(planId);

      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
        return;
      }

      setSubscription((previous) => ({
        plan: response.data.plan || "free",
        status: "active",
        stripeCustomerId: previous?.stripeCustomerId || null,
        stripeSubscriptionId: previous?.stripeSubscriptionId || null,
      }));
      toast({
        title: t("billing.planUpdated"),
        description: response.message || t("billing.planUpdatedDescription"),
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("billing.checkoutFailed"),
        description:
          error.response?.data?.message ||
          t("billing.checkoutFailedDescription"),
      });
    } finally {
      setCheckoutPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-transparent">
        <div className="premium-panel flex items-center gap-3 rounded-lg px-4 py-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">{t("billing.title")}</span>
        </div>
      </div>
    );
  }

  return (
    <main className="h-full overflow-auto bg-transparent">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="premium-panel animate-rise flex flex-col gap-4 rounded-lg p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="h-8 px-2 text-muted-foreground"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("billing.back")}
            </Button>
            <div>
              <h1 className="text-3xl font-semibold tracking-normal">
                {t("billing.title")}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("billing.description")}
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-primary/20 bg-primary/8 px-4 py-3 shadow-sm">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              {t("billing.currentPlan")}
            </p>
            <p className="text-lg font-semibold">
              {t(`billing.plan.${currentPlan}`)}
            </p>
          </div>
        </div>

        {verifying && (
          <div className="flex items-center rounded-lg border border-primary/20 bg-primary/8 px-4 py-3 text-sm text-primary">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("billing.verifying")}
          </div>
        )}

        <section className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = planIcon[plan.id];
            const isCurrent = currentPlan === plan.id;
            const isFeatured = featuredPlan?.id === plan.id;
            const isBusy = checkoutPlan === plan.id;

            return (
              <Card
                key={plan.id}
                className={
                  isFeatured
                    ? "animate-rise border-primary/60 shadow-xl shadow-primary/15"
                    : "animate-rise border-border/80 shadow-sm"
                }
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex gap-2">
                      {isFeatured && <Badge>{t("billing.popular")}</Badge>}
                      {isCurrent && (
                        <Badge variant="secondary">{t("billing.active")}</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <CardTitle>{t(`billing.plan.${plan.id}`)}</CardTitle>
                    <CardDescription className="mt-2">
                      {t(`billing.plan.${plan.id}.description`)}
                    </CardDescription>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-semibold">
                      {plan.price === 0 ? t("billing.free") : `$${plan.price / 100}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="pb-1 text-sm text-muted-foreground">
                        {t("billing.perMonth")}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {Array.from({ length: featureCount[plan.id] }).map(
                      (_, index) => (
                      <li key={`${plan.id}-${index}`} className="flex gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{t(`billing.feature.${plan.id}.${index + 1}`)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={isCurrent ? "secondary" : "default"}
                    disabled={isCurrent || isBusy}
                    onClick={() => handleChoosePlan(plan.id)}
                  >
                    {isBusy ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("billing.starting")}
                      </>
                    ) : isCurrent ? (
                      t("billing.current")
                    ) : plan.price === 0 ? (
                      t("billing.useFree")
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        {t("billing.upgrade")}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </section>
      </div>
    </main>
  );
};
