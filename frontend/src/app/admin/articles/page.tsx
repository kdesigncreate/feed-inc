'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { articleApi } from '@/lib/api';
import type { Article } from '@/types';
import { articleErrorHandler } from '@/lib/errorHandler';
import { AdminRoute } from '@/components/AdminRoute';
import Link from 'next/link';

export default function AdminArticlesPage() {
  //AdminArticlesPageは記事一覧ページのコンポーネント。
  const { user } = useAuth();
  //useAuthは認証情報を取得するためのカスタムフック。
  const [articles, setArticles] = useState<Article[]>([]);
  //articlesは記事を表す。
  const [error, setError] = useState<string | null>(null);
  //errorはエラーを表す。
  const [search, setSearch] = useState('');
  //searchは検索を表す。
  const [categoryFilter] = useState('all');
  //categoryFilterはカテゴリーを表す。
  const [publishedFilter, setPublishedFilter] = useState<boolean | undefined>(undefined);
  //publishedFilterは公開状態を表す。

  const fetchArticles = useCallback(async () => {
    //fetchArticlesは記事を取得するための関数。
    //usecallbackは記事を取得するための関数をキャッシュするためのメソッド。
    try {
      const params: Record<string, string | boolean> = {};
      //paramsはパラメータを表す。
      //Record<string, string | boolean>はパラメータを表す。
      if (search) params.search = search;
      //searchがtrueの場合はparams.search = searchにする。
      if (categoryFilter !== 'all') params.category = categoryFilter;
      //categoryFilterがallではない場合はparams.category = categoryFilterにする。
      if (publishedFilter !== undefined) params.published = publishedFilter;
      //publishedFilterがundefinedではない場合はparams.published = publishedFilterにする。

      const response = await articleApi.getAdminArticles(params);
      //articleApi.getAdminArticles(params)は記事を取得するためのAPI。
      setArticles(response.data || []);
      //setArticlesは記事を表す。
      //response.dataがundefinedの場合は[]を返す。
    } catch (err: unknown) {
      //catchはエラーを捕捉するためのメソッド。
      setError(articleErrorHandler.fetch(err));
      //setErrorはエラーを表す。
      //articleErrorHandler.fetch(err)はエラーを取得するためのメソッド。
      //fetchはフェッチを表す。
    }
  }, [search, categoryFilter, publishedFilter]);
  //[search, categoryFilter, publishedFilter]は依存配列。
  //依存配列は記事を取得するための関数を実行するための依存配列。

  useEffect(() => {
    //useEffectは記事を取得するための関数を実行するためのメソッド。
    if (user) {
      //userが存在する場合は記事を取得する。
      fetchArticles();
      //fetchArticlesは記事を取得するための関数。
    }
  }, [user, fetchArticles]);
  //[user, fetchArticles]は依存配列。
  //依存配列は記事を取得するための関数を実行するための依存配列。

  const handleDelete = async (id: number) => {
    //handleDeleteは記事を削除するための関数。
    //idは記事のIDを表す。
    if (!confirm('この記事を削除しますか？')) return;
    //confirm('この記事を削除しますか？')がfalseの場合はreturnする。

    try {
      await articleApi.deleteArticle(id);
      //articleApi.deleteArticle(id)は記事を削除するためのAPI。
      await fetchArticles();
      //fetchArticlesは記事を取得するための関数。
    } catch (err: unknown) {
      setError(articleErrorHandler.delete(err));
      //setErrorはエラーを表す。
      //articleErrorHandler.delete(err)はエラーを取得するためのメソッド。
      //deleteは削除を表す。
    }
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800 mr-4">
                ← ダッシュボード
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                記事管理
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/articles/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                新規記事作成
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* フィルター */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  検索
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="タイトルまたは内容で検索"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  公開状態
                </label>
                <select
                  value={publishedFilter === undefined ? 'all' : publishedFilter.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPublishedFilter(value === 'all' ? undefined : value === 'true');
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">すべて</option>
                  <option value="true">公開済み</option>
                  <option value="false">下書き</option>
                </select>
              </div>
            </div>
          </div>

          {/* 記事一覧 */}
          <div className="bg-white shadow rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      タイトル
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      カテゴリー
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      著者
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      公開状態
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      公開日
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.map((article) => (
                    <tr key={article.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {article.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {article.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          article.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {article.is_published ? '公開済み' : '下書き'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(article.published_at).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          編集
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          削除
                        </button>
                        {article.is_published && (
                          <Link
                            href={`/knowledge/${article.slug}`}
                            target="_blank"
                            className="text-green-600 hover:text-green-900"
                          >
                            表示
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {articles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">記事がありません</p>
              </div>
            )}
          </div>
        </div>
      </main>
      </div>
    </AdminRoute>
  );
}