CREATE TABLE public.subscriptions (
  email text PRIMARY KEY,
  plan text NOT NULL CHECK (plan IN ('essential','premium')),
  status text NOT NULL,
  creem_customer_id text,
  creem_subscription_id text UNIQUE,
  product_id text,
  current_period_end timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.payment_events (
  id text PRIMARY KEY,
  event_type text NOT NULL,
  email text,
  payload jsonb NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.payment_events TO service_role;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;