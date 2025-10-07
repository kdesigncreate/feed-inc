'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { articleApi } from '@/lib/api';
import type { ArticleFormData } from '@/types';
import { articleErrorHandler } from '@/lib/errorHandler';
import { SERVICE_CATEGORIES } from '@/lib/constants';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AdminRoute } from '@/components/AdminRoute';
import { ImageUpload } from '@/components/ImageUpload';
import Link from 'next/link';
import DOMPurify from 'dompurify';

export default function NewArticlePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tag: 'promo/insights',
    author: '',
    featured_image: null,
    is_published: false,
    published_at: '',
  });
  const [fieldErrors, setFieldErrors] = useState<{
    title: string[];
    content: string[];
    excerpt: string[];
    category: string[];
    tag: string[];
    author: string[];
    featured_image: string[];
  }>({
    title: [],
    content: [],
    excerpt: [],
    category: [],
    tag: [],
    author: [],
    featured_image: [],
  });
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        author: user.name
      }));
    }
  }, [user]);

  const validateForm = useCallback(() => {
    const errors: {
      title: string[];
      content: string[];
      excerpt: string[];
      category: string[];
      tag: string[];
      author: string[];
      featured_image: string[];
    } = {
      title: [],
      content: [],
      excerpt: [],
      category: [],
      tag: [],
      author: [],
      featured_image: [],
    };

    // Basic validation
    if (!formData.title.trim()) errors.title.push('タイトルは必須です');
    if (!formData.content.trim()) errors.content.push('本文は必須です');
    if (!formData.category.trim()) errors.category.push('カテゴリーは必須です');
    if (!formData.author.trim()) errors.author.push('著者は必須です');

    setFieldErrors(errors);

    return !Object.values(errors).some(errorList => errorList.length > 0);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Sanitize form data before sending
      const sanitizedData = {
        ...formData,
        title: formData.title.trim(),
        content: formData.content, // Content will be sanitized by backend
        excerpt: formData.excerpt.trim(),
        author: formData.author.trim(),
        tag: formData.tag.trim(),
        featured_image: formData.featured_image ? formData.featured_image.trim() : null,
      };

      await articleApi.createArticle(sanitizedData);
      router.push('/admin/articles');
    } catch (err: unknown) {
      setError(articleErrorHandler.create(err));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Clear field errors when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]?.length > 0) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: []
      }));
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      featured_image: imageUrl
    }));
  };

  const handleImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      featured_image: null
    }));
  };

  const renderPreview = () => {
    if (!formData.content.trim()) {
      return (
        <div className="text-gray-500 italic p-4">
          本文を入力するとプレビューが表示されます
        </div>
      );
    }
    
    const sanitizedHtml = DOMPurify.sanitize(formData.content);
    
    return (
      <div className="prose max-w-none p-4 prose-headings:text-gray-900 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-700 prose-strong:text-gray-900 prose-em:text-gray-600 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-a:text-blue-600 prose-a:underline" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
    );
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin/articles" className="text-blue-600 hover:text-blue-800 mr-4">
                ← 記事一覧
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                新規記事作成
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  タイトル *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                    fieldErrors.title.length > 0 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {fieldErrors.title.length > 0 && (
                  <div className="mt-1">
                    {fieldErrors.title.map((error, index) => (
                      <p key={index} className="text-sm text-red-600">{error}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    カテゴリー *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                      fieldErrors.category.length > 0 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  >
                    <option value="">カテゴリーを選択</option>
                    {SERVICE_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {fieldErrors.category.length > 0 && (
                    <div className="mt-1">
                      {fieldErrors.category.map((error, index) => (
                        <p key={index} className="text-sm text-red-600">{error}</p>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                    著者 *
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                      fieldErrors.author.length > 0 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  {fieldErrors.author.length > 0 && (
                    <div className="mt-1">
                      {fieldErrors.author.map((error, index) => (
                        <p key={index} className="text-sm text-red-600">{error}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                  概要
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                    fieldErrors.excerpt.length > 0 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="記事の概要を入力してください"
                />
                {fieldErrors.excerpt.length > 0 && (
                  <div className="mt-1">
                    {fieldErrors.excerpt.map((error, index) => (
                      <p key={index} className="text-sm text-red-600">{error}</p>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    本文 *
                  </label>
                  <div className="flex bg-gray-100 rounded-md p-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab('edit')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        activeTab === 'edit'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      編集
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('preview')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        activeTab === 'preview'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      プレビュー
                    </button>
                  </div>
                </div>
                
                <div className={`border rounded-md min-h-[500px] ${
                  fieldErrors.content.length > 0 ? 'border-red-300' : 'border-gray-300'
                }`}>
                  {activeTab === 'edit' ? (
                    <>
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
                        <p className="text-sm text-gray-600 font-medium">HTML記法の使い方:</p>
                        <div className="text-xs text-gray-500 mt-1 space-y-1">
                          <div>&lt;strong&gt;太字&lt;/strong&gt; → <strong>太字</strong></div>
                          <div>&lt;em&gt;斜体&lt;/em&gt; → <em>斜体</em></div>
                          <div>&lt;h1&gt;見出し1&lt;/h1&gt; → 大見出し</div>
                          <div>&lt;h2&gt;見出し2&lt;/h2&gt; → 中見出し</div>
                          <div>&lt;h3&gt;見出し3&lt;/h3&gt; → 小見出し</div>
                          <div>&lt;ul&gt;&lt;li&gt;リスト項目&lt;/li&gt;&lt;/ul&gt; → • リスト項目</div>
                          <div>&lt;ol&gt;&lt;li&gt;番号付きリスト&lt;/li&gt;&lt;/ol&gt; → 1. 番号付きリスト</div>
                          <div>&lt;a href="URL"&gt;リンクテキスト&lt;/a&gt; → リンク</div>
                          <div>&lt;p&gt;段落&lt;/p&gt; → 段落分け</div>
                        </div>
                      </div>
                      <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        rows={20}
                        className={`w-full px-3 py-2 focus:outline-none focus:ring-2 border-0 resize-none ${
                          fieldErrors.content.length > 0 ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                        }`}
                        placeholder="記事の本文をHTML記法で入力してください&#10;&#10;例: &#10;&lt;h1&gt;効果的なプロモーション戦略の作り方&lt;/h1&gt;&#10;&#10;&lt;p&gt;今回は、商品の魅力を&lt;strong&gt;最大限に引き出す&lt;/strong&gt;プロモーション戦略についてご紹介します。&lt;/p&gt;&#10;&#10;&lt;h2&gt;ターゲット設定のポイント&lt;/h2&gt;&#10;&#10;&lt;p&gt;効果的なプロモーションには、まず&lt;em&gt;明確なターゲット設定&lt;/em&gt;が重要です。&lt;/p&gt;&#10;&#10;&lt;h3&gt;年齢層の分析&lt;/h3&gt;&#10;&lt;ul&gt;&#10;&lt;li&gt;20代：デジタル重視のアプローチ&lt;/li&gt;&#10;&lt;li&gt;30代：実用性を重視した訴求&lt;/li&gt;&#10;&lt;li&gt;40代以上：信頼性と安心感を重視&lt;/li&gt;&#10;&lt;/ul&gt;&#10;&#10;&lt;h2&gt;実施手順&lt;/h2&gt;&#10;&#10;&lt;ol&gt;&#10;&lt;li&gt;&lt;strong&gt;市場調査&lt;/strong&gt;の実施&lt;/li&gt;&#10;&lt;li&gt;&lt;strong&gt;ターゲット&lt;/strong&gt;の明確化&lt;/li&gt;&#10;&lt;li&gt;&lt;strong&gt;メッセージ&lt;/strong&gt;の策定&lt;/li&gt;&#10;&lt;li&gt;&lt;strong&gt;媒体選択&lt;/strong&gt;と実行&lt;/li&gt;&#10;&lt;li&gt;&lt;strong&gt;効果測定&lt;/strong&gt;と改善&lt;/li&gt;&#10;&lt;/ol&gt;&#10;&#10;&lt;p&gt;詳しい事例については&lt;a href=&quot;https://www.feed-inc.com/cases&quot;&gt;こちらの記事&lt;/a&gt;もご参考ください。&lt;/p&gt;&#10;&#10;&lt;hr&gt;&#10;&#10;&lt;p&gt;&lt;em&gt;この記事がお役に立ちましたら、ぜひシェアしてください。&lt;/em&gt;&lt;/p&gt;"
                      />
                    </>
                  ) : (
                    <div className="h-full min-h-[480px] overflow-y-auto">
                      {renderPreview()}
                    </div>
                  )}
                </div>
                {fieldErrors.content.length > 0 && (
                  <div className="mt-1">
                    {fieldErrors.content.map((error, index) => (
                      <p key={index} className="text-sm text-red-600">{error}</p>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <ImageUpload
                  currentImage={formData.featured_image}
                  onImageUpload={handleImageUpload}
                  onImageRemove={handleImageRemove}
                  label="サムネイル画像"
                  isRequired={false}
                />
              </div>

              <div>
                <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-2">
                  タグ
                </label>
                <input
                  type="text"
                  id="tag"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                    fieldErrors.tag.length > 0 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="例: promo/insights, design/tips"
                />
                {fieldErrors.tag.length > 0 && (
                  <div className="mt-1">
                    {fieldErrors.tag.map((error, index) => (
                      <p key={index} className="text-sm text-red-600">{error}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-3">公開設定</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_published"
                      checked={formData.is_published}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 font-medium">
                      {formData.is_published ? '公開する' : '下書きとして保存'}
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 ml-6">
                    {formData.is_published 
                      ? '記事を公開して、ウェブサイトで表示します' 
                      : '記事を下書きとして保存し、後で公開することができます'
                    }
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Link
                  href="/admin/articles"
                  className="px-4 py-2 border border-gray-500 rounded-md text-sm font-medium text-gray-500 bg-transparent hover:bg-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  キャンセル
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-500 bg-transparent hover:bg-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <LoadingSpinner /> : '作成'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
      </div>
    </AdminRoute>
  );
}