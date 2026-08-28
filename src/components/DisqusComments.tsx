import React, { useEffect } from 'react';
import { MessageSquare, ShieldCheck, ExternalLink } from 'lucide-react';

interface DisqusCommentsProps {
  identifier?: string;
  url?: string;
  title?: string;
  compact?: boolean;
}

declare global {
  interface Window {
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config: (this: {
          page: {
            identifier: string;
            url: string;
            title: string;
          };
        }) => void;
      }) => void;
    };
    disqus_config?: () => void;
  }
}

export const DisqusComments: React.FC<DisqusCommentsProps> = ({
  identifier = 'sgdexchange-main',
  url = typeof window !== 'undefined' ? window.location.href : 'https://sgdexchange.disqus.com',
  title = 'SGD Exchange Community Discussion',
  compact = false,
}) => {
  useEffect(() => {
    const canonicalUrl = url || window.location.href;
    const pageId = identifier || 'sgdexchange-main';
    const pageTitle = title || document.title;

    // If DISQUS is already loaded in the window, reset it for the new page/tab
    if (window.DISQUS) {
      try {
        window.DISQUS.reset({
          reload: true,
          config: function () {
            this.page.identifier = pageId;
            this.page.url = canonicalUrl;
            this.page.title = pageTitle;
          },
        });
      } catch (err) {
        console.warn('Disqus reset error:', err);
      }
      return;
    }

    // Configure Disqus for first load
    window.disqus_config = function (this: {
      page: {
        identifier: string;
        url: string;
        title: string;
      };
    }) {
      this.page.identifier = pageId;
      this.page.url = canonicalUrl;
      this.page.title = pageTitle;
    };

    // Inject Disqus embed script
    const existingScript = document.getElementById('disqus-embed-script');
    if (!existingScript) {
      const d = document;
      const s = d.createElement('script');
      s.id = 'disqus-embed-script';
      s.src = 'https://sgdexchange.disqus.com/embed.js';
      s.setAttribute('data-timestamp', String(+new Date()));
      (d.head || d.body).appendChild(s);
    }
  }, [identifier, url, title]);

  return (
    <div
      id="disqus-wrapper"
      className={`bg-white rounded-3xl border border-slate-200 shadow-sm ${
        compact ? 'p-5 md:p-6' : 'p-6 md:p-8'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                Community Discussion
              </h2>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                Disqus
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Share your insights, market forecasts, and FX transfer tips.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Moderated Forum
          </span>
          <a
            href="https://disqus.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 inline-flex items-center gap-1 transition-colors"
          >
            Powered by Disqus <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Disqus Thread Container */}
      <div className="min-h-[220px]">
        <div id="disqus_thread"></div>
        <noscript>
          Please enable JavaScript to view the{' '}
          <a href="https://disqus.com/?ref_noscript" className="text-indigo-600 underline">
            comments powered by Disqus.
          </a>
        </noscript>
      </div>
    </div>
  );
};
