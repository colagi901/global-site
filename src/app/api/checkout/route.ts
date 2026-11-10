import { NextRequest, NextResponse } from 'next/server';
import { PRICING_PLANS, CurrencyCode, PlanType } from '@/lib/core';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planType, currency, userId, email } = body as {
      planType: PlanType;
      currency: CurrencyCode;
      userId: string;
      email: string;
    };

    if (!planType || !currency || !userId || !email) {
      return NextResponse.json({ error: '缺少必要支付参数' }, { status: 400 });
    }

    const plan = PRICING_PLANS[planType];
    const verifiedAmount = plan?.prices?.[currency];
    if (!verifiedAmount) {
      return NextResponse.json({ error: '无效的套餐或币种' }, { status: 400 });
    }

    const apiUrl = process.env.AIRWALLEX_API_URL || 'https://airwallex.com';
    const clientId = process.env.AIRWALLEX_CLIENT_ID;
    const apiKey = process.env.AIRWALLEX_API_KEY;

    if (!clientId || !apiKey) {
      return NextResponse.json(
        { error: '尚未配置 AIRWALLEX_CLIENT_ID 和 AIRWALLEX_API_KEY 环境变量' },
        { status: 500 }
      );
    }

    const authRes = await fetch(`${apiUrl}/api/v1/authentication/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': clientId,
        'x-api-key': apiKey,
      },
    });

    if (!authRes.ok) {
      throw new Error('Airwallex 认证失败，请核对 API 密钥');
    }
    const { token } = await authRes.json();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const returnUrl = `${appUrl}/payment-success`;

    const intentRes = await fetch(`${apiUrl}/api/v1/pa/payment_intents/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        request_id: `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        amount: verifiedAmount,
        currency,
        merchant_order_id: `ord_${planType}_${Date.now()}`,
        return_url: returnUrl,
        metadata: { userId, planType, userEmail: email },
        customer: { email },
      }),
    });

    if (!intentRes.ok) {
      throw new Error('创建 Airwallex PaymentIntent 失败');
    }

    const paymentIntent = await intentRes.json();
    const checkoutBase =
      process.env.NEXT_PUBLIC_AIRWALLEX_CHECKOUT_URL || 'https://airwallex.com';

    const checkoutUrl = `${checkoutBase}/#/standalone/checkout?intent_id=${encodeURIComponent(
      paymentIntent.id
    )}&client_secret=${encodeURIComponent(
      paymentIntent.client_secret
    )}&currency=${encodeURIComponent(currency)}&mode=payment&successUrl=${encodeURIComponent(
      returnUrl
    )}`;

    return NextResponse.json({ checkoutUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || '结账接口异常' }, { status: 500 });
  }
}
