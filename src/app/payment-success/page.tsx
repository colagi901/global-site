import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border bg-white p-8 sm:p-12 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-slate-900">
          支付成功！欢迎加入会员
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600">
          您的多币种付款已通过 Airwallex 安全结算。系统正在自动为您同步会员权限与有效期，请前往会员中心查看。
        </p>
        <div className="mt-6 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0" />
          <span>电子收据已发送至您的注册电子邮箱</span>
        </div>
        <div className="mt-8">
          <Link
            href="/dashboard"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 font-bold text-white hover:bg-indigo-500 transition"
          >
            <span>前往会员个人中心</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
