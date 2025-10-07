'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { articleApi } from '@/lib/api';
import type { Article, Category } from '@/types';
import { articleErrorHandler } from '@/lib/errorHandler';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function KnowledgeDetail({ params }: { params: { slug: string } }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articleData, categoriesData] = await Promise.all([
          articleApi.getArticle(params.slug),
          articleApi.getCategories(),
        ]);
        setArticle(articleData);
        setCategories(categoriesData);
      } catch (err: unknown) {
        setError(articleErrorHandler.notFound(err));
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchData();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="font-main bg-gray-50 min-h-screen">
        <Header />
        <main className="pt-20 pb-20 flex justify-center items-center">
          <LoadingSpinner />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="font-main bg-gray-50 min-h-screen">
        <Header />
        <main className="pt-20 pb-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-0">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error || '記事が見つかりません'}
            </div>
            <div className="mt-8">
              <Link href="/knowledge" className="text-blue-600 hover:underline text-sm">← 一覧に戻る</Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-main bg-gray-50 min-h-screen">
      <Header />
      <main className="pt-20 pb-20">
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 pt-8">
          <div className="flex flex-col-reverse lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">記事カテゴリー</h3>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.key}>
                      <Link
                        href={`/knowledge?category=${category.key}`}
                        className={`block w-full text-left px-3 py-2 rounded-md transition-colors duration-200 ${
                          article.category === category.label
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {category.label} <span className="text-gray-500">({category.count})</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link href="/knowledge" className="text-blue-600 hover:underline text-sm">← 一覧に戻る</Link>
                </div>
              </div>
            </aside>
            
            {/* Article Content */}
            <article className="lg:w-3/4 bg-white rounded-lg shadow-sm p-8">
              <div className="mb-6">
                <span className="inline-block text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full mr-2 align-middle">{article.category}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">{article.title}</h1>
              <div className="flex items-center gap-4 mb-8 text-sm text-gray-500">
                <span>{new Date(article.published_at).toLocaleDateString('ja-JP')}</span>
                <span>著者: {article.author}</span>
              </div>
              <div className="prose prose-blue max-w-none text-gray-900">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}