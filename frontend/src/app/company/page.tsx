'use client';

import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { SkipLink } from '@/components/SkipLink';
// import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Footer } from '@/components/Footer';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
// import { companyMetadata } from '@/lib/metadata';

// export const metadata = companyMetadata;

export default function Company() {
  usePerformanceOptimization();
  
  return (
    <div className="font-main">
        <SkipLink />
        <Header />
        
        <main id="main-content" className="pt-20">
            <section id="kv" className="relative w-full">
                <picture className="block w-full">
                    <source media="(min-width: 768px)" srcSet="/image/company/PC_banner_company.jpg" />
                    <source media="(max-width: 767px)" srcSet="/image/company/SP_banner_company.jpg" />
                    <Image
                    src="/image/company/PC_banner_company.jpg"
                    alt="CompanyKv"
                    width={1200}
                    height={400}
                    className="w-full h-auto"
                    priority
                    sizes="100vw"
                    />
                </picture>
            </section>

            <section id="companyphilosophy" className="px-4 py-16 sm:px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 text-center">
                    <h2 className="w-full max-w-lg mx-auto mb-8">
                        <Image
                        src="/image/company/company_philosophy.png"
                        alt="CompanyPhilosophy"
                        width={500}
                        height={100}
                        className="w-full"
                        />
                    </h2>
                    </div>
                    
                    <div className="max-w-4xl mx-auto mb-16 text-center">
                        <div>
                            <p className="mb-6 text-lg leading-relaxed text-gray-700">
                                私たちフィードは、日常における<wbr />「気づき」を大切にしています。<br />
                                小さな気づきが、大きな価値や新しい発見につながることを<wbr />知っているからです。
                            </p>
                            <p className="mb-6 text-lg leading-relaxed text-gray-700">
                                商品やサービスに対する気づきを、<wbr />プランニングやデザインで磨き上げることで、<br />
                                生活者の快適な暮らしや企業の発展に<wbr />つながるサポートをいたします。
                            </p>
                            <p className="text-lg leading-relaxed text-gray-700">
                                スタッフ一人ひとりの気づきの力を活かし、<wbr />企業のビジネス活動の支援を通して、<br />
                                豊かな社会の成長に貢献できるように、<wbr />日々取り組んでいます。
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-12 items-center lg:flex-row">
                    <div className="lg:w-1/2">
                        <div className="overflow-hidden bg-white rounded-2xl shadow-lg">
                            <Image
                            src="/image/company/company_feed_sign.jpg"
                            alt="CompanyFeedSign"
                            width={600}
                            height={400}
                            className="w-full h-auto"
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                    <div className="lg:w-1/2">
                        <div className="p-6 rounded-2xl">
                            <p className="mb-4 text-xl font-bold text-gray-800">
                            〈社名「フィード」<wbr />について〉
                            </p>
                            <p className="text-lg leading-relaxed text-left text-gray-700">
                            社名である「フィード」とは、サッカー用語で「味方にいいパスを送る」という意味に由来しています。
                            「気づき」を活かした提案で、クライアントや生活者へ、いいパス（メリットのあるコト、モノ）を送り続けます。
                            </p>
                        </div>
                    </div>
                    </div>
                </div>
            </section>

            <section id="companyoverview" className="px-4 py-16 bg-gray-50 sm:px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 text-center">
                        <Image
                            src="/image/company/company_companyoverview.png"
                            alt="CompanyOverview"
                            width={500}
                            height={100}
                            className="w-full max-w-lg mx-auto mb-6"
                        />
                    </div>
                    
                    <div className="mb-12">
                        <p className="mb-8 text-xl font-bold text-left text-gray-800">
                            ［株式会社フィード］
                        </p>
                        
                        <dl className="space-y-4">
                          {/* 設立 */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center p-4">
                            <dt className="w-full sm:w-40 font-semibold text-gray-700 text-base mb-1 sm:mb-0">設立</dt>
                            <dd className="flex-1 text-gray-900 text-base">1990年10月</dd>
                          </div>
                          {/* 所在地 */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center p-4">
                            <dt className="w-full sm:w-40 font-semibold text-gray-700 text-base mb-1 sm:mb-0">所在地</dt>
                            <dd className="flex-1 text-gray-900 text-base">〒106-0032　<wbr />東京都港区六本木4-1-1 <wbr />第二黒崎ビル2F</dd>
                          </div>
                          {/* 電話番号 */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center p-4">
                            <dt className="w-full sm:w-40 font-semibold text-gray-700 text-base mb-1 sm:mb-0">電話番号</dt>
                            <dd className="flex-1 text-gray-900 text-base">03-3505-3005</dd>
                          </div>
                          {/* 代表者 */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center p-4">
                            <dt className="w-full sm:w-40 font-semibold text-gray-700 text-base mb-1 sm:mb-0">代表者</dt>
                            <dd className="flex-1 text-gray-900 text-base">代表取締役社長　黒田　毅</dd>
                          </div>
                          {/* 資本金 */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center p-4">
                            <dt className="w-full sm:w-40 font-semibold text-gray-700 text-base mb-1 sm:mb-0">資本金</dt>
                            <dd className="flex-1 text-gray-900 text-base">1,000万円</dd>
                          </div>
                          {/* 事業内容 */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center p-4">
                            <dt className="w-full sm:w-40 font-semibold text-gray-700 text-base mb-1 sm:mb-0">事業内容</dt>
                            <dd className="flex-1 text-gray-900 text-base">リアル×デジタルによる、<wbr />商品のプロモーション企画やPR ・ <wbr />ブランディング支援</dd>
                          </div>
                          {/* 顧客業種 */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center p-4">
                            <dt className="w-full sm:w-40 font-semibold text-gray-700 text-base mb-1 sm:mb-0">顧客業種</dt>
                            <dd className="flex-1 text-gray-900 text-base">日用雑貨、化粧品、食品、<wbr />住宅設備、家電、玩具、<wbr />スポーツなど各種</dd>
                          </div>
                          {/* 加盟団体 */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center p-4">
                            <dt className="w-full sm:w-40 font-semibold text-gray-700 text-base mb-1 sm:mb-0">加盟団体</dt>
                            <dd className="flex-1 text-gray-900 text-base">日本プロモーショナル・<wbr />マーケティング協会、<wbr />日本パッケージデザイン協会</dd>
                          </div>
                          {/* 持株会社 */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center p-4">
                            <dt className="w-full sm:w-40 font-semibold text-gray-700 text-base mb-1 sm:mb-0">持株会社</dt>
                            <dd className="flex-1 text-gray-900 text-base">株式会社フィード<wbr />コミュニケーショングループ</dd>
                          </div>
                          {/* グループ会社 */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center p-4">
                            <dt className="w-full sm:w-40 font-semibold text-gray-700 text-base mb-1 sm:mb-0">グループ会社</dt>
                            <dd className="flex-1 text-gray-900 text-base">株式会社タクト<wbr />（Webデザイン制作・システム開発）、<wbr />株式会社TRYANGLE<wbr />（EC事業支援サービス）</dd>
                          </div>
                        </dl>
                    </div>
                    
                    <div className="text-left mt-12">
                        <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center border border-gray-100">
                            <p className="text-xl font-bold text-gray-800 mb-6 text-center">〈主要お取引様〉</p>
                            <div className="w-full flex justify-center items-center">
                                <Image
                                    src="/image/company/client_logo_2409.jpg"
                                    alt="clientlogo"
                                    width={800}
                                    height={400}
                                    className="w-full h-auto max-w-3xl object-contain"
                                    loading="lazy"
                                    sizes="(max-width: 768px) 100vw, 800px"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="companyaccess" className="py-16 px-4 sm:px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                    <h2 className="w-full max-w-lg mx-auto">
                        <Image
                        src="/image/company/company_access.png"
                        alt="CompanyAccess"
                        width={500}
                        height={100}
                        className="w-full"
                        />
                    </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div className="text-left">
                        <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">所在地</h3>
                        <p className="text-gray-700 leading-relaxed mb-2">
                            〒106-0032<br />
                            東京都港区六本木4-1-1 第二黒崎ビル2F
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            TEL: 03-3505-3005<br />
                            FAX: 03-3505-3004
                        </p>
                        </div>
                        
                        <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">アクセス</h3>
                        <ul className="text-gray-700 leading-relaxed space-y-2">
                            <li>• 東京メトロ日比谷線・都営大江戸線「六本木駅」6番出口より徒歩1分</li>
                            <li>• 東京メトロ南北線「六本木一丁目駅」1番出口より徒歩5分</li>
                            <li>• 東京メトロ銀座線・南北線「溜池山王駅」13番出口より徒歩8分</li>
                        </ul>
                        </div>
                        
                        <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">営業時間</h3>
                        <p className="text-gray-700 leading-relaxed">
                            平日 9:00〜18:00<br />
                            （土日祝日休業）
                        </p>
                        </div>
                    </div>
                    
                    <div className="w-full">
                        <div className="bg-white rounded-lg overflow-hidden" style={{ height: '400px' }}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d405.1827797827953!2d139.7362829421932!3d35.665618732733414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b8343fe1913%3A0xdc270ec5cfba14df!2z44CSMTA2LTAwMzIg5p2x5Lqs6YO95riv5Yy65YWt5pys5pyo77yU5LiB55uu77yR4oiS77yRIOm7kuW0juesrO-8kuODk-ODqw!5e0!3m2!1sja!2sjp!4v1754982539219!5m2!1sja!2sjp"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="株式会社フィード所在地"
                        />
                        </div>
                    </div>
                    </div>
                </div>
            </section>

            <section id="companymessage" className="py-16 px-4 sm:px-6 lg:px-12 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="w-full max-w-lg mx-auto">
                            <Image
                            src="/image/company/company_message.png"
                            alt="CompanyMessage"
                            width={500}
                            height={100}
                            className="w-full"
                            />
                        </h2>
                    </div>
                    
                    <div className="max-w-5xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg">
                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <p className="text-base text-lg">
                                私たちフィードは、クライアント様の商品やサービスの課題解決と価値の向上・育成を、
                                プランニングとデザインでサポートする企画制作会社です。
                            </p>
                            <p className="text-base text-lg">
                                元々は広告代理店出身のプランナーによって、店頭SPを中心とした
                                商品の新発売のキャンペーン企画やPR、パッケージデザインなどを支援する
                                会社として始まったのが当社の成り立ちです。<wbr />
                                マーケティング戦略からご提案するスタイルが当時のSP会社としては珍しく、
                                それは現在も、フィードの特徴のひとつとして受け継がれており、
                                常にブランドの本質を考えた提案を心がけています。
                            </p>
                            <p className="text-base text-lg">
                                例えば、売場デザインやディスプレイ什器の設計においても、
                                ブランド自体の戦略性も踏まえたデザイン思考で、その場で購入に直結する
                                SP機能だけでなく、ブランド自体の世界観まで体現できる表現を意識しています。<wbr />
                                それが既存のクライアント様に評価いただいている理由のひとつです。
                            </p>
                            <p className="text-base text-lg">
                                また、プロモーションの領域だけではなく、新しいサービスや事業の立ち上げと
                                いったビジネスの開発フェーズでも、これまでのノウハウを活かしご支援しています。<wbr />
                                時代の変化に合わせ獲得してきた経験と実績により、長く強みである店頭SP領域やブランディングといった商品や
                                ビジネスの事業サポートまで行えることが、他のSP会社や広告会社とは違う、フィードの特徴です。
                            </p>
                            <p className="text-base text-lg">
                                クライアント様へのご支援を通じ、価値ある商品やサービスを世の中に届けて、
                                生活者ひいては社会全体の豊かさにつながるサポートを行っていきます。<wbr />
                                変化する社会に頼れる企画制作会社として、是非フィードにご期待ください。
                            </p>
                            <div className="pt-6 border-t border-gray-200">
                                <p className="text-right text-gray-800 font-medium">
                                    代表取締役社長　黒田　毅
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </main>
        
        <Footer />
    </div>
  );
}