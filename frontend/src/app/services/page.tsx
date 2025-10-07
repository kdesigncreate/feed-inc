import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { SkipLink } from '@/components/SkipLink';
// import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Footer } from '@/components/Footer';
// import { servicesMetadata } from '@/lib/metadata';
import { ServiceCardComponent } from '@/components/ServiceCard';

// export const metadata = servicesMetadata;

const services = [
  {
    id: 'salespromotion',
    imageSrc: '/image/services/services_salespromotion.png',
    imageAlt: '店頭販促',
    title: '店頭販促',
    description: '商品の魅力を最大限アピールできるディスプレイ、POPなどを制作。視覚的な訴求力を高めることで、購買意欲を引き出し、売上向上に繋げます。',
    features: [
      '・　フロア什器、カウンター什器、ハンガー什器展開',
      '・　エンド売場全体でのブランド演出',
      '・　定番売場でのPOP展開',
      '・　動画や音声を活用した売場訴求',
      '・　メニューレシピ開発やリーフレット作成'
    ],
    buttonText: '事例を見る',
    buttonHref: '/image/FEED_Cases.pdf',
    isExternal: true
  },
  {
    id: 'design',
    imageSrc: '/image/services/services_designs.png',
    imageAlt: 'デザイン',
    title: 'デザイン',
    description: 'ブランドイメージを視覚的に強化し、印象に残るクリエイティブを考案。パッケージ、ロゴ、広告など、デザインによる魅力や競争力の強化を実現します。',
    features: [
      '・　販促物・広告キービジュアル',
      '・　パッケージ、ロゴ、マニュアル',
      '・　ブランドサイト、ＬＰ、バナー、SNS画像',
      '・　撮影から編集、レタッチ',
      '・　コーナー演出、空間演出'
    ],
    buttonText: '事例を見る',
    buttonHref: '/image/FEED_Cases.pdf',
    isExternal: true
  },
  {
    id: 'campaign',
    imageSrc: '/image/services/services_campaign.png',
    imageAlt: 'キャンペーン',
    title: 'キャンペーン',
    description: '商品の新発売やブランド認知向上のためのキャンペーン企画から実施まで。ターゲットに響くメッセージと効果的な媒体選択で、成果を最大化します。',
    features: [
      '・　新商品発売キャンペーン',
      '・　ブランド認知向上キャンペーン',
      '・　季節限定キャンペーン',
      '・　地域限定キャンペーン',
      '・　インフルエンサー活用キャンペーン'
    ],
    buttonText: '事例を見る',
    buttonHref: '/image/FEED_Cases.pdf',
    isExternal: true
  },
  {
    id: 'event',
    imageSrc: '/image/services/services_event.png',
    imageAlt: 'イベント',
    title: 'イベント',
    description: '商品体験やブランド体験を通じて、顧客との関係性を深めるイベント企画。参加者の記憶に残る体験を提供し、ブランドファン化を促進します。',
    features: [
      '・　商品体験イベント',
      '・　ブランド体験イベント',
      '・　セミナー・ワークショップ',
      '・　展示会・フェア',
      '・　オンラインイベント'
    ],
    buttonText: '事例を見る',
    buttonHref: '/image/FEED_Cases.pdf',
    isExternal: true
  },
  {
    id: 'digitalpromotion',
    imageSrc: '/image/services/services_digitalpromotion.png',
    imageAlt: 'デジタルプロモーション',
    title: 'デジタルプロモーション',
    description: 'SNSでのPRや動画広告、サイネージ展開など、課題にあわせて戦略から手法まで設計。効果測定を行いながら、より効果的なご提案に繋げます。',
    features: [
      '・　インフルエンサーを活用したSNS展開',
      '・　SNS動画やニュース動画による認知～理解促進訴求',
      '・　ターゲット媒体によるWeb広告やタイアップ企画',
      '・　店頭や各施設サイネージを活用したPR企画',
      '・　購買データを活用した広告展開～効果分析'
    ],
    buttonText: '事例を見る',
    buttonHref: '/image/FEED_Cases.pdf',
    isExternal: true
  },
  {
    id: 'salestools',
    imageSrc: '/image/services/services_salestools.png',
    imageAlt: '営業ツール',
    title: '営業ツール',
    description: '商談時に商品やサービス内容を、より興味を持っていただけるようなプレゼンツールをご提案。伝わりやすさや印象付ける仕掛けから、商談や成約アップをサポート。',
    features: [
      '・　ストーリーを重視した構成・デザインのカタログ',
      '・　商品やサービスを反映した営業ノベルティ企画',
      '・　映像や音声を活用したデジタル企画',
      '・　商品やサービスを実体験していただく体験ツール',
      '・　特定の顧客向け対策としての特別営業キット'
    ],
    buttonText: '事例を見る',
    buttonHref: '/image/FEED_Cases.pdf',
    isExternal: true
  },
  {
    id: 'novelty',
    imageSrc: '/image/services/services_novelty.png',
    imageAlt: 'ノベルティ',
    title: 'ノベルティ',
    description: 'ブランドの印象を残すノベルティ企画・制作。商品の特徴やブランドの世界観を表現し、長く愛用していただけるアイテムをご提案します。',
    features: [
      '・　ブランドロゴ入りノベルティ',
      '・　商品の特徴を活かしたノベルティ',
      '・　季節限定ノベルティ',
      '・　イベント限定ノベルティ',
      '・　サステナブルなノベルティ'
    ],
    buttonText: '事例を見る',
    buttonHref: '/image/FEED_Cases.pdf',
    isExternal: true
  }
];

export default function Services() {
  return (
    <div className="font-main">
        <SkipLink />
        <Header />
        
        <main id="main-content" className="pt-20">
            <section id="kv" className="relative w-full">
                <picture className="block w-full">
                    <source media="(max-width: 767px)" srcSet="/image/services/SP_banner_services.jpg" />
                    <source media="(min-width: 768px)" srcSet="/image/services/PC_banner_services.jpg" />
                    <Image
                    src="/image/services/PC_banner_services.jpg"
                    alt="ServicesKv"
                    width={1200}
                    height={400}
                    className="w-full h-auto"
                    priority={false}
                    />
                </picture>
            </section>

            <section className="py-16 px-4 sm:px-6 lg:px-12 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    プランニング＆デザインの両側面から、<br className="hidden sm:block" />
                    クライアント様の課題の解決やビジネスの成長を支援するために、<br className="hidden sm:block" />
                    様々なサービスを提供しております。
                    </p>
                </div>
            </section>

            <section id="Services" className="py-20 px-4 sm:px-6 lg:px-12">
                <div className="services__container space-y-[7.5rem]">
                    {services.map((service, index) => (
                        <ServiceCardComponent
                            key={service.id}
                            service={service}
                            index={index}
                        />
                    ))}
                </div>
            </section>

            <section className="py-16 px-4 sm:px-6 lg:px-12 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                    その他様々なサービスをご提供しております。<br className="hidden sm:block" />
                    ご質問、ご相談は下記よりご連絡ください。
                    </p>
                    <div className="flex justify-center">
                    <a
                        href="mailto:contact@feed-inc.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-white text-gray-700 px-8 py-3 rounded-md border border-gray-500 hover:bg-gray-500 hover:text-white transition-colors duration-300 font-medium"
                    >
                        Contact us
                    </a>
                    </div>
                </div>
            </section>

        </main>
        
        <Footer />
    </div>

  );
}