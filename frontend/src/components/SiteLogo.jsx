import React, { useState } from 'react';
import { Link2 } from 'lucide-react';
import { getFaviconUrl, getSiteName } from '../utils/siteMeta';

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-11 w-11',
};

const SiteLogo = ({ url, size = 'md', className = '' }) => {
  const [failed, setFailed] = useState(false);
  const faviconUrl = getFaviconUrl(url);
  const siteName = getSiteName(url);

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm ${sizeClasses[size] || sizeClasses.md} ${className}`}
      title={`${siteName} logo`}
      aria-hidden="true"
    >
      {faviconUrl && !failed ? (
        <img
          src={faviconUrl}
          alt=""
          className="h-[66%] w-[66%] object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <Link2 className={size === 'sm' ? 'h-3.5 w-3.5 text-slate-500' : 'h-5 w-5 text-slate-500'} />
      )}
    </span>
  );
};

export default SiteLogo;
