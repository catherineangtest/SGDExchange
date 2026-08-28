import React, { useState } from 'react';
import { ArrowLeftRight, BellRing, ArrowRight, ChevronDown, Check, RefreshCw } from 'lucide-react';
import { CurrencyItem, ConversionRecord } from '../types';
import { CurrencyFlag } from './CurrencyFlag';

interface ConverterViewProps {
  currencies: CurrencyItem[];
  recentConversions: ConversionRecord[];
  onAddConversion: (record: ConversionRecord) => void;
  onNavigateToAlerts: (currencyCode: string, targetRate?: number) => void;
}

export const ConverterView: React.FC<ConverterViewProps> = ({
  currencies,
  recentConversions,
  onAddConversion,
  onNavigateToAlerts,
}) => {
  // Conversion state
  const [fromCode, setFromCode] = useState<string>('SGD');
  const [toCode, setToCode] = useState<string>('USD');
  const [sendAmount, setSendAmount] = useState<string>('1000.00');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [justConverted, setJustConverted] = useState(false);
  const [lastUpdatedMin, setLastUpdatedMin] = useState(2);

  // Find rate:
  // If fromCode is SGD, rate is 1 / toCurrency.rateToSGD
  // If toCode is SGD, rate is fromCurrency.rateToSGD
  const getRate = (from: string, to: string): number => {
    if (from === to) return 1;
    if (from === 'SGD') {
      const target = currencies.find((c) => c.code === to);
      return target ? 1 / target.rateToSGD : 0.7432;
    }
    if (to === 'SGD') {
      const source = currencies.find((c) => c.code === from);
      return source ? source.rateToSGD : 1.3452;
    }
    // Cross rate
    const source = currencies.find((c) => c.code === from);
    const target = currencies.find((c) => c.code === to);
    if (source && target) {
      return source.rateToSGD / target.rateToSGD;
    }
    return 1;
  };

  const rate = getRate(fromCode, toCode);
  const numericSend = parseFloat(sendAmount) || 0;
  const receiveAmount = (numericSend * rate).toFixed(2);

  // Swap currencies
  const handleSwap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  const handleConvertNow = () => {
    if (numericSend <= 0) return;
    const newRecord: ConversionRecord = {
      id: 'conv-' + Date.now(),
      fromCode,
      fromAmount: numericSend,
      toCode,
      toAmount: parseFloat(receiveAmount),
      rate: Number(rate.toFixed(4)),
      timestamp: new Date().toISOString(),
      relativeTime: 'Just now',
    };
    onAddConversion(newRecord);
    setJustConverted(true);
    setTimeout(() => setJustConverted(false), 2000);
  };

  const activeForeignCurrency =
    currencies.find((c) => c.code === (fromCode === 'SGD' ? toCode : fromCode)) || currencies[0];

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-12 py-8 md:py-12 flex flex-col items-center">
      <div className="w-full max-w-4xl grid grid-cols-1 gap-8">
        {/* Converter Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 flex flex-col gap-6 relative">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Instant Exchange
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Currency Converter
              </h1>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl hidden sm:inline-block">
              Zero Fee Estimate
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 relative">
            {/* Left Input: You Send */}
            <div className="w-full md:w-[46%] bg-slate-50 rounded-2xl p-4 md:p-5 border border-slate-200/80 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                You Send
              </label>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 shrink-0">
                  <CurrencyFlag code={fromCode} size={32} />
                  <span className="text-xl font-bold text-slate-900">{fromCode}</span>
                </div>
                <input
                  type="number"
                  step="any"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent text-2xl md:text-3xl font-bold text-right text-slate-900 outline-none border-none p-0 focus:ring-0"
                />
              </div>
            </div>

            {/* Swap Button */}
            <button
              onClick={handleSwap}
              aria-label="Swap currencies"
              className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl p-3.5 shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center shrink-0 cursor-pointer"
            >
              <ArrowLeftRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Right Input: You Receive */}
            <div className="w-full md:w-[46%] bg-slate-50 rounded-2xl p-4 md:p-5 border border-slate-200/80 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all relative">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                You Receive
              </label>
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 hover:bg-slate-200/70 px-2 py-1 -ml-2 rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  <CurrencyFlag code={toCode} size={32} />
                  <span className="text-xl font-bold text-slate-900 flex items-center">
                    {toCode}
                    <ChevronDown className="w-4 h-4 ml-1 text-slate-400" />
                  </span>
                </button>

                <input
                  type="text"
                  readOnly
                  value={receiveAmount}
                  placeholder="0.00"
                  className="w-full bg-transparent text-2xl md:text-3xl font-bold text-right text-slate-900 outline-none border-none p-0 focus:ring-0 cursor-default"
                />
              </div>

              {/* Currency Selector Dropdown */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-68 max-h-64 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5 border-b border-slate-100 mb-1">
                    Select Currency
                  </div>
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setToCode(curr.code);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer ${
                        toCode === curr.code ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CurrencyFlag code={curr.code} size={22} />
                        <div>
                          <div className="text-sm font-semibold">{curr.code}</div>
                          <div className="text-xs text-slate-400">{curr.name}</div>
                        </div>
                      </div>
                      {toCode === curr.code && <Check className="w-4 h-4 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Rate Detail & Convert Button */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-2 pt-4 border-t border-slate-100 gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm md:text-base font-bold text-slate-800">
                1 {fromCode} = {rate < 0.01 ? rate.toFixed(6) : rate.toFixed(4)} {toCode}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center justify-center md:justify-start gap-1">
                Mid-market rate • Last updated {lastUpdatedMin} mins ago
                <button
                  onClick={() => setLastUpdatedMin(1)}
                  title="Refresh rate"
                  className="hover:text-indigo-600 p-0.5 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </p>
            </div>

            <button
              onClick={handleConvertNow}
              className="w-full md:w-auto bg-indigo-600 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              {justConverted ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  Conversion Saved!
                </>
              ) : (
                'Convert Now'
              )}
            </button>
          </div>
        </div>

        {/* Bottom Section: Quick Alert & Recent Conversions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Alert Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex items-start gap-4">
            <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 border border-indigo-100">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Set Alert for {activeForeignCurrency.code}/SGD
              </h3>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Receive instant notifications when rates cross your target threshold.
              </p>
              <button
                onClick={() =>
                  onNavigateToAlerts(
                    activeForeignCurrency.code,
                    activeForeignCurrency.rateToSGD
                  )
                }
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors cursor-pointer group"
              >
                Create Price Alert{' '}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Recent Conversions */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Recent Conversions</span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">History</span>
            </h3>
            <ul className="flex flex-col gap-2">
              {recentConversions.slice(0, 3).map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <span>
                      {item.fromAmount.toLocaleString()} {item.fromCode}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span>
                      {item.toAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      {item.toCode}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">{item.relativeTime}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
