'use client';

import React, { useState } from 'react';
import Image from 'next/image';
// import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';

// CaseItem型を定義
interface CaseItem {
  id: string;
  image: string;
  modalImage?: string;
  tag: string;
  studyName: string;
  clientName: string;
  category: string;
  description: string;
  points: string[];
}

interface CaseModalContentProps {
    caseData: CaseItem;
}
  
const filters = [
    { key: 'all', label: 'すべて' },
    { key: 'store-promotion', label: '店頭販促' },
    { key: 'design', label: 'デザイン' },
    { key: 'campaign', label: 'キャンペーン' },
    { key: 'event', label: 'イベント' },
    { key: 'degitalPromotion', label: 'デジタルプロモーション' },
    { key: 'salesTool', label: '営業ツール' },
    { key: 'novelty', label: 'ノベルティ' }
];

const CaseModalContent: React.FC<CaseModalContentProps> = ({ caseData }) => {
    const modalImageSrc = caseData.modalImage ?? caseData.image;
    return (
      <div className="w-full flex flex-col md:flex-row md:gap-0">
        {/* 左カラム（画像領域） */}
        <div className="w-full md:basis-1/2 md:shrink-0 md:grow-0 relative overflow-hidden md:rounded-none min-h-[320px] sm:min-h-[400px] md:h-full 2xl:h-[600px]" style={{ background: 'linear-gradient(-20deg, #aaa 0%, #ddd 100%)' }}>
          <div className="absolute inset-0">
            <Image
              src={modalImageSrc}
              alt={caseData.studyName}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
        {/* 右カラム（テキスト領域） */}
        <div className="w-full md:w-1/2 box-border relative px-6 py-8 sm:px-8 sm:py-10 md:px-16 md:py-16">
          <h3 className="m-0 pb-2 text-xl md:text-2xl font-bold text-gray-900 border-b border-dotted border-gray-400">{caseData.studyName}</h3>
          <p className="mt-2 mb-4 md:text-lg font-semibold text-gray-800">{caseData.clientName}</p>
          <p className="text-gray-600 md:text-lg leading-relaxed">{caseData.description}</p>
          <ul className="mt-10 md:mt-16 pl-5 list-[square] relative space-y-3">
            {/* point ラベル */}
            <span className="absolute -top-8 left-0 font-semibold text-blue-500 text-base md:text-lg">point</span>
            {caseData.points.map((point, index) => (
              <li key={index} className="text-sm md:text-base text-gray-700">{point}</li>
            ))}
          </ul>
        </div>
      </div>
    );
};

