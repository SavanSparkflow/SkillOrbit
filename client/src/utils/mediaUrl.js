/**
 * Helper to resolve media URLs (local server uploads, CDN streams, or data URLs)
 */
export const getMediaUrl = (url) => {
  if (!url) return '';
  
  // Already an absolute URL or blob/data
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  ) {
    return url;
  }

  // Handle relative server uploads like /uploads/videos/...
  const apiBase = import.meta.env.VITE_API_BASE_URL || '';
  if (apiBase.startsWith('http')) {
    try {
      const urlObj = new URL(apiBase);
      const cleanPath = url.startsWith('/') ? url : `/${url}`;
      return `${urlObj.origin}${cleanPath}`;
    } catch {
      // fallback
    }
  }

  // Fallback to default backend port if in local dev
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `http://localhost:5005${cleanPath}`;
};

export default getMediaUrl;
