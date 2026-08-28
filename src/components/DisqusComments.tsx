import React, { useEffect, useState } from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';

interface DisqusCommentsProps {
  url?: string;
  identifier?: string;
  title?: string;
  className?: string;
}

declare global {
  interface Window {
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config?: (this: { page: { url?: string; identifier?: string; title?: string } }) => void;
      }) => void;
    };
    disqus_config?: () => void;
  }
}

export const DisqusComments: React.FC<DisqusCommentsProps> = ({
  url = 'https://sgd-exchange.vercel.app/',
  identifier = 'sgdexchange-main',
  title = 'SGD Exchange Community Discussion',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const pageUrl = url || 'https://sgd-exchange.vercel.app/';
    const pageIdentifier = identifier || 'sgdexchange-main';

    // Set configuration function for Disqus
    window.disqus_config = function (this: { page: { url?: string; identifier?: string; title?: string } }) {
      this.page.url = pageUrl;
      this.page.identifier = pageIdentifier;
      if (title) {
        this.page.title = title;
      }
    };

    const existingScript = document.getElementById('dsq-embed-scr') as HTMLScriptElement | null;

    if (window.DISQUS) {
      // If Disqus is already loaded, reset for the current page/thread
      try {
        window.DISQUS.reset({
          reload: true,
          config: function (this: { page: { url?: string; identifier?: string; title?: string } }) {
            this.page.url = pageUrl;
            this.page.identifier = pageIdentifier;
            if (title) {
              this.page.title = title;
            }
          },
        });
      } catch (err) {
        console.warn('Disqus reset error:', err);
      }
    } else if (!existingScript) {
      // Only inject the script if it hasn't been added yet (prevents StrictMode duplicate script tag race)
      try {
        const d = document;
        const s = d.createElement('script');
        s.id = 'dsq-embed-scr';
        s.src = 'https://sgdexchange.disqus.com/embed.js';
        s.setAttribute('data-timestamp', String(+new Date()));
        s.async = true;
        s.onerror = () => {
          setHasError(true);
        };
        (d.head || d.body).appendChild(s);
      } catch (e) {
        console.warn('Error loading Disqus script:', e);
        setHasError(true);
      }
    }
  }, [url, identifier, title]);

  return (
    <div id="disqus-container" className={`w-full ${className}`}>
      {hasError ? (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl text-center space-y-2 text-slate-600">
          <AlertCircle className="w-6 h-6 mx-auto text-amber-600" />
          <p className="text-sm font-medium text-slate-800">Comments widget could not be loaded</p>
          <p className="text-xs text-slate-500">
            Please check your internet connection or ad-blocker settings to view the discussion.
          </p>
        </div>
      ) : (
        <div id="disqus_thread" className="min-h-[220px]" />
      )}
      <noscript>
        Please enable JavaScript to view the{' '}
        <a href="https://disqus.com/?ref_noscript" rel="nofollow" className="text-indigo-600 underline">
          comments powered by Disqus.
        </a>
      </noscript>
    </div>
  );
};

