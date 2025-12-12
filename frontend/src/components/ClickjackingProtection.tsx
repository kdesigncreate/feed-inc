'use client';

import { useEffect } from 'react';

/**
 * クリックジャッキング攻撃検出・防止コンポーネント
 */
export function ClickjackingProtection() {
  //ClickjackingProtectionはClickjackingProtectionのコンポーネント。
  useEffect(() => {
    // フレーム内で実行されているかをチェック
    //useEffectは副作用を実行するためのもの。
    //副作用とは、コンポーネントの外側の状態を変更すること。（ここではフレーム内で実行されているかをチェックする。）
    const detectFraming = () => {
      //detectFramingはフレーム内で実行されているかをチェックするための関数。
      try {
        if (window.self !== window.top) {
          //window.self !== window.topの場合はif文の中に入る。
          console.warn('Security Alert: Potential clickjacking attempt detected');
          
          try {
            if (window.top) {
              //window.topがtrueの場合はif文の中に入る。
              window.top.location.href = window.location.href;
              //window.topのlocation.hrefをwindow.location.hrefにする。
            }
          } catch (e) {
            // アクセスできない場合は、ページを空白にして攻撃を無効化
            document.body.style.display = 'none';
            //document.body.style.display = 'none'はdocument.bodyのstyle.displayを'none'にする。

            const warningDiv = document.createElement('div');
            //warningDivは警告を表示するためのdiv。
            //warningDivのstyle.cssTextを指定する。
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
            //document.bodyにwarningDivを追加する。

            // 親ウィンドウに警告イベントを送信（可能な場合）
            try {
              window.parent.postMessage({
                //window.parentのpostMessageを指定する。
                type: 'CLICKJACKING_DETECTED',
                //typeはクリックジャッキング攻撃を検出したことを表す。
                url: window.location.href,
                //urlはwindow.location.hrefを表す。
                timestamp: new Date().toISOString()
                //timestampは新しいDateオブジェクトを作成し、
                //toISOStringメソッドを呼び出して
                //ISO 8601形式の文字列に変換したものを表す。
              }, '*');
              //'*'はすべてのウィンドウにメッセージを送信することを表す。
            } catch (e) {
              // 送信できない場合は無視
            }
          }
          
          return true; 
          //フレーミングが検出された場合はtrueを返す。
        }
        return false; 
        //正常な表示の場合はfalseを返す。
      } catch (e) {
        // エラーが発生した場合、潜在的なセキュリティリスクとして扱う
        console.warn('Frame detection error:', e);
        return false;
      }
    };

    // 初回チェック
    const isFramed = detectFraming();
    //isFramedはdetectFramingの戻り値を表す。
    
    // 定期的にチェック（フレームが後から追加される可能性に対処）
    if (!isFramed) {
      //isFramedがfalseの場合はif文の中に入る。
      const checkInterval = setInterval(detectFraming, 1000);
      //detectFramingを1秒ごとに実行するためのもの。
      //setIntervalは一定時間ごとに関数を実行するためのもの。
      return () => {
        clearInterval(checkInterval);
        //checkIntervalをクリアする。
      };
    }
  }, []);
  //[]は依存配列を表す。
  //依存配列とは、useEffectが実行されるタイミングを決定するためのもの。

  return null;
  // このコンポーネントは UI を描画しない
}

/**
 * セキュリティイベントを監視するフック
 */
export function useSecurityMonitoring() {
  //useSecurityMonitoringはuseSecurityMonitoringのコンポーネント。
  useEffect(() => {
    //useEffectは副作用を実行するためのもの。
    //副作用とは、コンポーネントの外側の状態を変更すること。（ここではセキュリティイベントを監視する。）
    const handleSecurityEvent = (event: MessageEvent) => {
      //handleSecurityEventはセキュリティイベントを監視するための関数。
      //eventはセキュリティイベントを表す。
      //MessageEventはメッセージイベントを表す。
      if (event.data?.type === 'CLICKJACKING_DETECTED') {
        //event.data?.type === 'CLICKJACKING_DETECTED'の場合はif文の中に入る。
        console.warn('Clickjacking attempt detected:', event.data);
        //console.warnはエラーを表示するためのもの。
        //event.dataはセキュリティイベントを表す。
      }
    };

    window.addEventListener('message', handleSecurityEvent);
    //handleSecurityEventをwindow.addEventListenerで監視するためのもの。
    return () => {
      window.removeEventListener('message', handleSecurityEvent);
      //handleSecurityEventをwindow.removeEventListenerで監視するためのもの。
    };
  }, []);
  //[]は依存配列を表す。
  //依存配列とは、useEffectが実行されるタイミングを決定するためのもの。
  return null;
  //このコンポーネントは UI を描画しない
}