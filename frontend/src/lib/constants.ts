export const COMPANY_INFO = {
    name: '株式会社フィード',
    nameEn: 'FEED inc.',
    established: '1990年10月',
    address: '〒106-0032 東京都港区六本木4-1-1 第二黒崎ビル2F',
    phone: '03-3505-3005',
    fax: '03-3505-3004',
    president: '代表取締役社長　黒田　毅',
    capital: '1,000万円',
    business: 'リアル×デジタルによる、商品のプロモーション企画やPR・ブランディング支援',
    industries: '日用雑貨、化粧品、食品、住宅設備、家電、玩具、スポーツなど各種',
    affiliations: '日本プロモーショナル・マーケティング協会、日本パッケージデザイン協会',
    parentCompany: '株式会社フィードコミュニケーショングループ',
    subsidiaries: '株式会社タクト（Webデザイン制作・システム開発）、株式会社TRYANGLE（EC事業支援サービス）',
    email: 'contact@feed-inc.com',
    businessHours: '平日 9:00〜18:00（土日祝日休業）',
    website: 'https://www.feed-inc.com'
  } as const;
  
  export const NAVIGATION_ITEMS = [
    { href: '/company', label: 'Company' },
    { href: '/services', label: 'Services' },
    { href: '/cases', label: 'Cases' },
    { href: '/knowledge', label: 'Knowledge' },
    { href: 'mailto:contact@feed-inc.com', label: 'Contact', external: true }
  ] as const;
  
  export const SERVICE_CATEGORIES = [
    '店頭販促',
    'デザイン',
    'キャンペーン',
    'イベント',
    'デジタルプロモーション',
    '営業ツール',
    'ノベルティ'
  ] as const;
  
  export const KNOWLEDGE_CATEGORIES = [
    { key: 'all', label: 'すべて', count: 8 },
    { key: 'store', label: '店頭販促', count: 1 },
    { key: 'design', label: 'デザイン', count: 1 },
    { key: 'campaign', label: 'キャンペーン', count: 1 },
    { key: 'event', label: 'イベント', count: 1 },
    { key: 'digital', label: 'デジタルプロモーション', count: 2 },
    { key: 'sales', label: '営業ツール', count: 1 },
    { key: 'novelty', label: 'ノベルティ', count: 1 }
  ] as const;
  
export const CASE_FILTERS = [
    { key: 'all', label: 'すべて' },
    { key: 'store-promotion', label: '店頭販促' },
    { key: 'design', label: 'デザイン' },
    { key: 'campaign', label: 'キャンペーン' },
    { key: 'event', label: 'イベント' },
    { key: 'digitalPromotion', label: 'デジタルプロモーション' },
    { key: 'salesTool', label: '営業ツール' },
    { key: 'novelty', label: 'ノベルティ' }
  ] as const;
  
  export const GOOGLE_TAG_MANAGER_ID = 'GTM-5NVRMGLH' as const;

// API設定
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://www.feed-inc.com/api' 
    : 'http://localhost:8000/api',
  TIMEOUT: 10000,
} as const;

// UIサイズ・タイミング定数
export const UI_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  CAROUSEL_DELAY: 2000,
  PREVIEW_MIN_HEIGHT: 500,
} as const;

// パス・URL定数
export const PATHS = {
  IMAGES: {
    LOGO: '/image/logo_feed.png',
    LOGO_WHITE: '/image/logo_feed_white.png',
    CLIENT_LOGOS: '/image/client_logo_01.png',
  },
  PDFS: {
    COMPANY_PROFILE: '/assets/pdf/feedHP_CompanyProfile_TOP.pdf',
  },
  VIDEOS: {
    TOP_MOVIE: '/image/feed_wev_top_movie_SS_20240903.mp4',
    TOP_MOVIE_SP: '/image/feed_SP_top_movie_480_20240903_SS.mp4',
  },
} as const;

// エラーメッセージ
export const ERROR_MESSAGES = {
  LOGIN_FAILED: 'ログインに失敗しました',
  ARTICLE_CREATE_FAILED: '記事の作成に失敗しました',
  ARTICLE_UPDATE_FAILED: '記事の更新に失敗しました',
  ARTICLE_DELETE_FAILED: '記事の削除に失敗しました',
  ARTICLE_FETCH_FAILED: '記事の取得に失敗しました',
  ARTICLE_NOT_FOUND: '記事が見つかりません',
  DATA_FETCH_FAILED: 'データの取得に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
} as const;
  
  export const ACCESS_INFO = {
    location: '〒106-0032 東京都港区六本木4-1-1 第二黒崎ビル2F',
    phone: '03-3505-3005',
    fax: '03-3505-3004',
    access: [
      '東京メトロ日比谷線・都営大江戸線「六本木駅」6番出口より徒歩1分',
      '東京メトロ南北線「六本木一丁目駅」1番出口より徒歩5分',
      '東京メトロ銀座線・南北線「溜池山王駅」13番出口より徒歩8分'
    ],
    businessHours: '平日 9:00〜18:00（土日祝日休業）'
  } as const;