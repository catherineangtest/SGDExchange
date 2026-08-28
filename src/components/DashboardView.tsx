import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Plus, ChevronRight, ArrowLeftRight, Trash2, RotateCcw } from 'lucide-react';
import { CurrencyItem, PairDirection } from '../types';

interface DashboardViewProps {
  currencies: CurrencyItem[];
  pairDirection?: PairDirection;
  onDirectionChange?: (direction: PairDirection) => void;
  onSelectCurrency: (currency: CurrencyItem, direction: PairDirection) => void;
  onOpenAddCurrency: () => void;
  onDeleteCurrency?: (currencyCode: string) => void;
  onResetDefaultCurrencies?: () => void;
  onQuickAlert: (currency: CurrencyItem, direction: PairDirection) => void;
  isLiveMasSync?: boolean;
  onOpenDataSource?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currencies,
  pairDirection: externalDirection,
  onDirectionChange,
  onSelectCurrency,
  onOpenAddCurrency,
  onDeleteCurrency,
  onResetDefaultCurrencies,
  isLiveMasSync = false,
  onOpenDataSource,
}) => {
  const [internalDirection, setInternalDirection] = useState<PairDirection>('foreign_to_sgd');
  const pairDirection = externalDirection || internalDirection;

  const handleDirectionChange = (newDir: PairDirection) => {
    setInternalDirection(newDir);
    if (onDirectionChange) {
      onDirectionChange(newDir);
    }
  };

  const [formattedTime, setFormattedTime] = useState('Oct 26, 2023 • 14:30 SGT');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Singapore',
      };
      const dateStr = now.toLocaleDateString('en-US', options).replace(',', ' •');
      setFormattedTime(`${dateStr} SGT`);
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Format currency rate according to its magnitude
  const formatRate = (rate: number, direction: PairDirection) => {
    if (direction === 'foreign_to_sgd') {
      return rate < 0.01 ? rate.toFixed(5) : rate.toFixed(4);
    }
    // Inverted (SGD to Foreign)
    if (rate >= 1000) {
      return rate.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
    }
    if (rate >= 100) {
      return rate.toFixed(2);
    }
    if (rate >= 10) {
      return rate.toFixed(3);
    }
    return rate.toFixed(4);
  };

  // Helper to generate dynamic SVG path matching the sleek indigo card sparkline
  const renderSparkline = (points: number[], isInverse: boolean) => {
    if (!points || points.length < 2) {
      return (
        <div className="w-full h-9 bg-slate-50 rounded-xl overflow-hidden relative border border-slate-100">
          <svg className="absolute inset-0 w-full h-full text-indigo-600 opacity-15" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M0 100 L 0 50 Q 25 70, 50 40 T 100 20 L 100 100 Z" fill="currentColor" />
          </svg>
          <svg className="absolute inset-0 w-full h-full text-indigo-600" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M0 50 Q 25 70, 50 40 T 100 20" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      );
    }

    // Invert the points if viewing SGD to Foreign
    const adjustedPoints = isInverse
      ? points.map((p) => {
          const minP = Math.min(...points);
          const maxP = Math.max(...points);
          return maxP + minP - p;
        })
      : points;

    // Scale points into 0-100 x and y (inverted y so higher rate is at top)
    const min = Math.min(...adjustedPoints);
    const max = Math.max(...adjustedPoints);
    const range = max - min || 1;

    const coords = adjustedPoints.map((val, idx) => {
      const x = (idx / (adjustedPoints.length - 1)) * 100;
      const y = 80 - ((val - min) / range) * 60; // leave 10px buffer top & bottom
      return { x, y };
    });

    let linePath = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const midX = (prev.x + curr.x) / 2;
      linePath += ` Q ${prev.x + (midX - prev.x) * 0.5} ${prev.y}, ${midX} ${(prev.y + curr.y) / 2} T ${curr.x} ${curr.y}`;
    }

    const areaPath = `${linePath} L 100 100 L 0 100 Z`;

    return (
      <div className="w-full h-9 bg-slate-50 rounded-xl overflow-hidden relative border border-slate-100/80">
        <svg className="absolute inset-0 w-full h-full text-indigo-600 opacity-15" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d={areaPath} fill="currentColor" />
        </svg>
        <svg className="absolute inset-0 w-full h-full text-indigo-600" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d={linePath} fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-12 py-8">
      {/* Hero Section */}
      <section className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              End of Day SGD Exchange Rates
            </span>
            <button
              onClick={onOpenDataSource}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 transition-colors cursor-pointer ${
                isLiveMasSync
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              <span>{isLiveMasSync ? 'MAS End of Period Synced' : 'MAS Official Data Feed'}</span>
            </button>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            SGD Exchange
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            {pairDirection === 'foreign_to_sgd'
              ? 'Base Home Currency: Singapore Dollar (SGD) • 1 Unit Foreign = X SGD'
              : 'Inverted View: Singapore Dollar Base • 1 SGD = X Foreign Currency'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Pair Direction Toggle Control */}
          <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center shadow-xs border border-slate-200">
            <button
              onClick={() => handleDirectionChange('foreign_to_sgd')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                pairDirection === 'foreign_to_sgd'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Foreign / SGD
            </button>
            <button
              onClick={() => handleDirectionChange('sgd_to_foreign')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                pairDirection === 'sgd_to_foreign'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              SGD / Foreign
            </button>
          </div>

          <div className="text-left md:text-right bg-white/70 backdrop-blur-xs border border-slate-200/80 px-4 py-2 rounded-2xl shadow-xs">
            <div className="text-xs font-bold text-slate-800 tracking-tight">
              {formattedTime}
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 flex items-center md:justify-end gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Asian Market Open</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Rate Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-12">
        {currencies.map((currency) => {
          const isInverse = pairDirection === 'sgd_to_foreign';
          
          // Calculate rate and change based on direction
          const displayedRate = isInverse
            ? 1 / currency.rateToSGD
            : currency.rateToSGD;

          // Inverted change %: ((1 / (1 + p/100)) - 1) * 100
          const displayedChangePercent = isInverse
            ? Number((((1 / (1 + currency.changePercent / 100)) - 1) * 100).toFixed(1))
            : currency.changePercent;

          const isPositive = displayedChangePercent > 0;
          const isNegative = displayedChangePercent < 0;
          const isZero = displayedChangePercent === 0;

          const pairLabel = isInverse ? `SGD/${currency.code}` : `${currency.code}/SGD`;
          const unitContext = isInverse
            ? `1 SGD = ${formatRate(displayedRate, pairDirection)} ${currency.code}`
            : `1 ${currency.code} = ${currency.rateToSGD.toFixed(4)} SGD`;

          return (
            <div
              key={currency.code}
              onClick={() => onSelectCurrency(currency, pairDirection)}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between cursor-pointer group relative"
            >
              {/* Card Top */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    {currency.name}
                  </div>
                  <div className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                    {pairLabel}
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <div
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 border ${
                      isPositive
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : isNegative
                        ? 'bg-rose-50 text-rose-600 border-rose-100'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {isPositive && <TrendingUp className="w-3 h-3 stroke-[2.5]" />}
                    {isNegative && <TrendingDown className="w-3 h-3 stroke-[2.5]" />}
                    {isZero && <Minus className="w-3 h-3 stroke-[2.5]" />}
                    <span>
                      {isPositive ? `+${displayedChangePercent.toFixed(1)}%` : `${displayedChangePercent.toFixed(1)}%`}
                    </span>
                  </div>

                  {/* Delete Button */}
                  {onDeleteCurrency && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCurrency(currency.code);
                      }}
                      title={`Remove ${currency.code} from dashboard`}
                      aria-label={`Remove ${currency.code} from dashboard`}
                      className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg opacity-80 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Card Bottom: Rate, Unit Label & Sparkline */}
              <div className="mt-2">
                <div className="text-3xl font-black text-slate-900 tracking-tight mb-1 leading-none group-hover:text-indigo-600 transition-colors">
                  {formatRate(displayedRate, pairDirection)}
                </div>
                <div className="text-[11px] font-semibold text-slate-400 mb-3 truncate">
                  {unitContext}
                </div>

                {renderSparkline(currency.sparkline, isInverse)}
              </div>
            </div>
          );
        })}

        {/* Add Currency Card */}
        <button
          onClick={onOpenAddCurrency}
          className="bg-slate-50/80 border-2 border-dashed border-slate-200 rounded-2xl p-5 hover:bg-white hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-200 flex flex-col justify-center items-center gap-2 text-slate-700 min-h-[170px] cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xs">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
            Add Currency
          </span>
          <span className="text-xs text-slate-400">CAD, CHF, HKD, NZD & more</span>
        </button>
      </section>

      {/* Empty State / Reset Option */}
      {currencies.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs max-w-md mx-auto mb-12">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Currencies on Dashboard</h3>
          <p className="text-xs text-slate-500 mb-6">
            You have removed all tracked currencies. Add new ones or restore the default major pairs.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onOpenAddCurrency}
              className="px-4 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
            >
              Add Currency
            </button>
            {onResetDefaultCurrencies && (
              <button
                onClick={onResetDefaultCurrencies}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restore Defaults
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
