/**
 * URL Utilities
 * Functions for URL manipulation and transformation
 */

export function cutLinkAfterSecondSlash(link: string): string {
  const parts = link.split('/');
  if (parts.length > 2) {
    return `${parts[0]}/${parts[2]}`;
  }
  return link;
}

export function transformUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    const parts = parsedUrl.pathname.split('/').filter(Boolean);
    let path = parsedUrl.pathname;

    if (parts.length > 1) {
      path = `/${parts[0]}/...`;
    }

    return `${parsedUrl.hostname}${path}`;
  } catch (e) {
    const parts = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/');
    if (parts.length > 2) {
      return `${parts[0]}/${parts[1]}/...`;
    }
    return url.replace(/^(https?:\/\/)?(www\.)?/, '');
  }
}