const cases: CaseItem[] = [
    {
      id: 'modal01',
      image: '/image/cases/case_hnsk_01.png',
      modalImage: '/image/cases/case_hnsk_01_modal.png',
      tag: '店頭販促',
      studyName: 'ベースメイクブランドの店頭プロモーション什器',
      clientName: '常盤薬品工業株式会社様',
      category: 'store-promotion',
      description: '世界観を統一しながら、ブランドラインナップ／アイテム別の什器デザインから制作を一連で担当しました。',
      points: ['ブランドイメージを第一としながらアイテム毎の特長を分かりやすく訴求。', '中長期的な商品施策に合わせて、流用等も鑑みて連動した案件に。', '什器デザインに連動して、SNS用の撮影〜データ制作、カタログ、ブランドサイト等も担当。']
    },
    {
      id: 'modal02',
      image: '/image/cases/case_evnt_01.png',
      modalImage: '/image/cases/case_evnt_01_modal.png',
      tag: 'イベント',
      studyName: '国際ホテル＆レストランショー 出展ブース',
      clientName: 'エステー株式会社／エステーPRO株式会社',
      category: 'event',
      description: '業界関係者向けのイベントブースの企画／施工を担当。ブランディングを意識したブース作りから、来場者PRを行いました。',
      points: ['出展目的やPRしたいポイントを、デザインや導線設計など、様々な面で実現。', '会場内での目立ち方や、ブランディングを意識したクリエイティブを提供。', '来場者UP・商談数UPの実績にも寄与。']
    },
    {
      id: 'modal03',
      image: '/image/cases/case_cmpn_01.png',
      tag: 'キャンペーン',
      studyName: '中華まんのキャンペーン',
      clientName: '井村屋株式会社',
      category: 'campaign',
      description: '景品やデザインに変化を加え、流通企業への採用強化を狙ったキャンペーン内容で提案・実施しました。',
      points: ['時流も踏まえ消費者に刺さりやすい景品を企画提案。', '各コースの応募方法を見直すことで、応募のハードルを下げた。', '結果、前年より約2倍の応募数を記録。']
    },
    {
      id: 'modal04',
      image: '/image/cases/case_cmpn_02.png',
      tag: 'キャンペーン',
      studyName: '梅酒フェア チェーンカスタマイズキャンペーン',
      clientName: 'チョーヤ梅酒株式会社',
      category: 'campaign',
      description: '流通企業ごとに異なる展開に合わせて、細かなカスタマイズを行ったタイアップキャンペーンの告知デザインと店頭ツールを制作。',
      points: ['チェーンごとに景品や当選人数を変更し、クライアント様の営業活動を後押し。', 'デザイン性・費用面共にご満足いただける結果に。', 'キャンペーンと同時に売場を盛り上げる演出ツールも制作。']
    },
    {
      id: 'modal05',
      image: '/image/cases/case_dgpr_01.png',
      tag: 'デジタルプロモーション',
      studyName: '敏感肌用エイジングケアシリーズSNSクチコミ施策',
      clientName: '常盤薬品工業株式会社',
      category: 'digitalPromotion',
      description: 'Instagramと@cosmeでのクチコミを増やす施策を実施。一般モニターの方からの質の良いクチコミ増加を実現しました。',
      points: ['モニターをセグメントしながら実施したので、PR投稿だがリアルなクチコミが集まった。', '使用後のアンケートも実施し、今後の認知施策や商品開発に活かせる情報が手に入れられた。']
    },
    {
      id: 'modal06',
      image: '/image/cases/case_dgpr_02.png',
      tag: 'デジタルプロモーション',
      studyName: '消臭芳香剤のSNS認知拡大施策',
      clientName: 'エステー株式会社',
      category: 'digitalPromotion',
      description: '20〜30代女性への認知拡大のため、SNS施策を提案・実行。全体設計から効果検証・PDCAを回しながら施策を行いました。',
      points: ['全体ロードマップに基づき、ターゲットに対し効率的な情報発信を行った。', '一般ユーザーからの良質なUGCを創出し、SNSからの情報検索に対応する土台を形成。']
    },
    {
      id: 'modal07',
      image: '/image/cases/case_dsgn_01.png',
      tag: 'デザイン',
      studyName: '飲料製品のパッケージ デザイン',
      clientName: '株式会社エルビー',
      category: 'design',
      description: 'コンビニエンスストア様向け製品のパッケージデザインを担当。デザインだけでなく商品名やコピーもご提案しました。',
      points: ['商品導入の重要な要素となるため、クライアント様とともにタッグを組んでデザインを制作。', '１チェーン限定発売であったがSNS等でも話題となり、他のチェーンでも販売した。']
    },
    {
      id: 'modal08',
      image: '/image/cases/case_dsgn_02.png',
      tag: 'デザイン',
      studyName: '高難易度ジグソーパズルの企画・デザイン',
      clientName: '株式会社ハナヤマ',
      category: 'design',
      description: 'パッケージだけでなく商品名やコピー、難易度の表示といった箇所についても、考察・検討を重ねて制作しました。',
      points: ['クライアント様とのブレストを行い、提案の幅と方向性を検討。', '見込み出荷を上回る結果となりラインナップの増強へ。',]
    },
    {
      id: 'modal09',
      image: '/image/cases/case_eigy_01.png',
      tag: '営業ツール',
      studyName: 'ユニットバス新機能訴求ツール',
      clientName: '株式会社LIXIL',
      category: 'salesTool',
      description: '新機能を訴求するために、商談時に従来品と新商品の違いを体感して頂くツールを開発。',
      points: ['持ち運びのしやすいA4サイズの中に実演に必要な要素を整理。', '体感して頂くことで新製品の魅力を感じてもらうことに成功し、継続的に改良を加え大変好評。']
    },
    {
      id: 'modal10',
      image: '/image/cases/case_evnt_02.png',
      tag: 'イベント',
      studyName: 'スキンケアブランドの周年イベント',
      clientName: '常盤薬品工業株式会社',
      category: 'event',
      description: 'ブランド20周年を記念し、「＠cosmeTOKYO」でイベントを実施。超BIGカプセルトイやピールオフ広告などを企画・展開しました。',
      points: ['周年特設サイトの制作も担当。エピソード募集やキャンペーンを実施。', '企画イベントは総参加数約3,500人となりSNSとの連携も。']
    },
    {
      id: 'modal11',
      image: '/image/cases/case_hnsk_02.png',
      modalImage: '/image/cases/case_hnsk_02_modal.png',
      tag: '店頭販促',
      studyName: '消臭芳香剤のビジュアル開発・販促ツール',
      clientName: 'エステー株式会社',
      category: 'store-promotion',
      description: 'ブランドのキービジュアル制作から、店頭展開時に世界観を表現する売場演出ツールまでトータルで企画・制作しました。',
      points: ['ブランドへの深い理解をベースにベストなクリエイティブをゼロから開発。', 'ブランド専任スタッフ編成による安定したサポート体制、高水準のクオリティで対応。']
    },
    {
      id: 'modal12',
      image: '/image/cases/case_nvlty_01.png',
      tag: 'ノベルティ',
      studyName: 'コンタクトレンズケアのベタ付けノベルティ各種',
      clientName: 'ボシュロム・ジャパン株式会社',
      category: 'novelty',
      description: 'シーズン毎の製品ベタ付け＆商談活用のため、ノベルティを定期的に制作。アイテム提案からデザイン、制作を一貫して行いました。',
      points: ['飽きの来ない、新鮮なアイテム提案を長期にわたって実施。', '方向性に合わせてトンマナ等も意識的に変化させ、競合品からのスイッチの後押しに貢献。']
    },
  ];

