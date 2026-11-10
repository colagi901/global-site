import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const timestamp = req.headers.get('x-timestamp');
    const signature = req.headers.get('x-signature');
    const webhookSecret = process.env.AIRWALLEX_WEBHOOK_SECRET;

    if (webhookSecret && timestamp && signature) {
      const expected = crypto
        .createHmac('sha256', webhookSecret)
        .update(`${timestamp}${rawBody}`)
        .digest('hex');
      if (expected !== signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);

    if (event.name === 'payment_intent.succeeded') {
      const paymentIntent = event.data?.object;
      const metadata = paymentIntent?.metadata;
      const userId = metadata?.userId;
      const planType = metadata?.planType as 'pro' | 'vip' | undefined;
      const userEmail = metadata?.userEmail || paymentIntent?.customer?.email || '';

      if (userId && planType) {
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          { auth: { autoRefreshToken: false, persistSession: false } }
        );

        const daysToAdd = planType === 'vip' ? 365 : 30;
        const { data: existing } = await supabaseAdmin
          .from('profiles')
          .select('expires_at')
          .eq('id', userId)
          .single();

        const now = new Date();
        const baseDate =
          existing?.expires_at && new Date(existing.expires_at) > now
            ? new Date(existing.expires_at)
            : now;

        const newExpiresAt = new Date(baseDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

        await supabaseAdmin.from('profiles').upsert({
          id: userId,
          email: userEmail,
          tier: planType,
          expires_at: newExpiresAt.toISOString(),
        });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
