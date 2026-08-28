import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Bell,
  ArrowUp,
  ArrowDown,
  Minus,
  Info,
  ChevronLeft,
  ArrowLeftRight,
} from 'lucide-react';
import { CurrencyItem, PairDirection } from '../types';
import { DisqusComments } from './DisqusComments';

interface AnalysisViewProps {
  currency: CurrencyItem;
  initialDirection?: PairDirection;
  onBackToDashboard: () => void;
  onSetAlert: (currencyCode: string, targetRate?: number, direction?: PairDirection) => void;
  onSelectAnotherCurrency: (code: string) => void;
  allCurrencies: CurrencyItem[];
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  currency,
  initialDirection = 'foreign_to_sgd',
  onBackToDashboard,
  onSetAlert,
  onSelectAnotherCurrency,
  allCurrencies,
}) => {
  const [direction, setDirection] = useState<PairDirection>(initialDirection);
  const [timeRange, setTimeRange] = useState<'30' | '90'>('30');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const rawHistoricalData =
    timeRange === '30' ? currency.historical30d : currency.historical90d;

  const isInverse = direction === 'sgd_to_foreign';

  // Transform historical rates if in inverted view (SGD/Foreign)
  const historicalData = rawHistoricalData.map((d) => ({
    date: d.date,
    rate: isInverse ? 1 / d.rate : d.rate,
  }));

  const rates = historicalData.map((d) => d.rate);
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  const range = maxRate - minRate || 1;

  const high = Math.max(...rates);
  const low = Math.min(...rates);
  const avg = rates.reduce((acc, v) => acc + v, 0) / (rates.length || 1);

  const currentRate = isInverse ? 1 / currency.rateToSGD : currency.rateToSGD;
  const changePercent = isInverse
    ? Number((((1 / (1 + currency.changePercent / 100)) - 1) * 100).toFixed(2))
    : currency.changePercent;
  const isPositive = changePercent >= 0;

  const formatStat = (val: number) => {
    if (val >= 1000) return val.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
    if (val >= 100) return val.toFixed(2);
    if (val >= 10) return val.toFixed(3);
    return val.toFixed(4);
  };

  const points = historicalData.map((d, index) => {
    const x = (index / (historicalData.length - 1)) * 100;
    // Keep 15% padding top and bottom
    const y = 85 - ((d.rate - minRate) / range) * 70;
    return { x, y, date: d.date, rate: d.rate };
  });

  // Build SVG Path
  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    linePath += ` Q ${prev.x + (midX - prev.x) * 0.5} ${prev.y}, ${midX} ${(prev.y + curr.y) / 2} T ${curr.x} ${curr.y}`;
  }

  const areaPath = `${linePath} L 100 100 L 0 100 Z`;

  // Default active point or hovered point
  const activePointIndex =
    hoverIndex !== null ? hoverIndex : Math.floor(points.length * 0.8);
  const activePoint = points[activePointIndex] || points[points.length - 1];

  const pairLabel = isInverse ? `SGD / ${currency.code}` : `${currency.code} / SGD`;

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-12 py-8 md:py-12">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Live Rates
        </button>

        <div className="flex flex-wrap items-center gap-3">
          {/* Direction toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200/80">
            <button
              onClick={() => setDirection('foreign_to_sgd')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                direction === 'foreign_to_sgd'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {currency.code}/SGD
            </button>
            <button
              onClick={() => setDirection('sgd_to_foreign')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                direction === 'sgd_to_foreign'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ArrowLeftRight className="w-3 h-3" />
              SGD/{currency.code}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Pair:</span>
            <select
              value={currency.code}
              onChange={(e) => onSelectAnotherCurrency(e.target.value)}
              className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-indigo-600 outline-none shadow-xs cursor-pointer focus:ring-2 focus:ring-indigo-100"
            >
              {allCurrencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Market Intelligence
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {pairLabel} Exchange Rate Analysis
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isInverse
              ? `Historical rate performance of 1 Singapore Dollar into ${currency.name}`
              : `Historical rate performance of 1 ${currency.name} into Singapore Dollars`}
          </p>
        </div>

        <button
          onClick={() => onSetAlert(currency.code, currentRate, direction)}
          className="bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Bell className="w-4 h-4 fill-white text-transparent" />
          Set {pairLabel} Alert
        </button>
      </div>

      {/* Main Grid: Chart & Key Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Graph Area */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                {formatStat(currentRate)}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 border ${
                  isPositive
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : 'bg-rose-50 text-rose-600 border-rose-100'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
                )}
                {isPositive ? `+${changePercent}%` : `${changePercent}%`}
              </span>
            </div>

            <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200/60">
              <button
                onClick={() => setTimeRange('30')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  timeRange === '30'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTimeRange('90')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  timeRange === '90'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                90 Days
              </button>
            </div>
          </div>

          {/* Interactive Chart Canvas */}
          <div
            className="flex-grow relative min-h-[320px] bg-slate-50/60 border border-slate-200/80 rounded-2xl flex items-end select-none overflow-hidden p-2"
            onMouseLeave={() => setHoverIndex(null)}
          >
            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-rows-4 gap-0 pointer-events-none p-4">
              <div className="border-t border-slate-200/60 w-full" />
              <div className="border-t border-slate-200/60 w-full" />
              <div className="border-t border-slate-200/60 w-full" />
              <div className="border-t border-slate-200/60 w-full" />
            </div>

            {/* Chart SVG */}
            <svg
              className="w-full h-full absolute inset-0"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <defs>
                <linearGradient id="analysisGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#analysisGradient)" />
              <path
                d={linePath}
                fill="none"
                stroke="#4f46e5"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* Invisible interactive columns for smooth hover */}
            <div className="absolute inset-0 flex z-20">
              {points.map((p, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-full cursor-crosshair"
                  onMouseEnter={() => setHoverIndex(idx)}
                />
              ))}
            </div>

            {/* Active Tooltip */}
            {activePoint && (
              <>
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-full mb-3 z-30 pointer-events-none transition-all duration-75"
                  style={{
                    left: `${activePoint.x}%`,
                    top: `${activePoint.y}%`,
                  }}
                >
                  <div className="bg-slate-900 text-white text-xs px-3.5 py-2 rounded-xl shadow-xl text-center whitespace-nowrap border border-slate-700">
                    <div className="font-semibold text-slate-300">{activePoint.date}</div>
                    <div className="text-white font-bold text-sm">
                      {isInverse
                        ? `1 SGD = ${formatStat(activePoint.rate)} ${currency.code}`
                        : `1 ${currency.code} = ${formatStat(activePoint.rate)} SGD`}
                    </div>
                  </div>
                  <div className="w-2.5 h-2.5 bg-slate-900 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-slate-700" />
                </div>

                {/* Active Data Point Dot */}
                <div
                  className="absolute w-4 h-4 bg-white border-3 border-indigo-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20 shadow-md pointer-events-none"
                  style={{
                    left: `${activePoint.x}%`,
                    top: `${activePoint.y}%`,
                  }}
                />
              </>
            )}
          </div>

          {/* Timeline Date Labels */}
          <div className="flex justify-between mt-3 text-xs font-semibold text-slate-400 px-1">
            <span>{historicalData[0]?.date || 'Start'}</span>
            <span>{historicalData[Math.floor(historicalData.length / 2)]?.date || 'Mid-period'}</span>
            <span>{historicalData[historicalData.length - 1]?.date || 'Today'}</span>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Key Statistics</span>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                {timeRange === '30' ? '30 Days' : '90 Days'}
              </span>
            </h2>

            <div className="space-y-3">
              {/* High */}
              <div className="flex justify-between items-center p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    High ({isInverse ? currency.code : 'SGD'})
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {formatStat(high)}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <ArrowUp className="w-4 h-4 text-emerald-600" />
                </div>
              </div>

              {/* Low */}
              <div className="flex justify-between items-center p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Low ({isInverse ? currency.code : 'SGD'})
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {formatStat(low)}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                  <ArrowDown className="w-4 h-4 text-rose-600" />
                </div>
              </div>

              {/* Average */}
              <div className="flex justify-between items-center p-3.5 bg-slate-50 rounded-2xl border border-indigo-100">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                    Average ({isInverse ? currency.code : 'SGD'})
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {formatStat(avg)}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <Minus className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-white rounded-3xl p-6 text-center border border-slate-200/90 shadow-xs flex flex-col items-center">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-3">
              <Info className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Rates are indicative market midpoints published by the Monetary Authority of Singapore. Benchmark rates reflect real-time Asian session movements.
            </p>
          </div>
        </div>
      </div>

      {/* Disqus Comments Section for this Currency Pair */}
      <div className="mt-10 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {currency.code}/SGD Currency Discussion
            </h2>
            <p className="text-xs text-slate-500">
              Discuss historical price movements, forecasts, and money transfer rates for {currency.name}
            </p>
          </div>
          <span className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-semibold w-fit border border-indigo-100">
            {currency.code}/SGD Thread
          </span>
        </div>

        <DisqusComments
          url={`https://sgd-exchange.vercel.app/analysis/${currency.code.toLowerCase()}`}
          identifier={`sgdexchange-analysis-${currency.code.toLowerCase()}`}
          title={`${currency.code}/SGD Exchange Rate Discussion & Analysis`}
        />
      </div>
    </div>
  );
};
