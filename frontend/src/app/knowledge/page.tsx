'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { articleApi } from '@/lib/api';
import type { Article, Category } from '@/types';
import { handleDataFetchError } from '@/lib/errorHandler';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { isValidImageUrl } from '@/lib/imageUtils';

function KnowledgeContent() {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState(searchParams?.get('category') || 'all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articlesResponse, categoriesResponse] = await Promise.all([
          articleApi.getArticles({ published_only: true }),
          articleApi.getCategories(),
        ]);
        
        setArticles(articlesResponse.data || []);
        setCategories(categoriesResponse);
      } catch (err) {
        setError(handleDataFetchError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // URLパラメータの変更を監視
  useEffect(() => {
    const category = searchParams?.get('category');
    if (category) {
      setActiveFilter(category);
    }
  }, [searchParams]);

  const getCategoryKey = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      '店頭販促': 'store',
      'デザイン': 'design',
      'キャンペーン': 'campaign',
      'イベント': 'event',
      'デジタルプロモーション': 'digital',
      '営業ツール': 'sales',
      'ノベルティ': 'novelty'
    };
    return categoryMap[category] || 'other';
  };

  const filteredArticles = activeFilter === 'all'
    ? articles
    : articles.filter(article => getCategoryKey(article.category) === activeFilter);

  return (
    <>
      <Header />
      <main className="pt-20">
        <section id="kv" className="relative w-full">
          <picture className="block w-full">
            <source media="(max-width: 767px)" srcSet="/image/knowledge/SP_banner_knowledge.jpg" />
            <source media="(min-width: 768px)" srcSet="/image/knowledge/PC_banner_knowledge.jpg" />
            <Image
              src="/image/knowledge/PC_banner_knowledge.jpg"
              alt="KnowledgeKv"
              width={1200}
              height={400}
              className="w-full h-auto"
              priority={false}
              loading="lazy"
            />
          </picture>
        </section>
        <div className="py-16 px-4 sm:px-6 lg:px-12 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            ) : (
              <div className="flex flex-col-reverse lg:flex-row gap-8">
                {/* Sidebar */}
                <aside className="lg:w-1/4">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">記事カテゴリー</h3>
                    <ul className="space-y-2">
                      <li>
                        <button
                          onClick={() => setActiveFilter('all')}
                          className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 ${
                            activeFilter === 'all'
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          すべて <span className="text-gray-500">({articles.length})</span>
                        </button>
                      </li>
                      {categories.map((category) => (
                        <li key={category.key}>
                          <button
                            onClick={() => setActiveFilter(category.key)}
                            className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 border ${
                              activeFilter === category.key
                                ? 'bg-gray-500 text-white border-gray-500'
                                : 'bg-transparent text-gray-500 border-gray-500 hover:bg-gray-500 hover:text-white'
                            }`}
                          >
                            {category.label} <span className="text-gray-500">({category.count})</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>
                {/* Content Area */}
                <div className="lg:w-3/4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredArticles.map((article) => (
                      <div key={article.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                        {/* Thumbnail */}
                        {isValidImageUrl(article.featured_image) && (
                          <div className="relative w-full h-48">
                            <Image
                              src={article.featured_image}
                              alt={article.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="mb-4">
                            <span className="text-xs text-blue-600 font-medium">{article.tag}</span>
                          </div>
                          <h2 className="text-lg font-bold text-gray-900 mb-4 leading-tight">
                            <Link href={`/knowledge/${article.slug}`} className="hover:text-blue-600 transition-colors duration-200">
                              {article.title}
                            </Link>
                          </h2>
                          {article.excerpt && (
                            <p className="text-gray-600 text-sm mb-4 overflow-hidden text-ellipsis" style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {article.excerpt}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-gray-500">
                                {new Date(article.published_at).toLocaleDateString('ja-JP')}
                              </span>
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {article.category}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">{article.author}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {filteredArticles.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500">記事がありません</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function Knowledge() {
  return (
    <div className="font-main">
      <Suspense fallback={<LoadingSpinner />}>
        <KnowledgeContent />
      </Suspense>
    </div>
  );
}
