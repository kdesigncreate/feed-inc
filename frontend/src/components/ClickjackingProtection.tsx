'use client';

import { useEffect } from 'react';

/**
 * クリックジャッキング攻撃検出・防止コンポーネント
 */
export function ClickjackingProtection() {
  useEffect(() => {
    // フレーム内で実行されているかをチェック
    const detectFraming = () => {
      try {
        // self !== top の場合、フレーム内で実行されている
        if (window.self !== window.top) {
          // セキュリティログを記録
          console.warn('Security Alert: Potential clickjacking attempt detected');
          
          // フレームから脱出を試みる
          try {
            if (window.top) {
              window.top.location.href = window.location.href;
            }
          } catch (e) {
            // アクセスできない場合は、ページを空白にして攻撃を無効化
            document.body.style.display = 'none';
            
            // ユーザーに警告を表示
            const warningDiv = document.createElement('div');
            warningDiv.style.cssText = `
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: #ffffff;
              z-index: 999999;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: Arial, sans-serif;
              color: #dc2626;
              font-size: 18px;
              text-align: center;
              padding: 20px;
              box-sizing: border-box;
            `;
            warningDiv.innerHTML = `
              <div>
                <h1>セキュリティ警告</h1>
                <p>このページは安全でない方法で表示されています。</p>
                <p>直接 <a href="${window.location.href}" style="color: #2563eb;">feed-inc.com</a> にアクセスしてください。</p>
              </div>
            `;
            document.body.appendChild(warningDiv);
            
            // 親ウィンドウに警告イベントを送信（可能な場合）
            try {
              window.parent.postMessage({
                type: 'CLICKJACKING_DETECTED',
                url: window.location.href,
                timestamp: new Date().toISOString()
              }, '*');
            } catch (e) {
              // 送信できない場合は無視
            }
          }
          
          return true; // フレーミングが検出された
        }
        return false; // 正常な表示
      } catch (e) {
        // エラーが発生した場合、潜在的なセキュリティリスクとして扱う
        console.warn('Frame detection error:', e);
        return false;
      }
    };

    // 初回チェック
    const isFramed = detectFraming();
    
    // 定期的にチェック（フレームが後から追加される可能性に対処）
    if (!isFramed) {
      const checkInterval = setInterval(detectFraming, 1000);
      
      return () => {
        clearInterval(checkInterval);
      };
    }
  }, []);

  // このコンポーネントは UI を描画しない
  return null;
}

/**
 * セキュリティイベントを監視するフック
 */
export function useSecurityMonitoring() {
  useEffect(() => {
    const handleSecurityEvent = (event: MessageEvent) => {
      if (event.data?.type === 'CLICKJACKING_DETECTED') {
        // セキュリティイベントをログに記録
        console.warn('Clickjacking attempt detected:', event.data);
        
        // 必要に応じてサーバーに報告
        // fetch('/api/security/report', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     type: 'clickjacking',
        //     details: event.data,
        //     userAgent: navigator.userAgent,
        //     timestamp: new Date().toISOString()
        //   })
        // });
      }
    };

    window.addEventListener('message', handleSecurityEvent);
    
    return () => {
      window.removeEventListener('message', handleSecurityEvent);
    };
  }, []);
}