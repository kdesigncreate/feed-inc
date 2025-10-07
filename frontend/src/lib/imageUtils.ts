/**
 * 画像URLが有効かどうかをチェックする
 * @param imageUrl 画像URL
 * @returns 有効な画像URLの場合true
 */
export function isValidImageUrl(imageUrl: string | null | undefined): imageUrl is string {
  // Debug logging - uncomment when debugging image URL issues
  // console.log('🔍 Validating image URL:', JSON.stringify(imageUrl), typeof imageUrl, 'Stack:', new Error().stack?.split('\n')[2]);
  
  // Null/undefined/empty checks
  if (!imageUrl) return false;
  if (imageUrl === 'null' || imageUrl === 'undefined' || imageUrl === '') return false;
  
  const trimmed = imageUrl.trim();
  if (!trimmed) return false;
  
  // Check for incomplete storage paths that cause 404s
  const invalidPaths = [
    '/storage/',
    '/storage',
    'storage/',
    'storage',
    '/public/storage/',
    '/public/storage',
  ];
  
  if (invalidPaths.includes(trimmed) || trimmed.endsWith('/storage/') || trimmed.endsWith('/storage')) {
    return false;
  }
  
  // Check for malformed URLs that would cause Next.js Image 404s
  if (trimmed.includes('/storage/') && !trimmed.includes('/storage/images/')) {
    // Storage path exists but doesn't point to a specific file
    const afterStorage = trimmed.split('/storage/')[1];
    if (!afterStorage || afterStorage === '' || !afterStorage.includes('.')) {
      return false;
    }
  }
  
  // Basic URL format check
  try {
    const url = new URL(trimmed);
    // For complete URLs, check that path isn't incomplete
    if (url.pathname === '/storage/' || url.pathname === '/storage' || 
        url.pathname.endsWith('/storage/') || url.pathname.endsWith('/storage')) {
      return false;
    }
    return true;
  } catch {
    // For relative paths, ensure they're not incomplete
    return (trimmed.startsWith('/') || trimmed.startsWith('./')) && 
           !invalidPaths.some(path => trimmed === path || trimmed.endsWith(path)) &&
           (trimmed.includes('.') || !trimmed.includes('/storage')); // Must have file extension or not be storage-related
  }
}

/**
 * 安全な画像URL取得
 * @param imageUrl 画像URL
 * @returns 有効な画像URLまたはnull
 */
export function getSafeImageUrl(imageUrl: string | null | undefined): string | null {
  return isValidImageUrl(imageUrl) ? imageUrl : null;
}