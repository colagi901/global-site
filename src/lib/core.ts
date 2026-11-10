import { createClient } from '@supabase/supabase-js';

// 1. 類型與貨幣配置
export type CurrencyCode = 'USD' | 'HKD' | 'EUR' | 'GBP' | 'AUD';
export type PlanType = 'pro' | 'vip';

export const SUPPORTED_CURRENCIES: { code: CurrencyCode; symbol: string; label: string; flag: string }[] = [
  { code: 'USD', symbol: '$', label: 'USD ($)', flag: '🇺🇸' },
  { code: 'HKD', symbol: 'HK$', label: 'HKD (HK$)', flag: '🇭🇰' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)', flag: '🇬🇧' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$)', flag: '🇦🇺' },
];

export const PRICING_PLANS: Record<PlanType, {
  id: PlanType;
  name: string;
  badge?: string;
  discountNote?: string;
  description: string;
  prices: Record<CurrencyCode, number>;
  features: string[];
}> = {
  pro: {
    id: 'pro',
    name: '标准会员 (Pro Plan)',
    description: '适合希望系统获取全球前沿商业洞察的个人与专业人士。',
    prices: { USD: 19, HKD: 148, EUR: 18, GBP: 15, AUD: 29 },
    features: [
      '解锁全站核心会员专属内容',
      '每月全球行业深度研究报告 (PDF/在线)',
      '7x24 小时优先在线客服支持',
      '支持随时取消，无隐藏手续费',
    ],
  },
  vip: {
    id: 'vip',
    name: '尊享会员 (VIP Plan)',
    badge: '最受欢迎 MOST POPULAR',
    discountNote: '立省 25%',
    description: '为企业决策者与高净值会员打造的顶级全方位智库与专属通道。',
    prices: { USD: 168, HKD: 1298, EUR: 158, GBP: 135, AUD: 258 },
    features: [
      '包含标准会员 (Pro) 全部核心权益',
      '1 对 1 专属全球业务顾问咨询通道',
      '抢先体验所有内测新功能与数据工具',
      '受邀参与年度全球线上闭门峰会',
    ],
  },
};

export function formatPrice(amount: number, currency: CurrencyCode): string {
  const config = SUPPORTED_CURRENCIES.find((c) => c.code === currency)!;
  return `${config.symbol}${amount.toLocaleString('en-US')}`;
}

// 2. Supabase 客戶端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 3. 商業合規中英雙語條款 (滿足 Airwallex 審核)
export const LEGAL_DOCS = {
  terms: {
    title: '服务条款 / Terms of Service',
    content: `【中文版】
1. 服务说明：ApexGlobal Limited（以下简称“本公司”）通过本网站向全球订阅用户提供数字研究报告、会员专享智库内容及商业咨询服务。
2. 账户与订阅：用户须提供真实有效的电子邮箱注册账户。付费会员权限将在 Airwallex 确认款项结清后自动激活（Pro 月付有效期 30 天，VIP 年付有效期 365 天）。
3. 知识产权：本站所有报告、数据与文章均受国际版权法保护，严禁未经授权的商业转售或公开分发。

[English Version]
1. Scope of Service: ApexGlobal Limited ("Company") provides digital industry research reports, exclusive member insights, and advisory services via this platform.
2. Account & Subscription: Users must register with a valid email address. Paid membership tiers are activated automatically upon payment confirmation via Airwallex (30 days for Pro Monthly; 365 days for VIP Yearly).
3. Intellectual Property: All content, reports, and tools are protected by international copyright laws. Unauthorized redistribution or commercial resale is strictly prohibited.`,
  },
  privacy: {
    title: '隐私政策 / Privacy Policy',
    content: `【中文版】
1. 数据收集：我们仅收集提供会员服务所必需的最少信息（电子邮箱、会员等级及交易元数据）。
2. 支付安全：所有信用卡及电子钱包支付均由持牌全球金融科技机构 Airwallex 托管处理，本网站服务器绝不存储您的完整银行卡号或 CVV 安全码。
3. 数据保护：我们严格遵守 GDPR 与香港《个人资料（私隐）条例》，绝不向第三方出售用户个人资料。

[English Version]
1. Data Collection: We only collect essential information required to deliver our membership services (email address, membership status, and transaction metadata).
2. Payment Security: All card and wallet transactions are securely processed by Airwallex (PCI-DSS Level 1 certified). Our servers never store your full card number or CVV.
3. Data Protection: We comply with GDPR and Hong Kong PDPO regulations and never sell user data to third parties.`,
  },
  refund: {
    title: '退款政策 / Refund Policy',
    content: `【中文版】
1. 7天无忧退款保障：首次订阅 Pro 或 VIP 会员的用户，如在支付成功后的 7 个自然日内对服务不满意，且尚未批量下载超过 2 份核心深度报告，可申请全额原路退款。
2. 退款处理时效：退款申请审核通过后，款项将于 3-5 个工作日内通过 Airwallex 原路退回至您的支付账户。
3. 联系退款：请发送您的注册邮箱与订单号至 support@://example.com 办理。

[English Version]
1. 7-Day Satisfaction Guarantee: First-time Pro or VIP subscribers who are not satisfied within 7 calendar days of purchase (and have downloaded no more than 2 core reports) may request a full refund.
2. Processing Time: Approved refunds are processed via Airwallex back to the original payment method within 3–5 business days.
3. How to Request: Please email your registered email address and order ID to support@://example.com.`,
  },
  contact: {
    title: '联系我们 / Contact Us',
    content: `【中文商业主体与客服信息】
运营主体：ApexGlobal Limited
注册地址：香港中环皇后大道中 99 号中环中心 45 楼 4502 室
官方客服邮箱：support@://example.com
商业合规电话：+852 3008 8899 (7x24 小时全球支持)

[English Corporate & Support Details]
Legal Entity: ApexGlobal Limited
Registered Address: Unit 4502, The Center, 99 Queen's Road Central, Central, Hong Kong
Customer Support Email: support@://example.com
Business Phone: +852 3008 8899 (24/7 Global Support)`,
  },
};
