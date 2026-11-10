'use client';

import React, { useState, Suspense } from 'react';
import { supabase } from '@/lib/core';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Mail, Lock, Loader2 } from 'lucide-react';

function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const router = useRouter();
  const redirectUrl = useSearchParams().get('redirect') || '/dashboard';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) {
          router.push(redirectUrl);
          router.refresh();
        } else {
          setMsg({ type: 'success', text: '注册成功！请检查邮箱验证或直接登录。' });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(redirectUrl);
        router.refresh();
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || '认证失败，请核对邮箱密码' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-xl">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold">{isSignUp ? '创建会员账号' : '登录会员账号'}</h1>
      </div>

      {msg && (
        <div className={`mt-4 rounded-xl p-3 text-sm ${msg.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleAuth} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold">电子邮箱</label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className="w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold">登录密码</label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="至少 6 位字符" className="w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-500">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{isSignUp ? '立即注册' : '立即登录'}</span>
        </button>
      </form>

      <div className="mt-5 text-center text-sm">
        {isSignUp ? '已有账号？' : '没有账号？'}
        <button type="button" onClick={() => { setIsSignUp(!isSignUp); setMsg(null); }} className="ml-1 font-bold text-indigo-600 hover:underline">
          {isSignUp ? '直接登录' : '免费注册'}
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-4 py-12">
      <Suspense fallback={<div>加载中...</div>}><AuthForm /></Suspense>
    </div>
  );
}
