'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  //ErrorBoundaryのコンポーネント。
  //React.ComponentはReactのコンポーネントにするためのもの。
  //PropsはPropsを表す。
  //StateはStateを表す。
  public state: State = {
    //public state: State = {はstateを初期化するためのもの。
    //publicは外部からアクセスできることを表す。
    hasError: false
    //hasErrorをfalseにする。
  };

  public static getDerivedStateFromError(_: Error): State {
    //getDerivedStateFromErrorはエラーが発生した場合にstateを更新するための関数。
    //public staticは外部からアクセスできることを表す。
    //_はエラーを表す。
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // componentDidCatchはエラーが発生した場合にエラーを表示するための関数。
    // 引数はerrorとerrorInfoで、errorはエラーを表す、errorInfoはエラー情報を表す。
    if (!error.message.includes('Hydration') && 
        //error.message.includes('Hydration')の場合はif文の中に入る。
        !error.message.includes('Minified React error #418') &&
        //error.message.includes('Minified React error #418')の場合はif文の中に入る。
        !error.message.includes('Minified React error #423') &&
        //error.message.includes('Minified React error #423')の場合はif文の中に入る。
        !error.message.includes('Minified React error #423')) {
        //error.message.includes('Minified React error #423')の場合はif文の中に入る。
      console.error('Uncaught error:', error, errorInfo);
      //'Uncaught error:', error, errorInfoはエラーを表示するためのもの。
    }
  }

  public render() {
    //renderはコンポーネントを描画するための関数。
    if (this.state.hasError) {
      // this.state.hasErrorがtrueの場合はthis.props.childrenを返す。
      return this.props.children;
    }
    // this.state.hasErrorがfalseの場合はthis.props.childrenを返す。
    return this.props.children;
  }
}

export default ErrorBoundary;