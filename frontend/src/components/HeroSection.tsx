// ~/feed-inc/frontend/components/HeroSection.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getResponsiveVideoSrc } from '@/lib/utils';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const videoSource = getResponsiveVideoSrc(); // getResponsiveVideoSrc() が単一のURLを返すことを前提

      videoElement.src = videoSource; // ここで動画のURLを設定
      videoElement.load(); // 新しいsrcをロードして動画を読み込ませる

      const handleLoadedData = () => {
        setIsLoading(false);
      };
      
      const handleError = () => {
        setIsLoading(false);
        setHasError(true);
      };

      videoElement.addEventListener('loadeddata', handleLoadedData);
      videoElement.addEventListener('error', handleError);

      return () => {
        videoElement.removeEventListener('loadeddata', handleLoadedData);
        videoElement.removeEventListener('error', handleError);
      };
    }
  }, []);

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