'use client';

import React, { useEffect, useState } from 'react';
import { supabase, COMPANY_INFO } from '@/lib/core';
import { useRouter } from 'next/navigation';
import { Download, Mail, Sparkles, FileText, PhoneCall, Loader2, CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.replace('/login?redirect=/dashboard');
        return;
      }
      setEmail(session.user.email || '');
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl border bg-white p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold">会员个人中心</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white">
                <Sparkles className="h-3.5 w-3.5" /> 正式注册会员
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-6 text-sm text-slate-600">
              <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {email}</span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-medium"><CheckCircle2 className="h-4 w-4" /> 永久免费会员资格已激活</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold border-b pb-4">会员专属内容与资源下载区</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6">
              <div className="flex items-center gap-2 font-bold text-indigo-700">
                <FileText className="h-5 w-5" /> 2026 行业深度研究报告 (完整版)
              </div>
              <p className="mt-2 text-sm text-slate-600">感谢您注册成为 {COMPANY_INFO.brandName} 会员，您已解锁完整资料下载权限。</p>
              <button
                onClick={() => alert('开始下载会员专属 PDF 报告...')}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
              >
                <Download className="h-4 w-4" /> 立即下载报告
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <PhoneCall className="h-5 w-5 text-indigo-600" /> 专属在线客服通道
              </div>
              <p className="mt-2 text-sm text-slate-600">
                如需业务咨询或协助，欢迎随时拨打 {COMPANY_INFO.phone} 或发送邮件至 {COMPANY_INFO.email}。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
