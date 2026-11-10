'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Globe2, FileText, Headphones, ShieldCheck, Check, Sparkles, Lock, CreditCard, Loader2 } from 'lucide-react';
import { useCurrency } from '@/components/AppShell';
import { PRICING_PLANS, formatPrice, PlanType, supabase } from '@/lib/core';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { currency } = useCurrency();
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleSubscribe = async (planType: PlanType) => {
    setErrorMsg(null);
    setLoadingPlan(planType);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/login?redirect=/#pricing');
        return;
      }
      const plan = PRICING_PLANS[planType];
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType,
          currency,
          amount: plan.prices[currency],
          userId: session.user.id,
          email: session.user.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '结账失败');
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
    } catch (err: any) {
      setErrorMsg(err.message);
      setLoadingPlan(null);
    }
  };

  return (
    <div>
      <section className="bg-gradient-to-b from-indigo-50 via-white to-white py-20 px-4 text-center">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-xs font-medium text-indigo-700">
            <Globe2 className="h-4 w-4" /> 覆盖全球 150+ 国家 · 支持 5 大主流货币直接结算
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold text-slate-900">
            洞察全球商业先机，加入<span className="text-indigo-600">精英决策者会员网络</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            每月获取深度全球市场研报与 1 对 1 跨境业务专家咨询，使用本地货币一键订阅。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/#pricing" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white hover:bg-indigo-500">
              立即选择会员方案 <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/dashboard" className="rounded-xl border border-slate-300 bg-white px-8 py-4 font-bold text-slate-700 hover:bg-slate-50">
              进入会员中心
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="rounded-2xl border p-6 bg-slate-50">
          <FileText className="h-8 w-8 text-indigo-600" />
          <h3 className="mt-4 text-lg font-bold">每月全球行业深度报告</h3>
          <p className="mt-2 text-sm text-slate-600">涵盖北美、欧洲及亚太核心赛道的独家数据与趋势拆解。</p>
        </div>
        <div className="rounded-2xl border p-6 bg-slate-50">
          <Headphones className="h-8 w-8 text-indigo-600" />
          <h3 className="mt-4 text-lg font-bold">7x24 小时专属顾问支持</h3>
          <p className="mt-2 text-sm text-slate-600">VIP 会员可随时通过专属通道预约 1 对 1 专家答疑。</p>
        </div>
        <div className="rounded-2xl border p-6 bg-slate-50">
          <ShieldCheck className="h-8 w-8 text-indigo-600" />
          <h3 className="mt-4 text-lg font-bold">多币种零汇损合规支付</h3>
          <p className="mt-2 text-sm text-slate-600">接入国际持牌机构 Airwallex，支持 5 大主流货币原币结算。</p>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">选择适合您的全球会员方案</h2>
            <p className="mt-2 text-slate-600">右上角随时切换 USD / HKD / EUR / GBP / AUD 固定币种</p>
          </div>

          {errorMsg && <div className="mb-6 rounded-xl bg-red-50 p-4 text-center text-sm text-red-700">{errorMsg}</div>}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[PRICING_PLANS.pro, PRICING_PLANS.vip].map((plan) => {
              const isVip = plan.id === 'vip';
              const priceStr = formatPrice(plan.prices[currency], currency);
              return (
                <div key={plan.id} className={`relative flex flex-col justify-between rounded-3xl p-8 ${isVip ? 'bg-slate-900 text-white ring-2 ring-indigo-500' : 'bg-white text-slate-900 border'}`}>
                  {plan.badge && (
                    <span className="absolute -top-3.5 right-6 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white">
                      {plan.badge}
                    </span>
                  )}
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      {plan.discountNote && <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400">{plan.discountNote}</span>}
                    </div>
                    <p className={`mt-2 text-sm ${isVip ? 'text-slate-300' : 'text-slate-500'}`}>{plan.description}</p>
                    <div className="mt-6 flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold">{priceStr}</span>
                      <span className="text-sm opacity-75">/ {isVip ? '年' : '月'}</span>
                    </div>
                    <ul className="mt-6 space-y-3 text-sm border-t pt-6 border-slate-700/30">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8">
                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={loadingPlan !== null}
                      className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold transition ${isVip ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                    >
                      {loadingPlan === plan.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5" />}
                      <span>{loadingPlan === plan.id ? '连接收银台中...' : `立即订阅 (${priceStr})`}</span>
                    </button>
                    <p className="mt-2.5 flex items-center justify-center gap-1 text-xs opacity-60">
