import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { UserService } from '../user/user.service';
import { BillingPlan, BillingPlanId } from './billing.types';

@Injectable()
export class BillingService {
  private readonly stripe;
  private readonly plans: BillingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'A light starter plan for quick AI writing help.',
      price: 0,
      interval: 'month',
      features: [
        '5 writing sessions',
        'Basic AI assistant access',
        'Community support',
      ],
    },
    {
      id: 'trial',
      name: '1 Month Free Trial',
      description: 'Try premium writing, file analysis, and faster AI for free.',
      price: 0,
      interval: 'month',
      features: [
        '30 days of Plus access',
        'Unlimited writing sessions',
        'PDF and image analysis',
        'Cancel anytime',
      ],
    },
    {
      id: 'plus',
      name: 'Plus',
      description: 'Affordable daily writing support for students and creators.',
      price: 500,
      interval: 'month',
      stripeLookupKey: 'ai_writer_plus_monthly',
      features: [
        'Unlimited writing sessions',
        'Priority AI responses',
        'File-aware writing help',
        'Export-ready drafts',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Power tools for serious academic and professional work.',
      price: 1200,
      interval: 'month',
      stripeLookupKey: 'ai_writer_pro_monthly',
      features: [
        'Everything in Plus',
        'Advanced rewriting workflows',
        'Premium support',
        'Team-ready collaboration',
      ],
    },
  ];

  constructor(private readonly userService: UserService) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is required for billing');
    }

    this.stripe = new Stripe(secretKey);
  }

  getPlans() {
    return {
      success: true,
      data: this.plans,
    };
  }

  async getSubscription(userId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      data: {
        plan: user.subscriptionPlan || 'free',
        status: user.subscriptionStatus || 'active',
        stripeCustomerId: user.stripeCustomerId || null,
        stripeSubscriptionId: user.stripeSubscriptionId || null,
      },
    };
  }

  async createCheckoutSession(userId: string, planId: BillingPlanId) {
    const plan = this.plans.find((item) => item.id === planId);
    if (!plan) {
      throw new BadRequestException('Invalid billing plan');
    }

    if (plan.id === 'free' || plan.id === 'trial') {
      await this.userService.updateUser(userId, {
        subscriptionPlan: plan.id,
        subscriptionStatus: plan.id === 'trial' ? 'trialing' : 'active',
        stripeSubscriptionId: null,
      });

      return {
        success: true,
        data: {
          checkoutUrl: null,
          plan: plan.id,
        },
        message:
          plan.id === 'trial'
            ? 'Your 1 month free trial is active.'
            : 'Free plan activated.',
      };
    }

    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: user.email,
      client_reference_id: userId,
      success_url: `${frontendUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/billing?checkout=cancelled`,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `AI Writer ${plan.name}`,
              description: plan.description,
            },
            recurring: {
              interval: plan.interval,
            },
            unit_amount: plan.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        planId: plan.id,
      },
      subscription_data: {
        metadata: {
          userId,
          planId: plan.id,
        },
      },
    });

    return {
      success: true,
      data: {
        checkoutUrl: session.url,
      },
    };
  }

  async completeCheckout(userId: string, sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    });

    if (session.client_reference_id !== userId) {
      throw new BadRequestException('Checkout session does not belong to user');
    }

    const planId = session.metadata?.planId as BillingPlanId | undefined;
    const plan = this.plans.find((item) => item.id === planId);
    if (!plan || plan.id === 'free') {
      throw new BadRequestException('Invalid checkout session plan');
    }

    if (session.payment_status !== 'paid') {
      throw new BadRequestException('Payment is not completed yet');
    }

    const subscription =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id || null;

    await this.userService.updateUser(userId, {
      subscriptionPlan: plan.id,
      subscriptionStatus: 'active',
      stripeCustomerId:
        typeof session.customer === 'string' ? session.customer : null,
      stripeSubscriptionId: subscription,
    });

    return {
      success: true,
      data: {
        plan: plan.id,
        status: 'active',
      },
      message: `${plan.name} plan activated.`,
    };
  }
}
