'use client';

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';

const cases = [
  '/image/top/top_slider_Cases1.jpeg',
  '/image/top/top_slider_Cases2.jpeg',
  '/image/top/top_slider_Cases3.jpeg',
  '/image/top/top_slider_Cases4.jpeg',
  '/image/top/top_slider_Cases5.jpeg',
  '/image/top/top_slider_Cases1.jpeg', // ループ用に重複
  '/image/top/top_slider_Cases2.jpeg'  // ループ用に重複
];

export const CasesSlider: React.FC = () => {
  //CasesSliderはCasesSliderのコンポーネント。
  //React.FCはReactの関数コンポーネントにするためのもの。
  //引数はない。
  //戻り値はReact.ReactNode型。
  return (
    <div className="w-full relative px-8 md:px-24 lg:px-32 mb-12">
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        slidesPerGroup={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 10 }, // モバイル
          768: { slidesPerView: 2, spaceBetween: 15 }, // タブレット
          1024: { slidesPerView: 3, spaceBetween: 20 }  // デスクトップ
        }}
        className="cases-slider"
      >
        {cases.map((caseSrc, index) => (
          <SwiperSlide key={index}>
            <a href="/image/FEED_Cases.pdf" target="_blank" rel="noopener noreferrer">
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={caseSrc}
                  alt={`事例 ${index + 1}`}
                  width={400}
                  height={300}
                  className="w-full h-auto hover:scale-105 transition-transform duration-300"
                  style={{ aspectRatio: '4/3' }}
                />
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}; 