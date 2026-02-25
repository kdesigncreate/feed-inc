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
    <section className="relative w-screen pt-0 max-[767px]:pt-20 bg-transparent">
      <div className="relative w-full">
        {/* PC/SPで静的KVを切替 */}
        <picture>
          {/* SP優先でsourceを先に記述（表示幅で分岐） */}
          <source media="(max-width: 767px)" srcSet={spImageSrc} />
          {/* デフォルトはPC */}
          <img
            src={pcImageSrc}
            alt="FEED Inc. Key Visual"
            className="w-full h-auto object-cover md:object-top"
            loading="eager"
            decoding="async"
          />
        </picture>

      </div>
    </section>
  );
};