export default function Cases() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const filteredCases = activeFilter === 'all' 
    ? cases 
    : cases.filter(caseItem => caseItem.category === activeFilter);

  const handleCaseClick = (caseData: CaseItem) => {
    setSelectedCase(caseData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCase(null);
  };

  return (
    <div className="font-main">
      <Header />
      
      <main className="pt-20">
        <section id="kv" className="relative w-full">
            <picture className="block w-full">
                <source media="(max-width: 767px)" srcSet="/image/cases/cases_titleimage_sp.jpg" />
                <source media="(min-width: 768px)" srcSet="/image/cases/PC_banner_cases.jpg" />
                <Image
                src="/image/cases/PC_banner_cases.jpg"
                alt="CasesKv"
                width={1200}
                height={400}
                className="w-full h-auto"
                priority={false}
                />
            </picture>
        </section>

        <section id="cases__button" className="py-8 px-4 sm:px-6 lg:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                {filters.map((filter) => (
                    <button
                    key={filter.key}
                    onClick={() => handleFilterChange(filter.key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 border ${
                        activeFilter === filter.key
                        ? 'bg-gray-500 text-white border-gray-500'
                        : 'bg-transparent text-gray-500 border-gray-500 hover:bg-gray-500 hover:text-white'
                    }`}
                    >
                    {filter.label}
                    </button>
                ))}
                </div>
            </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-12 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCases.map((caseItem) => (
                        <div
                            key={caseItem.id}
                            className="relative rounded-2xl shadow-xl bg-white overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl group flex flex-col"
                        >
                            {/* タグバッジを画像左上に重ねる */}
                            {caseItem.tag && (
                                <span className="absolute top-4 left-4 z-10 bg-[#2b66b1]/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm group-hover:scale-110 transition-transform">{caseItem.tag}</span>
                            )}
                            {/* 画像を比率維持で大きく表示 */}
                            <div className="relative w-full aspect-[4/3] bg-gray-100">
                                <Image
                                    src={caseItem.image}
                                    alt={caseItem.studyName}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            {/* 本文エリア */}
                            <div className="flex-1 flex flex-col px-6 py-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{caseItem.studyName}</h3>
                                <p className="text-gray-600 text-sm mb-2">{caseItem.clientName}</p>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{caseItem.description}</p>
                                <div className="mt-auto">
                                    <Button 
                                        variant="primary"
                                        onClick={() => handleCaseClick(caseItem)}
                                    >
                                        詳しく見る
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            maxWidth="4xl"
        >
            {selectedCase && <CaseModalContent caseData={selectedCase} />}
        </Modal>
        
      </main>
      
      <Footer />
    </div>
  );
}