/**
 * フロントエンドの基本初期化（Bootstrap スクリプト）。
 * - Axios を読み込み、グローバル（window）へ公開
 * - 共通ヘッダ（X-Requested-With）を設定して Ajax リクエストであることを明示
 */
import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
