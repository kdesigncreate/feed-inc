// ~/feed-inc/frontend/components/HeroSection.tsx
'use client';

import React from 'react';

export const HeroSection: React.FC = () => {
  //HeroSectionはHeroSectionのコンポーネント。
  //React.FCはReactの関数コンポーネントにするためのもの。
  //引数はなし。
  // 2026 KV静止画対応（動画停止）

  // 画像のパス（public配下）
  const pcImageSrc = '/image/feed_WEB_KV_2026_PC.jpg';
  const spImageSrc = '/image/feed_WEB_KV_2026_SP.jpg';

  return (
    <section className="relative w-screen h-auto md:h-[720px] min-[1500px]:h-auto overflow-hidden mt-20 md:mt-24">
      <div className="relative w-full h-auto md:h-full min-[1500px]:h-auto">
        {/* PC/SPで静的KVを切替 */}
        <picture>
          {/* SP優先でsourceを先に記述（表示幅で分岐） */}
          <source media="(max-width: 767px)" srcSet={spImageSrc} />
          {/* デフォルトはPC */}
          <img
            src={pcImageSrc}
            alt="FEED Inc. Key Visual"
            className="w-full h-auto object-cover md:h-full min-[1500px]:h-auto md:object-top"
            loading="eager"
            decoding="async"
          />
        </picture>
        
        {/* その他のコンテンツ */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white">
          <span className="text-sm font-medium mb-2" aria-label="Scroll down for more content">
            SCROLL
          </span>
          <div className="w-px h-6 bg-white animate-scroll-bounce" aria-hidden="true"></div>
        </div>
      </div>
    </section>
  );
};