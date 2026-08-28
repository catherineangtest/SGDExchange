import React from 'react';
import { MessageSquare, Users, Sparkles, TrendingUp } from 'lucide-react';
import { DisqusComments } from './DisqusComments';

export const CommunityView: React.FC = () => {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-12 py-8 md:py-12">
      {/* Hero Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Community & FX Trader Forum
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Market Discussion
        </h1>
        <p className="text-sm md:text-base text-slate-500 mt-1">
          Join Singapore Dollar traders, expatriates, and travelers in sharing currency trends, remittance rates, and MAS policy insights.
        </p>
      </div>

      {/* Discussion Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Active Traders</div>
            <div className="text-sm font-bold text-slate-800">Singapore & Global FX</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Rate Forecasts</div>
            <div className="text-sm font-bold text-slate-800">MAS End-of-Day Analysis</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Platform</div>
            <div className="text-sm font-bold text-slate-800">Disqus Universal Embed</div>
          </div>
        </div>
      </div>

      {/* Disqus Comments Integration */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Community Discussion Board
              </h2>
              <p className="text-xs text-slate-500">
                Post questions, rate comparisons, and exchange rate thoughts
              </p>
            </div>
          </div>
          <span className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-semibold w-fit border border-indigo-100">
            Live Disqus Board
          </span>
        </div>

        <DisqusComments
          url="https://sgd-exchange.vercel.app/community"
          identifier="sgdexchange-community"
          title="SGD Exchange Community Discussion"
        />
      </div>
    </div>
  );
};
