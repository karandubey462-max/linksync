export const getDomain = (url = '') => {
  try {
    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    return new URL(normalized).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
};

export const getSiteName = (url = '') => {
  const domain = getDomain(url);
  if (!domain) return 'Link';

  const knownSites = {
    'instagram.com': 'Instagram',
    'youtube.com': 'YouTube',
    'youtu.be': 'YouTube',
    'x.com': 'X',
    'twitter.com': 'X',
    'linkedin.com': 'LinkedIn',
    'github.com': 'GitHub',
    'facebook.com': 'Facebook',
    'tiktok.com': 'TikTok',
    'whatsapp.com': 'WhatsApp',
    'wa.me': 'WhatsApp',
    'snapchat.com': 'Snapchat',
    'threads.net': 'Threads',
    'spotify.com': 'Spotify',
  };

  return knownSites[domain] || domain.split('.')[0].replace(/^\w/, (letter) => letter.toUpperCase());
};

export const getFaviconUrl = (url = '') => {
  const domain = getDomain(url);
  return domain ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64` : '';
};
