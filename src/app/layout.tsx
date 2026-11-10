import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'ApexGlobal | 全球多币种商业智库与会员订阅平台',
  description: '支持 USD, HKD, EUR, GBP, AUD 本地化结算的全球专业会员制服务平台',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
