'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe2, FileText, Headphones, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/core';

export default function HomePage() {
  return (
    <main>
      <section className="bg-gradient-to-b from-indigo-50 via-white to-white py-20 px-4 text-center">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-xs font-medium text-indigo-700">
            <Globe2 className="h-4 w-4" /> 欢迎加入 {COMPANY_INFO.brandName} 免费会员社区
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold text-slate-900">
            探索行业前沿洞察，加入<span className="text-indigo-600">专属注册会员网络</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            只需使用电子邮箱免费注册，即可立即解锁全站深度研究报告、专属资源下载与在线客服支持。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/login" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white hover:bg-indigo-500">
              立即免费注册会员 <ArrowRight className="h-5 w-5" />
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
          <h3 className="mt-4 text-lg font-bold">会员专属深度报告</h3>
          <p className="mt-2 text-sm text-slate-600">注册登录后即可免费阅读与下载全站核心行业分析报告。</p>
        </div>
        <div className="rounded-2xl border p-6 bg-slate-50">
          <Headphones className="h-8 w-8 text-indigo-600" />
          <h3 className="mt-4 text-lg font-bold">专属在线客服支持</h3>
          <p className="mt-2 text-sm text-slate-600">注册会员可随时通过专属通道联系我们的服务团队获取协助。</p>
        </div>
        <div className="rounded-2xl border p-6 bg-slate-50">
          <ShieldCheck className="h-8 w-8 text-indigo-600" />
          <h3 className="mt-4 text-lg font-bold">100% 永久免费加入</h3>
          <p className="mt-2 text-sm text-slate-600">无任何隐藏费用或订阅收费，邮箱注册即享全部会员权益。</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-2xl mx-auto rounded-3xl bg-white p-8 sm:p-10 border shadow-lg text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" /> 限时免费开放注册
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900">正式注册会员</h2>
          <p className="mt-2 text-slate-500">无需绑定任何银行卡，注册账号即刻开通</p>
          <div className="mt-6 text-4xl font-extrabold text-indigo-600">免费 / Free</div>
          <ul className="mt-8 space-y-3 text-sm text-left max-w-sm mx-auto border-t pt-6">
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600 shrink-0" /> 解锁全站核心会员专属内容</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600 shrink-0" /> 免费下载最新行业研究报告</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600 shrink-0" /> 专属在线客服与咨询通道</li>
          </ul>
          <div className="mt-8">
            <Link href="/login" className="block w-full rounded-xl bg-slate-900 py-3.5 font-bold text-white hover:bg-slate-800 transition">
              立即免费注册 / 登录
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
