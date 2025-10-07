'use client';

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

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
  return (
    <div className="w-full relative px-8 md:px-24 lg:px-32 mb-12">
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        slidesPerGroup={1}
        loop={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        breakpoints={{
          0: { slidesPerView: 1 }, // モバイル
          768: { slidesPerView: 2 }, // タブレット
          1024: { slidesPerView: 3 }  // デスクトップ
        }}
      >
        {cases.map((caseSrc, index) => (
          <SwiperSlide key={index}>
            <a href="/image/FEED_Cases.pdf" target="_blank">
              <Image
                src={caseSrc}
                alt="事例"
                width={300}
                height={200}
                className="w-full hover:scale-105 transition-transform duration-300"
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}; 