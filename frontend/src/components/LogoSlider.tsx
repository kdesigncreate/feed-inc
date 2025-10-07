'use client';

import React from 'react';
import Image from 'next/image';
import { PATHS } from '@/lib/constants';

export const LogoSlider: React.FC = () => {
  // 同じロゴを6回繰り返してスライダーを作成
  const logoItems = Array.from({ length: 6 }, (_, index) => (
    <Image 
      key={index}
      src={PATHS.IMAGES.CLIENT_LOGOS} 
      alt="クライアントロゴ" 
      width={400} 
      height={100} 
      quality={100} 
      unoptimized 
      className="h-full w-auto" 
    />
  ));

  return (
    <div className="logo-liner-outer">
      <div className="logo-liner-inner">
        {logoItems}
      </div>
    </div>
  );
}; 