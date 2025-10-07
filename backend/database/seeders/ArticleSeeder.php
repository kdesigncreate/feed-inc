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
                'title' => '【Vol.1】思わず手が伸びる！店頭で“注目する”什器づくりのポイント',
                'slug' => 'store-promotion-trends',
                'content' =>
                    '<h2 style="font-size: 24px; font-weight: bold; margin-bottom: 1em;">●変化する店頭の中で、「伝わる」什器とは？</h2>' . "\n" .
                    '<p style="margin-bottom: 1rem;">店舗の棚に商品を並べただけでは、今や売れません。スマホ片手に購買判断を下す消費者が増える中、商品が自ら語りかけてくるような「訴求力」のある什器が求められます。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">什器は、単なる陳列棚ではなく、“商品の魅力を伝えるコミュニケーションツール”です。どれだけ魅力的な商品でも、その価値が伝わらなければ、手に取ってもらうことすらできません。では、どうすれば「伝わる什器」がつくれるのでしょうか？</p>' . "\n\n" .
                    '<h2 style="font-size: 24px; font-weight: bold; margin-bottom: 1em;">●成功事例に見る「伝わる什器」の共通点</h2>' . "\n" .
                    '<p style="margin-bottom: 1rem;">FEEDではこれまで、化粧品、家電、日用品、食品など多岐にわたるジャンルで店頭什器を企画・制作してきました。そこから導き出された、成功什器の共通点がこちらです。</p>' . "\n\n" .
                    '<h2 style="font-size: 18px; text-decoration: underline;">1. 商品の特長をひと目で伝える設計</h2>' . "\n" .
                    '<p style="margin-bottom: 1rem;">あるコスメブランドでは、アイテムごとに異なる特長を持つ商品群に対し、それぞれの魅力を明快に見せる什器を展開。ブランド世界観を崩すことなく、個々の商品のセールスポイントを訴求する構成が、売場での強いインパクトを生み出しました。</p>' . "\n\n" .
                    '<h2 style="font-size: 18px; text-decoration: underline;">2. 店頭の導線を踏まえた配置と高さ</h2>' . "\n" .
                    '<p style="margin-bottom: 1rem;">家電売場では、目立たせるだけでなく、通行動線や棚割のルールを理解した什器設計が鍵となりました。設置するロケーションを意識し、通りすがりでも視認できる高さと、商品へのアプローチ動線の最適化が、手に取られる率を大きく左右します。</p>' . "\n\n" .
                    '<h2 style="font-size: 18px; text-decoration: underline;">3. 記憶に残る“体験”の演出</h2>' . "\n" .
                    '<p style="margin-bottom: 1rem;">ショールームにおけるユニットバスの実演機では、素材の違いを実際に“触って”体感できるツールを制作。リアルな比較体験が、消費者の記憶に残る効果的な接点となり、指名買いの後押しに繋がりました。店舗販売における什器展開でも、“体験”訴求は、強い印象づけに繋がります。</p>' . "\n\n" .
                    '<h2 style="font-size: 24px; font-weight: bold; margin-bottom: 1em;">●什器単体で終わらない「拡張性」の設計もカギ</h2>' . "\n" .
                    '<p style="margin-bottom: 1rem;">優れた什器は、単品勝負ではなく、キャンペーンや動画、SNS施策など他メディアと連動して更に真価を発揮します。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">例えば照明器具のプロモーションでは、動画と什器を組み合わせて視覚と感覚に訴える売場を演出。またキャンペーン訴求であれば、SNSでシェアされるようなビジュアル設計と連動し、実売と話題性の両立を図るというやり方も考えられます。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">さらに、長期的に使用される什器では、パーツの差し替えや使い回しを前提とした「汎用性」も重要です。ブランドの成長や商品ラインナップの変化にも柔軟に対応できる設計力が、コスト効率とプロモーション効果の両立を実現します。</p>' . "\n\n" .
                    '<h2 style="font-size: 24px; font-weight: bold; margin-bottom: 1em;">●FEEDがつくる「売れる什器」は、ブランドの価値を可視化する</h2>' . "\n" .
                    '<p style="margin-bottom: 1rem;">FEEDでは、ブランドの深い理解を前提に、コンセプトメイクから設計、グラフィック、制作、物流までをワンストップで対応。店頭だけでなく、SNSや動画、キャンペーン施策との統合を見据えた“全体最適の発想”で、成果につながる什器をご提案します。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">「什器ひとつで、こんなに変わるのか」<br>そんな驚きと手応えを、ぜひ一度ご体感ください。</p>' . "\n\n" .
                    '<p style="margin-bottom: 1rem;">==========================================</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">◎お問い合わせやご相談は、下記までお気軽にご連絡ください。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">Tel : 03-3505-3005</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">Mail : contact@feed-inc.com</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">===========================================</p>',
                'excerpt' => '',
                'category' => '店頭販促',
                'is_published' => true,
                'published_at' => '2025-10-06 10:00:00',
            ],
            [
                'title' => '【Vol.2】応募したくなる！"選ばれる"キャンペーン設計の秘訣',
                'slug' => 'campaign-design-secrets',
                'content' =>
                    '<h2 style="font-size: 24px; font-weight: bold; margin-bottom: 1em;">●ありふれたキャンペーンでは、もう響かない</h2>' . "\n" .
                    '<p style="margin-bottom: 1rem;">「○○を買って当てよう！」<br>そんな言葉を見かけるのは当たり前。今や消費者は"キャンペーン慣れ"しており、少しでも面倒だったり魅力を感じなければ、応募には至りません。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">どんなに景品が豪華でも、「自分ゴト化」されなければ反応は薄い。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">では、今の時代に"選ばれるキャンペーン"とは、一体どんな設計なのでしょうか？</p>' . "\n\n" .
                    '<h2 style="font-size: 24px; font-weight: bold; margin-bottom: 1em;">●成果を出すキャンペーンには、3つの仕掛けがある</h2>' . "\n" .
                    '<p style="margin-bottom: 1rem;">FEEDが実施した数々の成功キャンペーンから見えてきたのは、「景品」「導線」「文脈」の3点を抑えた設計です。</p>' . "\n\n" .
                    '<h3 style="font-size: 18px; font-weight: bold; margin-bottom: 0.5em;">1. ターゲット視点で選ばれた景品</h3>' . "\n" .
                    '<p style="margin-bottom: 1rem;">たとえば、ある食品ブランドでは"共働き世帯"の生活習慣を分析し、実用的かつSNS映えする景品を提案。結果、前年比約2倍の応募を記録しました。</p>' . "\n\n" .
                    '<h3 style="font-size: 18px; font-weight: bold; margin-bottom: 0.5em;">2. 応募導線のシンプル化</h3>' . "\n" .
                    '<p style="margin-bottom: 1rem;">LINE・QRコード・WEBフォームなどを活用し、応募のハードルを下げることも重要です。特に、スマホで完結する導線設計が基本となります。</p>' . "\n\n" .
                    '<h3 style="font-size: 18px; font-weight: bold; margin-bottom: 0.5em;">3. 流通先や販売チャネルにあわせた柔軟なカスタマイズ</h3>' . "\n" .
                    '<p style="margin-bottom: 1rem;">チェーン別にPOPや内容を調整することで、営業ツールとしても高評価。社内外から「使いやすい」と支持されることも、成果につながる大切な要素です。</p>' . "\n\n" .
                    '<h2 style="font-size: 24px; font-weight: bold; margin-bottom: 1em;">●店頭×SNS×動画の"複合設計"が効いてくる</h2>' . "\n" .
                    '<p style="margin-bottom: 1rem;">成功しているキャンペーンは、単体で成立していません。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">FEEDでは、応募ツールと売場什器をセットで企画したり、動画やSNS投稿と連動させた展開で「購買→拡散→再拡大」という好循環を生み出しています。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">たとえば、あるペット関連商品のキャンペーンでは、SNS広告と応募導線を連動させ、若年層の認知拡大と新規獲得を実現。さらに、動画コンテンツや店頭什器によって接点を多層化することで、流通・消費者双方への訴求力を高めました。</p>' . "\n\n" .
                    '<h2 style="font-size: 24px; font-weight: bold; margin-bottom: 1em;">●選ばれるキャンペーンは、「仕組み」と「共感」でできている</h2>' . "\n" .
                    '<p style="margin-bottom: 1rem;">FEEDのキャンペーン企画は、単なる景品企画ではありません。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">「誰に、なぜ、どう届けるか？」「何を目的に、どんな結果を狙うのか」という戦略設計から始まり、ツールやクリエイティブに落とし込むまでをワンストップでサポートします。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">商品の課題にあわせて設計するため、景品プレゼントでなく「返金キャンペーン」といった手法の選択肢もご提案します。</p>' . "\n\n" .
                    '<p style="margin-bottom: 1rem;">実施後の効果分析や次回施策への活用まで見据えて、「成果が出るキャンペーン」を構築する。その積み重ねが、ブランドの信頼とファンをつくっていきます。</p>' . "\n\n" .
                    '<p style="margin-bottom: 1rem;">==========================================</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">◎お問い合わせやご相談は、下記までお気軽にご連絡ください。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">Tel : 03-3505-3005</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">Mail : contact@feed-inc.com</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">===========================================</p>',
                'excerpt' => '消費者が"キャンペーン慣れ"している今、選ばれるキャンペーン設計の秘訣をご紹介します。',
                'category' => 'キャンペーン',
                'is_published' => true,
                'published_at' => '2025-10-06 11:00:00',
            ],
            [
                'title' => '【Vol.3】案件は"段取り"で決まる！プロデューサー視点の現場力',
                'slug' => 'producer-project-management',
                'content' =>
                    '<h2 style="font-size: 24px; font-weight: bold; margin-bottom: 1em;">●「全部おまかせしたい」の背景にある期待とは？</h2>' . "\n" .
                    '<p style="margin-bottom: 1rem;">FEEDにはよく、こんなご相談が寄せられます。<br>「什器・動画・SNS・POPを全部まとめてお願いしたいんだけど…」</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">この言葉の裏には、"個別で調整するのが大変"という本音があります。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">さまざまな領域が絡む案件を、社内調整も含めてスムーズに進めたい——<br>そんなニーズに応えるには、「制作力」以上に、「段取り力」が求められます。</p>' . "\n\n" .
                    '<h2 style="font-size: 24px; font-weight: bold; margin-bottom: 1em;">●案件成功の裏には、プロデューサーの段取りがある</h2>' . "\n" .
                    '<p style="margin-bottom: 1rem;">FEEDの営業は、単なる窓口ではありません。企画・制作・納品までの全工程を指揮する"プロデューサー"として、次の3つの段取りを徹底しています。</p>' . "\n\n" .
                    '<h3 style="font-size: 18px; font-weight: bold; margin-bottom: 0.5em;">1. はじめのヒアリングで目的を可視化</h3>' . "\n" .
                    '<p style="margin-bottom: 1rem;">「何を達成したいか」「制約条件は何か」を明確にし、企画や制作前に"やるべきこと"を整理します。</p>' . "\n\n" .
                    '<h3 style="font-size: 18px; font-weight: bold; margin-bottom: 0.5em;">2. スケジュールと関係者の役割を見える化</h3>' . "\n" .
                    '<p style="margin-bottom: 1rem;">最適なチーム体制、全体スケジュール、制作段階でのポイントなどを把握し、社内のみならず社外パートナーとの連携も円滑にします。</p>' . "\n\n" .
                    '<h3 style="font-size: 18px; font-weight: bold; margin-bottom: 0.5em;">3. リスクと変化を想定した"余白設計"</h3>' . "\n" .
                    '<p style="margin-bottom: 1rem;">トラブルや急な修正にも対応できるよう、日程に柔軟性をもたせた進行を心掛けます。</p>' . "\n\n" .
                    '<h2 style="font-size: 24px; font-weight: bold; margin-bottom: 1em;">●段取りが変わると、成果の質が変わる</h2>' . "\n" .
                    '<p style="margin-bottom: 1rem;">段取り力があると、現場の制作チームは安心してベストパフォーマンスを発揮できます。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">結果として、</p>' . "\n" .
                    '<ul style="margin-bottom: 1rem;">' . "\n" .
                    '<li>デザインやクリエイティブの質が高くなる</li>' . "\n" .
                    '<li>トラブル時のリカバリーもスムーズ</li>' . "\n" .
                    '<li>社内確認・流通展開のスピードも上がる</li>' . "\n" .
                    '</ul>' . "\n" .
                    '<p style="margin-bottom: 1rem;">つまり、段取りはクオリティを最適化する重要な要素なのです。</p>' . "\n\n" .
                    '<h2 style="font-size: 24px; font-weight: bold; margin-bottom: 1em;">●FEEDの「頼られる力」は、段取りの強さにある</h2>' . "\n" .
                    '<p style="margin-bottom: 1rem;">FEEDが長期でパートナーとして選ばれている理由。それは、ただ「つくる」のではなく、「どうつくるか」まで見通して伴走できる点にあります。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">多領域をまとめるプロジェクトにこそ、FEEDのプロデューサーの存在が光ります。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">安心して任せられる人と、安心して任せられる段取り。<br>それが、FEEDの仕事のベースです。</p>' . "\n\n" .
                    '<p style="margin-bottom: 1rem;">==========================================</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">◎お問い合わせやご相談は、下記までお気軽にご連絡ください。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">Tel : 03-3505-3005</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">Mail : contact@feed-inc.com</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">===========================================</p>',
                'excerpt' => 'プロジェクトの成功は「段取り力」で決まる。FEEDのプロデューサーが実践する現場力をご紹介します。',
                'category' => '営業ツール',
                'is_published' => true,
                'published_at' => '2025-10-06 12:00:00',
            ],
            [
                'title' => '【Vol.4】"ブランドらしさ"を一目で伝えるビジュアル設計とは？',
                'slug' => 'visual-brand-design',
                'content' =>
                    '<h2 style="font-size: 24px; font-weight: bold; margin-bottom: 1em;">●そのデザイン、本当に「らしさ」が伝わっていますか？</h2>' . "\n" .
                    '<p style="margin-bottom: 1rem;">デザインは「見た目」だけの話ではありません。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">その奥には、「ブランドが何を大切にしているか」「誰にどんな印象を与えたいか」という"想い"が詰まっています。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">にもかかわらず、売場・SNS・WEB・POPそれぞれでバラバラな印象を与えてしまっていては、せっかくのブランド価値が十分に伝わりません。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">ビジュアルとは、"ブランドの人格"を一瞬で伝える設計図でもあるのです。</p>' . "\n\n" .
                    '<h2 style="font-size: 24px; font-weight: bold; margin-bottom: 1em;">●FEEDのビジュアル設計3つのポイント</h2>' . "\n" .
                    '<p style="margin-bottom: 1rem;">FEEDが手がけるビジュアル制作では、次の3つの観点から「ブランドらしさ」を設計します。</p>' . "\n\n" .
                    '<h3 style="font-size: 18px; font-weight: bold; margin-bottom: 0.5em;">1. トーン＆マナーの一貫性</h3>' . "\n" .
                    '<p style="margin-bottom: 1rem;">什器・パッケージ・動画・SNSまで、全てが同じ世界観でつながっていること。これにより、「このブランドっぽい」という印象を持ってもらえます。</p>' . "\n\n" .
                    '<h3 style="font-size: 18px; font-weight: bold; margin-bottom: 0.5em;">2. ターゲットに"刺さる"温度感</h3>' . "\n" .
                    '<p style="margin-bottom: 1rem;">たとえばベースメイク商材なら、「共感されやすい自然体の女性像」や「親近感のある色彩設計」など、言葉にならない感情に訴える要素を丁寧に作り込みます。</p>' . "\n\n" .
                    '<h3 style="font-size: 18px; font-weight: bold; margin-bottom: 0.5em;">3. 意図あるレイアウト・余白設計</h3>' . "\n" .
                    '<p style="margin-bottom: 1rem;">あえて余白を広くとる、あえて文字を絞る——視覚的な"間"にもブランドの品格や方向性が現れます。</p>' . "\n\n" .
                    '<h2 style="font-size: 24px; font-weight: bold; margin-bottom: 1em;">●売場もSNSも、「見た瞬間の印象」がすべてを決める</h2>' . "\n" .
                    '<p style="margin-bottom: 1rem;">とくにファーストインプレッションが重要な店頭では、「誰が見ても伝わる」「見て好きになる」ビジュアル設計が欠かせません。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">また、SNSやWEBにおいても、画像1枚で「ブランドを感じてもらえるか」が購買やシェアの動機に直結します。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">FEEDでは、単なるデザインにとどまらず、"ブランド体験の視覚化"としてのビジュアルづくりを意識しています。</p>' . "\n\n" .
                    '<h2 style="font-size: 24px; font-weight: bold; margin-bottom: 1em;">●ビジュアルを変えれば、ブランドがひとつ上のステージへ</h2>' . "\n" .
                    '<p style="margin-bottom: 1rem;">「最近、売場がいつも新鮮」<br>「ブランドイメージが整ってきた」</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">そんな声は、見た目だけでなく"全体設計"ができている証です。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">FEEDは、ブランドの「らしさ」を翻訳し、それを的確なビジュアルとして表現します。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">SNS、什器、動画、カタログ——　全てをつないで、ブランドの存在感を高めていく。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">その入口として、まずは「らしさ」の言語化と可視化を一緒に始めてみませんか？</p>' . "\n\n" .
                    '<p style="margin-bottom: 1rem;">==========================================</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">◎お問い合わせやご相談は、下記までお気軽にご連絡ください。</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">Tel : 03-3505-3005</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">Mail : contact@feed-inc.com</p>' . "\n" .
                    '<p style="margin-bottom: 1rem;">===========================================</p>',
                'excerpt' => 'ブランドの「らしさ」を一瞬で伝えるビジュアル設計の3つのポイントをご紹介します。',
                'category' => 'デザイン',
                'is_published' => true,
                'published_at' => '2025-10-06 13:00:00',
            ],
        ];

        foreach ($articles as $article) {
            Article::create($article);
        }
    }
}
