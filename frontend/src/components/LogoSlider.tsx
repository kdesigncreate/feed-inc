'use client';

import React from 'react';
import Image from 'next/image';
import { PATHS } from '@/lib/constants';

export const LogoSlider: React.FC = () => {
  //LogoSliderはLogoSliderのコンポーネント。
  //React.FCはReactの関数コンポーネントにするためのもの。
  //引数はない。
  //戻り値はReact.ReactNode型。
  const logoItems = Array.from({ length: 6 }, (_, index) => (
    //logoItemsはlogoItemsの要素を取得するための関数。
    //Array.fromは配列を作成するための関数。
    //length: 6は6回繰り返すための関数。
    //(_, index) => (はindexを取得するための関数。
    //_はindexを取得するための関数。
    //indexはindexを表す。
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