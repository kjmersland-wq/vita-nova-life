CREATE TABLE public.stripe_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  stripe_subscription_id text NOT NULL UNIQUE,
  stripe_customer_id text NOT NULL,
  price_id text NOT NULL,
  status text NOT NULL,
  current_period_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  environment text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.stripe_subscriptions TO service_role;
ALTER TABLE public.stripe_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_stripe_subscriptions_email_env ON public.stripe_subscriptions(email, environment);
COMMENT ON TABLE public.subscriptions IS 'DEPRECATED: old payment provider, replaced by stripe_subscriptions';
COMMENT ON TABLE public.payment_events IS 'DEPRECATED: old payment provider, no longer written';