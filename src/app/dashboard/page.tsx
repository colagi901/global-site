'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/core';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, Lock, Download, Calendar, Mail, Sparkles, FileText, PhoneCall, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [profile, setProfile] = useState<{ email: string; tier: string; expires_at: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.replace('/login?redirect=/dashboard');
        return;
      }
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setProfile(data || { email: session.user.email || '', tier: 'free', expires_at: null });
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;
  if (!profile) return null;

  const isExpired = profile.expires_at ? new Date(profile.expires_at) < new Date() : true;
  const isPaid = (profile.tier === 'pro' || profile.tier === 'vip') && !isExpired;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl border bg-white p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold">会员个人中心</h1>
              {!isPaid ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">免费访客</span>
              ) : profile.tier === 'vip' ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white"><Crown className="h-3.5 w-3.5" /> VIP 尊享会员</span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white"><Sparkles className="h-3.5 w-3.5" /> Pro 标准会员</span>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-6 text-sm text-slate-600">
              <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {profile.email}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> 有效期至：{isPaid && profile.expires_at ? new Date(profile.expires_at).toLocaleDateString('zh-CN') : '未开通'}</span>
            </div>
          </div>
          {!isPaid && <Link href="/#pricing" className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-500">立即升级会员 →</Link>}
        </div>

        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold border-b pb-4">会员专属内容与报告下载区</h2>
          {isPaid ? (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6">
                <div className="flex items-center gap-2 font-bold text-indigo-700"><FileText className="h-5 w-5" /> 2026 全球商业深度研究报告</div>
                <p className="mt-2 text-sm text-slate-600">包含北美、欧洲与亚太最新市场增长数据模型。</p>
                <button onClick={() => alert('开始下载会员专属 PDF 报告...')} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white">
                  <Download className="h-4 w-4" /> 下载完整报告
                </button>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
                <div className="flex items-center gap-2 font-bold text-amber-800"><PhoneCall className="h-5 w-5" /> 专属顾问与 7x24 支持通道</div>
                <p className="mt-2 text-sm text-slate-600">{profile.tier === 'vip' ? 'VIP 专属预约码：VIP-889，可随时预约 1 对 1 咨询。' : 'Pro 会员优先工单支持已激活。'}</p>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border-2 border-dashed bg-slate-50 py-12 px-6 text-center">
              <Lock className="mx-auto h-10 w-10 text-slate-400" />
              <h3 className="mt-3 text-lg font-bold">仅限 Pro 与 VIP 付费会员查看</h3>
              <p className="mt-1 text-sm text-slate-500">升级会员即可解锁全站深度研究报告与专属顾问服务。</p>
              <Link href="/#pricing" className="mt-5 inline-block rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white">前往选择订阅方案</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
