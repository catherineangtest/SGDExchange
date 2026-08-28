import React, { useState } from 'react';
import { MessageSquare, MessageCircle, ChevronDown, ChevronUp, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';

interface DisqusCommentsProps {
  url?: string;
  identifier?: string;
  title?: string;
  shortname?: string;
  className?: string;
  compact?: boolean;
}

export const DisqusComments: React.FC<DisqusCommentsProps> = ({
  url = 'https://sgd-exchange.vercel.app/',
  identifier = 'sgdexchange-main',
  title = 'SGD Exchange Community Discussion',
  shortname = 'sgdexchange',
  className = '',
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const cleanId = identifier.replace(/[^a-zA-Z0-9_-]/g, '_');
  const embedSrc = `/disqus-embed.html?shortname=${encodeURIComponent(shortname)}&id=${encodeURIComponent(cleanId)}&title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  return (
    <div id="disqus-container" className={`w-full ${className}`}>
      <div className={`bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col gap-6 ${compact ? 'p-5' : 'p-6 sm:p-8'}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                  {title}
                </h2>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                  Disqus
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                SGD Exchange • Powered by Disqus ({shortname})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={`https://${shortname}.disqus.com`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Disqus Hub</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              title={isExpanded ? 'Collapse discussion' : 'Expand discussion'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Disqus Iframe Embed Container */}
        {isExpanded && (
          <div className="min-h-[380px] relative flex flex-col gap-2">
            <div className="bg-slate-50/50 rounded-2xl p-2 border border-slate-100 overflow-hidden">
              <iframe
                key={`${cleanId}-${reloadKey}`}
                src={embedSrc}
                title={`Disqus Discussion - ${title}`}
                className="w-full min-h-[420px] md:min-h-[480px] border-0 bg-transparent"
                loading="lazy"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Live discussion forum (language: US English)
              </span>
              <button
                onClick={() => setReloadKey((k) => k + 1)}
                className="flex items-center gap-1 hover:text-indigo-600 text-slate-500 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh Frame</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
