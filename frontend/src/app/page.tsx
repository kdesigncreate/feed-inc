"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { HeroSection } from '../components/HeroSection';
import { CasesSlider } from '../components/CasesSlider';
import { LogoSlider } from '../components/LogoSlider';
import { Card } from '../components/Card';
import { articleApi } from '../lib/api';
import type { Article } from '../types';
import { SERVICE_CATEGORIES } from '../lib/constants';
import { Button } from '../components/Button';



const workflows = [
  {
    image: '/image/top/top_WF_01_text.png'
  },
  {
    image: '/image/top/top_WF_02_text.png'
  },
  {
    image: '/image/top/top_WF_03_text.png'
  },
  {
    image: '/image/top/top_WF_04_text.png'
  }
];

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articlesError, setArticlesError] = useState<string | null>(null);

  // Fetch latest articles
  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        setArticlesLoading(true);
        const response = await articleApi.getArticles({ published_only: true });
        // Get the latest 3 articles
        const latestArticles = response.data?.slice(0, 3) || [];
        setArticles(latestArticles);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
        setArticlesError('記事の取得に失敗しました');
      } finally {
        setArticlesLoading(false);
      }
    };

    fetchLatestArticles();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '.');
  };

  return (
    <div className="font-main">
      <Header />
      <HeroSection />
      {/* Company Mission Section */}
      <section className="bg-white max-w-7xl mx-auto px-4 py-20 md:py-24 text-center sm:px-6 lg:px-12">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-800">
            <Image
              src="/image/top/top_tx_companymission_2line_gray.png"
              alt="CampanyMission"
              width={500}
              height={100}
              className="w-full max-w-[500px] h-auto mx-auto mb-8"
            />
          </h2>
          <p className="max-w-4xl mx-auto px-4 text-lg leading-relaxed text-gray-700">
            私たちフィードは、「気づき」を活かした<wbr />プランニングとデザインで、<br />
            クライアントの商品の成長と生活者の快適な暮らしをサポートします。
          </p>
        </div>
        <div className="flex flex-col w-full mb-16 gap-12 md:flex-row">
          {/* Planning セクション */}
          <div className="flex flex-col flex-1 bg-gray-100 rounded-lg">
            <div className="flex-1 p-8">
              <h3 className="mb-8 -mt-14">
                <Image
                  src="/image/top/top_tx_planning_gray.png"
                  alt="planning"
                  width={400}
                  height={100}
                  className="h-auto mx-auto"
                />
              </h3>
              <p className="text-left leading-8 tracking-wide text-gray-700">
                現状分析からの課題抽出、コンセプト設計といった戦略部分から、具体的な施策の戦術プランまで、プランニングの専門スタッフを中心にトータルに企画。担当者の右腕としてマーケティングを総合的にご支援します。
              </p>
            </div>
            <div className="w-4/5 mx-auto pb-8">
              <Image
                src="/image/top/top_planning_3icon_ABC.png"
                alt="アイコン"
                width={300}
                height={200}
                className="w-full h-auto"
              />
            </div>
          </div>
          {/* Design セクション */}
          <div className="flex flex-col flex-1 bg-gray-100 rounded-lg">
            <div className="flex-1 p-8">
              <h3 className="mb-8 -mt-14">
                <Image
                  src="/image/top/top_tx_design_gray.png"
                  alt="design"
                  width={400}
                  height={100}
                  className="h-auto mx-auto"
                />
              </h3>
              <p className="text-left leading-8 tracking-wide text-gray-700">
                30年以上の販促支援で培った売りにつながる独自のデザインノウハウが強みです。WebやSNS、パッケージや動画などメディアや手法に合わせて、ブランドの魅力を引き出す最適なクリエイティブを提供します。
              </p>
            </div>
            <div className="w-4/5 mx-auto pb-8">
              <Image
                src="/image/top/top_design_3icon_ABC.png"
                alt="アイコン"
                width={300}
                height={200}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      
        <LogoSlider />
        
        <div className="flex items-center justify-center mt-16">
          <Button href="/company" target="_blank">
            ViewMore
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-100 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-24 text-center sm:px-6 lg:px-12">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-800">
            <Image
              src="/image/top/top_tx_service_gray.png"
              alt="Services"
              width={500}
              height={100}
              className="w-full max-w-[500px] h-auto mx-auto mb-8"
            />  
          </h2>
          <p className="max-w-4xl mx-auto px-4 text-lg leading-relaxed text-gray-700">
            プロモーションやブランディングの<wbr />様々な課題に対して、<br />
            リアル・デジタルの両面から<wbr />最適な施策をご提案。<wbr />BtoCだけでなく<wbr />BtoBにも対応します。
          </p>
        </div>
        <div className="flex flex-col-reverse mb-16 md:flex-row">
          <div className="flex flex-col w-full gap-8 hidden md:flex md:w-1/2">
            <div className="flex flex-col w-4/5 mx-auto gap-8">
              <div className="flex justify-between gap-8">
                <Image
                  src="/image/top/top_service_B3.png"
                  alt=""
                  width={200}
                  height={150}
                  className="w-1/2"
                />
                <Image
                  src="/image/top/top_service_B2.png"
                  alt=""
                  width={200}
                  height={150}
                  className="w-1/2"
                />
              </div>
              <div className="flex justify-between gap-8">
                <Image
                  src="/image/top/top_service_B1.png"
                  alt=""
                  width={200}
                  height={150}
                  className="w-1/2"
                />
                <Image
                  src="/image/top/top_service_B4.png"
                  alt=""
                  width={200}
                  height={150}
                  className="w-1/2"
                />
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center items-center px-16">
            <ul className="w-full space-y-6">
              {SERVICE_CATEGORIES.map((service, index) => (
                <li 
                  key={index}
                  className={`text-lg text-left pb-4 ${index < SERVICE_CATEGORIES.length - 1 ? 'border-b border-black' : ''}`}
                >
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="flex justify-center items-center">
          <Button href="/services" target="_blank">
            ViewMore
          </Button>
        </div>
        </div>
      </section>

      {/* Cases Section */}
      <section className="bg-white text-center py-20 md:py-24">
        <div className="text-center mb-16">
          <h2 className="w-full max-w-lg mx-auto pb-8">
            <Image
              src="/image/top/top_tx_cases_gray.png"
              alt="Cases"
              width={500}
              height={100}
              className="w-full h-auto"
            />
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto px-4">
            フィードがご支援したプロジェクトや<wbr />クリエイティブ実績の一部をご紹介します。
          </p>
        </div>
        
        <CasesSlider />
        
        <div className="flex justify-center items-center">
          <Button href="/cases">
            ViewMore
          </Button>
        </div>
      </section>

      <section id="workflow-section" className="bg-gray-100 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="max-w-7xl mx-auto text-center py-20 md:py-24 px-4 sm:px-6 lg:px-12">
        <div className="text-center pb-20">
          <h2 className="w-full max-w-lg mx-auto pb-8">
            <Image
              src="/image/top/top_tx_workflow_gray.png"
              alt="Workflow"
              width={500}
              height={100}
              className="w-full"
            />
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto px-4">
            プロジェクトに合わせてチームを編成。<wbr />クライアントと併走しながら、<wbr />成功に向けて取り組みます。
          </p>
        </div>   
        <div className="flex flex-col md:flex-row justify-center items-center">
          <div className="w-full h-auto max-w-5xl mx-auto flex flex-col md:flex-row gap-6 md:gap-12 px-4 md:px-0">
            {workflows.map((workflow, index) => (
              <div 
                key={index} 
                className="w-full relative"
              >
                <Image
                  src={`/image/top/top_WF_0${index + 1}_image.png`}
                  alt=""
                  width={260}
                  height={300}
                  className="absolute -top-4 -right-4 z-0 pointer-events-none select-none"
                />
                <Image
                  src={workflow.image}
                  alt=""
                  width={320}
                  height={100}
                  className="w-full block relative z-10"
                />
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-12">
        <div className="text-center pb-20">
          <h2 className="w-full max-w-lg mx-auto pb-8">
            <Image
              src="/image/top/top_tx_knowledge_gray.png"
              alt="Knowledge"
              width={500}
              height={100}
              className="w-full"
            />
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto px-4">
            プロデュース・プランニング・デザインを<wbr />テーマに専門的な視点から、<wbr />お役立ち情報をお届けします。
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {articlesLoading ? (
            // Loading state - show 3 skeleton cards
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 rounded w-3/4"></div>
              </div>
            ))
          ) : articlesError ? (
            // Error state
            <div className="col-span-3 text-center text-red-500">
              {articlesError}
            </div>
          ) : articles.length > 0 ? (
            // Display articles
            articles.map((article) => (
              <Card
                key={article.id}
                title={article.title}
                date={formatDate(article.published_at || article.created_at)}
                tag={article.tag || article.category}
                author={article.author}
                href={`/knowledge/${article.slug}`}
              />
            ))
          ) : (
            // No articles found
            <div className="col-span-3 text-center text-gray-500">
              記事が見つかりませんでした
            </div>
          )}
        </div>
        
        <div className="flex justify-center items-center">
          <Button href="/knowledge">
            ViewMore
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
