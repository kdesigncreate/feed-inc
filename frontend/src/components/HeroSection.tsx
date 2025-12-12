// ~/feed-inc/frontend/components/HeroSection.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getResponsiveVideoSrc } from '@/lib/utils';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const HeroSection: React.FC = () => {
  //HeroSectionはHeroSectionのコンポーネント。
  //React.FCはReactの関数コンポーネントにするためのもの。
  //引数はなし。
  const videoRef = useRef<HTMLVideoElement>(null);
  //videoRefはvideoのrefを表す。
  const [isLoading, setIsLoading] = useState(true);
  //isLoadingは動画が読み込まれているかどうかを表す。
  //setIsLoadingはisLoadingの状態を変更するためのもの。
  const [hasError, setHasError] = useState(false);
  //hasErrorは動画が読み込まれていないかどうかを表す。
  //setHasErrorはhasErrorの状態を変更するためのもの。

  useEffect(() => {
    //useEffectは副作用を実行するためのもの。
    //副作用とは、コンポーネントの外側の状態を変更すること。（ここでは動画を読み込ませる。）
    const videoElement = videoRef.current;
    //videoElementはvideoのrefを表す。

    if (videoElement) {
      //videoElementが存在する場合はif文の中に入る。
      const videoSource = getResponsiveVideoSrc(); 
      // getResponsiveVideoSrc() が単一のURLを返すことを前提。

      videoElement.src = videoSource; // ここで動画のURLを設定
      videoElement.load(); // 新しいsrcをロードして動画を読み込ませる

      const handleLoadedData = () => {
        //handleLoadedDataは動画が読み込まれた時の処理を表す。
        setIsLoading(false);
        //isLoadingの状態をfalseにする。
      };
      
      const handleError = () => {
        //handleErrorは動画が読み込まれなかった時の処理を表す。
        setIsLoading(false);
        //isLoadingの状態をfalseにする。
        setHasError(true);
        //hasErrorの状態をtrueにする。
      };

      videoElement.addEventListener('loadeddata', handleLoadedData);
      //handleLoadedDataをvideoElement.addEventListenerで監視するためのもの。
      //loadeddataは動画が読み込まれた時のイベント。
      videoElement.addEventListener('error', handleError);
      //handleErrorをvideoElement.addEventListenerで監視するためのもの。
      //errorは動画が読み込まれなかった時のイベント。

      return () => {
        //return () => {はuseEffectが実行されるタイミングを決定するためのもの。
        videoElement.removeEventListener('loadeddata', handleLoadedData);
        //handleLoadedDataをvideoElement.removeEventListenerで監視するためのもの。
        //loadeddataは動画が読み込まれた時のイベント。
        videoElement.removeEventListener('error', handleError);
      };
    }
  }, []);
  //[]は依存配列を表す。
  //依存配列とは、useEffectが実行されるタイミングを決定するためのもの。
  //[]が空の場合は、useEffectが初回のみ実行される。

  return (
    <section className="relative w-screen h-screen overflow-hidden">
      <div className="relative w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <LoadingSpinner size="lg" />
          </div>
        )}
        
        {hasError ? (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center text-white">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Video could not be loaded</h2>
              <p>Please check your connection and try again.</p>
            </div>
          </div>
        ) : (
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover"
            aria-label="Company introduction video"
          >
            Your browser does not support the video tag.
          </video>
        )}
        
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