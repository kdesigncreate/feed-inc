'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { articleApi } from '@/lib/api';
import type { Article } from '@/types';
import { isValidImageUrl } from '@/lib/imageUtils';

interface RelatedArticlesProps {
  currentArticleId: number;
  currentCategory?: string;
  maxArticles?: number;
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  currentArticleId,
  currentCategory,
  maxArticles = 3
}) => {
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        setLoading(true);
        const response = await articleApi.getArticles({ published_only: true });
        const allArticles = Array.isArray(response) ? response : (response.data || []);
        
        // Filter out current article and prioritize same category
        const filtered = allArticles
          .filter((article: Article) => article.id !== currentArticleId)
          .sort((a: Article, b: Article) => {
            // Prioritize articles in the same category
            if (currentCategory) {
              if (a.category === currentCategory && b.category !== currentCategory) return -1;
              if (b.category === currentCategory && a.category !== currentCategory) return 1;
            }
            // Then sort by date (newest first)
            return new Date(b.published_at || b.created_at).getTime() - 
                   new Date(a.published_at || a.created_at).getTime();
          })
          .slice(0, maxArticles);

        setRelatedArticles(filtered);
      } catch (error) {
        console.error('Failed to fetch related articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedArticles();
  }, [currentArticleId, currentCategory, maxArticles]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '.');
  };

  if (loading) {
    return (
      <section className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">関連記事</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(maxArticles).fill(0).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 h-32 rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-3 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6">関連記事</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedArticles.map((article) => (
          <article key={article.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
            {isValidImageUrl(article.featured_image) && (
              <div className="relative w-full h-32">
                <Image
                  src={article.featured_image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="p-4">
              {article.category && (
                <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full mb-2">
                  {article.category}
                </span>
              )}
              <h4 className="text-sm font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
                <Link 
                  href={`/knowledge/${article.slug}`} 
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  {article.title}
                </Link>
              </h4>
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <span>{formatDate(article.published_at || article.created_at)}</span>
                {article.author && (
                  <>
                    <span className="mx-1">•</span>
                    <span>{article.author}</span>
                  </>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link 
          href="/knowledge" 
          className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
        >
          すべての記事を見る
          <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
};