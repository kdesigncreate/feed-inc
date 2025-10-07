import { Metadata } from 'next';
import { COMPANY_INFO } from './constants';

const baseUrl = 'https://www.feed-inc.com';

export function generatePageMetadata(
  title: string,
  description: string,
  path?: string,
  image?: string
): Metadata {
  const url = path ? `${baseUrl}${path}` : baseUrl;
  const fullTitle = `${title} | ${COMPANY_INFO.name}`;
  
  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: COMPANY_INFO.name,
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
      locale: 'ja_JP',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Predefined metadata for common pages
export const homeMetadata = generatePageMetadata(
  'プロモーション企画・制作会社 | リアル×デジタル支援',
  'フィードは、リアルとデジタルの両面からプロモーションやPR、ブランディングを支援する専門会社です。企業の成長をサポートする独自の企画・制作を提供しています',
  '/'
);

export const companyMetadata = generatePageMetadata(
  '会社概要',
  '株式会社フィードの会社概要、企業理念、アクセス情報をご紹介。1990年設立、リアル×デジタルでプロモーション企画・制作を手がける専門会社です。',
  '/company'
);

export const servicesMetadata = generatePageMetadata(
  'サービス一覧',
  '株式会社フィードのサービス紹介。店頭販促、デザイン、キャンペーン、イベント、デジタルプロモーション、営業ツール、ノベルティなど、リアル×デジタルでプロモーション企画・制作を手がけます。',
  '/services'
);

export const casesMetadata = generatePageMetadata(
  '事例紹介',
  '株式会社フィードの制作事例をご紹介。店頭販促、デザイン、キャンペーン、イベントなど、様々な業界のクライアント様の課題解決事例をご覧いただけます。',
  '/cases'
);

export const knowledgeMetadata = generatePageMetadata(
  'ナレッジ・記事一覧',
  '株式会社フィードのナレッジ・記事一覧。店頭販促、デザイン、キャンペーン、イベント、デジタルプロモーション、営業ツール、ノベルティに関する専門知識や事例を紹介します。',
  '/knowledge'
);
