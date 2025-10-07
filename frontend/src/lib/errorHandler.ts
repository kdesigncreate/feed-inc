import { ERROR_MESSAGES } from './constants';

/**
 * API エラーレスポンスの型定義
 */
interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
}

/**
 * エラーが API エラーレスポンスかどうかをチェック
 */
function isApiError(error: unknown): error is ApiErrorResponse {
  return error instanceof Error && 'response' in error;
}

/**
 * API エラーからメッセージを抽出
 */
export function extractErrorMessage(
  error: unknown,
  fallbackMessage: string = ERROR_MESSAGES.NETWORK_ERROR
): string {
  if (isApiError(error)) {
    return error.response?.data?.message || fallbackMessage;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return fallbackMessage;
}

/**
 * 記事関連のエラーハンドリング
 */
export const articleErrorHandler = {
  create: (error: unknown) => extractErrorMessage(error, ERROR_MESSAGES.ARTICLE_CREATE_FAILED),
  update: (error: unknown) => extractErrorMessage(error, ERROR_MESSAGES.ARTICLE_UPDATE_FAILED),
  delete: (error: unknown) => extractErrorMessage(error, ERROR_MESSAGES.ARTICLE_DELETE_FAILED),
  fetch: (error: unknown) => extractErrorMessage(error, ERROR_MESSAGES.ARTICLE_FETCH_FAILED),
  notFound: (error: unknown) => {
    if (isApiError(error) && error.response?.status === 404) {
      return ERROR_MESSAGES.ARTICLE_NOT_FOUND;
    }
    return extractErrorMessage(error, ERROR_MESSAGES.DATA_FETCH_FAILED);
  },
};

/**
 * 認証関連のエラーハンドリング
 */
export const authErrorHandler = {
  login: (error: unknown) => extractErrorMessage(error, ERROR_MESSAGES.LOGIN_FAILED),
};

/**
 * 一般的なデータ取得エラーハンドリング
 */
export function handleDataFetchError(error: unknown): string {
  return extractErrorMessage(error, ERROR_MESSAGES.DATA_FETCH_FAILED);
}