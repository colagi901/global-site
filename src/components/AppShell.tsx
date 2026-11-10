'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe, User, ShieldCheck, LogOut, Building2, MapPin, Mail, X } from 'lucide-react';
import { CurrencyCode, SUPPORTED_CURRENCIES, supabase, LEGAL_DOCS } from '@/lib/core';

const CurrencyContext = createContext<{
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
}>({ currency: 'USD', setCurrency: () => {} });

export const useCurrency = () => useContext(CurrencyContext);

export function AppShell({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeLegal, setActiveLegal] = useState<keyof typeof LEGAL_DOCS | null>(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('preferred_currency') as CurrencyCode;
    if (saved && ['USD', 'HKD', 'EUR', 'GBP', 'AUD'].includes(saved)) {
      setCurrencyState(saved);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem('preferred_currency', c);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      <div className="min-h-screen flex flex-col bg-white text-slate-900">
        {/* 頂部導航欄 */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Apex<span className="text-indigo-600">Global</span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              {/* 右上角 5 幣種切換器 */}
              <div className="relative flex items-center">
                <Globe className="pointer-events-none absolute left-2.5 h-4 w-4 text-slate-500" />
                <select
                  aria-label="选择结算货币"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="h-9 cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-7 text-xs sm:text-sm font-semibold text-slate-800 hover:border-indigo-400 focus:border-indigo-600 focus:outline-none"
                >
                  {SUPPORTED_CURRENCIES.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.flag} {item.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2 text-[10px] text-slate-500">▼</span>
              </div>

              {userEmail ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-indigo-500 transition"
                  >
                    <User className="h-4 w-4" />
                    <span>会员中心</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    title="退出登录"
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 transition"
                >
                  登录 / 注册
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* 主內容區 */}
        <main className="flex-1">{children}</main>

        {/* 合規信任頁腳 */}
        <footer className="border-t border-slate-200 bg-white text-slate-600">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-indigo-600" />
                  <span className="text-lg font-bold text-slate-900">ApexGlobal Limited</span>
                </div>
                <p className="max-w-md text-sm text-slate-500">
                  全球多币种商业智库与会员制研究平台，支持本地化固定汇率结算与全球主流支付方式。
                </p>
                <div className="space-y-1 text-xs text-slate-500">
                  <p className="flex items-center gap-2"><Building2 className="h-4 w-4 text-slate-400" /> Registered Entity: ApexGlobal Limited (Hong Kong)</p>
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" /> Unit 4502, The Center, 99 Queen&apos;s Road Central, Hong Kong</p>
                  <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" /> Support: support@://example.com | +852 3008 8899</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">商业合规与政策 / Legal</h4>
                <ul className="mt-3 space-y-2 text-sm">
                  <li><button onClick={() => setActiveLegal('terms')} className="hover:text-indigo-600">服务条款 (Terms of Service)</button></li>
                  <li><button onClick={() => setActiveLegal('privacy')} className="hover:text-indigo-600">隐私政策 (Privacy Policy)</button></li>
                  <li><button onClick={() => setActiveLegal('refund')} className="hover:text-indigo-600">退款政策 (Refund Policy)</button></li>
                  <li><button onClick={() => setActiveLegal('contact')} className="hover:text-indigo-600">联系我们 (Contact Us)</button></li>
                </ul>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6 text-xs text-slate-400">
              <p>© {new Date().getFullYear()} ApexGlobal Limited. All rights reserved.</p>
              <div className="flex flex-wrap gap-2 font-semibold text-slate-500">
                <span className="rounded border border-slate-200 px-2 py-0.5">VISA</span>
                <span className="rounded border border-slate-200 px-2 py-0.5">Mastercard</span>
                <span className="rounded border border-slate-200 px-2 py-0.5">Apple Pay</span>
                <span className="rounded border border-slate-200 px-2 py-0.5">Google Pay</span>
                <span className="rounded bg-indigo-50 px-2 py-0.5 text-indigo-700">Secured by Airwallex</span>
              </div>
            </div>
          </div>

          {activeLegal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
              <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900">{LEGAL_DOCS[activeLegal].title}</h3>
                  <button onClick={() => setActiveLegal(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                  {LEGAL_DOCS[activeLegal].content}
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={() => setActiveLegal(null)} className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white">
                    关闭 / Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </footer>
      </div>
    </CurrencyContext.Provider>
  );
}
