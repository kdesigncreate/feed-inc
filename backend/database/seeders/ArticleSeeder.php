<?php

namespace Database\Seeders;

use App\Models\Article;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $articles = [
            [
                'title' => '店頭什器のトレンドと効果的な活用事例',
                'slug' => 'store-promotion-trends',
                'content' => '<p>店頭什器は、商品の魅力を最大限に引き出し、顧客の購買意欲を高める重要な要素です。</p><p>効果的な什器設計には、以下のポイントが重要です：</p><ul><li>商品の特徴を活かしたデザイン</li><li>ターゲット顧客に響く色彩設計</li><li>導線を意識したレイアウト</li></ul>',
                'excerpt' => '店頭什器の効果的な活用方法について解説します。',
                'category' => '店頭販促',
                'tag' => 'promo/insights',
                'author' => '佐藤',
                'is_published' => true,
                'published_at' => '2024-03-08 10:00:00',
            ],
            [
                'title' => 'Instagramを活用した効果的なデジタルプロモーション戦略',
                'slug' => 'instagram-digital-promotion',
                'content' => '<p>Instagramは視覚的なコンテンツが中心のSNSプラットフォームとして、ブランドプロモーションに欠かせないツールです。</p><p>成功するInstagramプロモーションの要素：</p><ul><li>一貫したビジュアルブランディング</li><li>エンゲージメントを高めるコンテンツ</li><li>適切なハッシュタグの活用</li></ul>',
                'excerpt' => 'Instagramを使ったデジタルプロモーションの戦略を詳しく解説します。',
                'category' => 'デジタルプロモーション',
                'tag' => 'promo/insights',
                'author' => '鈴木',
                'is_published' => true,
                'published_at' => '2024-01-29 14:30:00',
            ],
            [
                'title' => '季節限定キャンペーンの企画から実施まで',
                'slug' => 'seasonal-campaigns',
                'content' => '<p>季節限定キャンペーンは、消費者の購買意欲を刺激し、売上向上に直結する効果的な手法です。</p><p>成功するキャンペーンの企画プロセス：</p><ol><li>ターゲット分析と市場調査</li><li>コンセプトの設定</li><li>実施計画の策定</li><li>効果測定と改善</li></ol>',
                'excerpt' => '季節限定キャンペーンの企画・実施ノウハウを公開します。',
                'category' => 'キャンペーン',
                'tag' => 'promo/insights',
                'author' => '田中',
                'is_published' => true,
                'published_at' => '2024-01-19 09:15:00',
            ],
            [
                'title' => 'ブランドイメージを強化するノベルティグッズの選び方',
                'slug' => 'novelty-selection',
                'content' => '<p>ノベルティグッズは、ブランド認知度向上と顧客との関係構築に重要な役割を果たします。</p><p>効果的なノベルティ選定のポイント：</p><ul><li>ターゲット層のライフスタイルに合致</li><li>ブランドメッセージの具現化</li><li>実用性とデザイン性の両立</li></ul>',
                'excerpt' => 'ブランドイメージ向上に効果的なノベルティグッズの選び方を解説します。',
                'category' => 'ノベルティ',
                'tag' => 'promo/insights',
                'author' => 'アヤノ',
                'is_published' => true,
                'published_at' => '2024-01-09 11:45:00',
            ],
            [
                'title' => '展示会で差をつける！ブースデザインとアテンド対応のコツ',
                'slug' => 'exhibition-booth-design',
                'content' => '<p>展示会は、多くの見込み客と直接接触できる貴重な機会です。限られた時間とスペースで最大の効果を上げるためには、戦略的な準備が必要です。</p><p>成功する展示会出展のポイント：</p><ul><li>目を引くブースデザイン</li><li>来場者とのエンゲージメント</li><li>フォローアップ体制の構築</li></ul>',
                'excerpt' => '展示会で注目を集めるブースデザインとアテンド対応について解説します。',
                'category' => 'イベント',
                'tag' => 'promo/insights',
                'author' => '山田',
                'is_published' => true,
                'published_at' => '2023-12-21 16:20:00',
            ],
            [
                'title' => '営業資料のデザイン改善で成約率が30%アップした事例',
                'slug' => 'sales-material-improvement',
                'content' => '<p>営業資料は、商談成功の鍵を握る重要なツールです。デザインの改善によって、大幅な成約率向上を実現した事例をご紹介します。</p><p>改善のポイント：</p><ol><li>情報の整理と視覚的な構成</li><li>顧客の課題に焦点を当てたストーリー</li><li>データの効果的な可視化</li></ol>',
                'excerpt' => '営業資料のデザイン改善による成約率向上の実例をお伝えします。',
                'category' => '営業ツール',
                'tag' => 'promo/insights',
                'author' => '加藤',
                'is_published' => true,
                'published_at' => '2023-12-15 13:10:00',
            ],
            [
                'title' => '商品パッケージのリニューアルで売上150%達成した事例分析',
                'slug' => 'package-renewal-case',
                'content' => '<p>商品パッケージは、消費者の購買決定に大きな影響を与える要素です。デザインリニューアルによって売上が150%向上した事例を詳しく分析します。</p><p>成功要因：</p><ul><li>ターゲット顧客の深い理解</li><li>競合他社との差別化戦略</li><li>店頭での視認性向上</li></ul>',
                'excerpt' => 'パッケージリニューアルによる売上向上の成功事例を分析します。',
                'category' => 'デザイン',
                'tag' => 'promo/insights',
                'author' => '佐藤',
                'is_published' => true,
                'published_at' => '2023-11-30 10:30:00',
            ],
            [
                'title' => 'SNSキャンペーンの運用とコミュニティマネジメントの実践手法',
                'slug' => 'sns-campaign-management',
                'content' => '<p>SNSキャンペーンは、ブランド認知度向上と顧客エンゲージメントの強化に効果的です。成功するキャンペーン運用のノウハウを詳しく解説します。</p><p>実践的な運用手法：</p><ul><li>コミュニティの育成と管理</li><li>ユーザー生成コンテンツの活用</li><li>リアルタイム対応の重要性</li></ul>',
                'excerpt' => 'SNSキャンペーンの効果的な運用とコミュニティマネジメントの手法を解説します。',
                'category' => 'デジタルプロモーション',
                'tag' => 'promo/insights',
                'author' => '鈴木',
                'is_published' => true,
                'published_at' => '2023-11-10 15:45:00',
            ],
        ];

        foreach ($articles as $article) {
            Article::create($article);
        }
    }
}
