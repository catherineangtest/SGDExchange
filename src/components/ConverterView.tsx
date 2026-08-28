import React, { useState, useMemo } from 'react';
import { ArrowLeftRight, BellRing, ArrowRight, ChevronDown, Check, RefreshCw, Search, X, Trash2 } from 'lucide-react';
import { CurrencyItem, ConversionRecord } from '../types';
import { ALL_MAS_CURRENCIES } from '../data/currencies';
import { CurrencyFlag } from './CurrencyFlag';

interface ConverterViewProps {
  currencies: CurrencyItem[];
  recentConversions: ConversionRecord[];
  onAddConversion: (record: ConversionRecord) => void;
  onDeleteConversion?: (id: string) => void;
  onClearAllConversions?: () => void;
  onNavigateToAlerts: (currencyCode: string, targetRate?: number) => void;
}

interface FullCurrencyOption {
  code: string;
  name: string;
  symbol: string;
  rateToSGD: number; // SGD value of 1 unit of this currency (1.0 for SGD)
}

export const ConverterView: React.FC<ConverterViewProps> = ({
  currencies,
  recentConversions,
  onAddConversion,
  onDeleteConversion,
  onClearAllConversions,
  onNavigateToAlerts,
}) => {
  // Conversion state
  const [fromCode, setFromCode] = useState<string>('SGD');
  const [toCode, setToCode] = useState<string>('USD');
  const [sendAmount, setSendAmount] = useState<string>('1000.00');
  const [openDropdown, setOpenDropdown] = useState<'from' | 'to' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [justConverted, setJustConverted] = useState(false);
  const [lastUpdatedMin, setLastUpdatedMin] = useState(1);

  // Compile all available MAS currencies merged with any dynamic rates from active currencies
  const allAvailableCurrencies: FullCurrencyOption[] = useMemo(() => {
    const list: FullCurrencyOption[] = [
      {
        code: 'SGD',
        name: 'Singapore Dollar',
        symbol: 'S$',
        rateToSGD: 1.0,
      },
    ];

    // Build map from ALL_MAS_CURRENCIES
    const map = new Map<string, FullCurrencyOption>();
    ALL_MAS_CURRENCIES.forEach((c) => {
      map.set(c.code, {
        code: c.code,
        name: c.name,
        symbol: c.symbol,
        rateToSGD: c.rateToSGD,
      });
    });

    // Override with any live/custom currencies from props
    currencies.forEach((c) => {
      if (c.code !== 'SGD') {
        map.set(c.code, {
          code: c.code,
          name: c.name,
          symbol: c.symbol,
          rateToSGD: c.rateToSGD,
        });
      }
    });

    map.forEach((value) => {
      list.push(value);
    });

    return list;
  }, [currencies]);

  // Calculate conversion exchange rate
  const getRate = (from: string, to: string): number => {
    if (from === to) return 1;
    const fromCurr = allAvailableCurrencies.find((c) => c.code === from);
    const toCurr = allAvailableCurrencies.find((c) => c.code === to);

    const fromRateToSGD = from === 'SGD' ? 1.0 : fromCurr ? fromCurr.rateToSGD : 1.0;
    const toRateToSGD = to === 'SGD' ? 1.0 : toCurr ? toCurr.rateToSGD : 1.0;

    if (toRateToSGD === 0) return 1;
    return fromRateToSGD / toRateToSGD;
  };

  const currentRate = getRate(fromCode, toCode);
  const inverseRate = currentRate > 0 ? 1 / currentRate : 0;
  const numericSend = parseFloat(sendAmount) || 0;
  const calculatedReceive = (numericSend * currentRate).toFixed(
    currentRate < 0.01 ? 4 : 2
  );

  // Filter list for dropdown search
  const filteredCurrencies = useMemo(() => {
    if (!searchQuery.trim()) return allAvailableCurrencies;
    const q = searchQuery.toLowerCase().trim();
    return allAvailableCurrencies.filter(
      (c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    );
  }, [allAvailableCurrencies, searchQuery]);

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
      toAmount: parseFloat(calculatedReceive),
      rate: Number(currentRate.toFixed(4)),
      timestamp: new Date().toISOString(),
      relativeTime: 'Just now',
    };
    onAddConversion(newRecord);
    setJustConverted(true);
    setTimeout(() => setJustConverted(false), 2000);
  };

  const fromCurrencyObj = allAvailableCurrencies.find((c) => c.code === fromCode) || allAvailableCurrencies[0];
  const toCurrencyObj = allAvailableCurrencies.find((c) => c.code === toCode) || allAvailableCurrencies[1];
  const activeForeignCode = fromCode === 'SGD' ? toCode : fromCode;
  const activeForeignRate = fromCode === 'SGD' ? (toCurrencyObj ? toCurrencyObj.rateToSGD : 1) : (fromCurrencyObj ? fromCurrencyObj.rateToSGD : 1);

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
                  MAS Multi-Currency Exchange
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Currency Converter
              </h1>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl hidden sm:inline-block">
              All MAS Currencies Available ({allAvailableCurrencies.length})
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 relative">
            {/* Left Input: You Send */}
            <div className="w-full md:w-[46%] bg-slate-50 rounded-2xl p-4 md:p-5 border border-slate-200/80 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all relative">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                You Send
              </label>
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setOpenDropdown(openDropdown === 'from' ? null : 'from');
                  }}
                  className="flex items-center gap-2 hover:bg-slate-200/70 px-2 py-1 -ml-2 rounded-xl transition-colors cursor-pointer shrink-0"
                  aria-label="Select source currency"
                >
                  <CurrencyFlag code={fromCode} size={32} />
                  <span className="text-xl font-bold text-slate-900 flex items-center">
                    {fromCode}
                    <ChevronDown className="w-4 h-4 ml-1 text-slate-400" />
                  </span>
                </button>

                <input
                  type="number"
                  step="any"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent text-2xl md:text-3xl font-bold text-right text-slate-900 outline-none border-none p-0 focus:ring-0"
                />
              </div>

              {/* FROM Currency Selector Dropdown */}
              {openDropdown === 'from' && (
                <div className="absolute top-full left-0 mt-2 w-80 max-h-80 overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 flex flex-col">
                  <div className="p-3 border-b border-slate-100 bg-slate-50/70">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search currency or country..."
                        className="w-full pl-9 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                        autoFocus
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="overflow-y-auto p-2 max-h-60">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                      MAS Data Currencies ({filteredCurrencies.length})
                    </div>
                    {filteredCurrencies.map((curr) => (
                      <button
                        key={'from-' + curr.code}
                        type="button"
                        onClick={() => {
                          setFromCode(curr.code);
                          setOpenDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer ${
                          fromCode === curr.code ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CurrencyFlag code={curr.code} size={24} />
                          <div className="truncate">
                            <div className="text-sm font-semibold">{curr.code}</div>
                            <div className="text-xs text-slate-400 truncate">{curr.name}</div>
                          </div>
                        </div>
                        {fromCode === curr.code && <Check className="w-4 h-4 text-indigo-600 shrink-0 ml-2" />}
                      </button>
                    ))}
                    {filteredCurrencies.length === 0 && (
                      <div className="text-center py-6 text-xs text-slate-400">
                        No currencies match "{searchQuery}"
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                  onClick={() => {
                    setSearchQuery('');
                    setOpenDropdown(openDropdown === 'to' ? null : 'to');
                  }}
                  className="flex items-center gap-2 hover:bg-slate-200/70 px-2 py-1 -ml-2 rounded-xl transition-colors cursor-pointer shrink-0"
                  aria-label="Select target currency"
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
                  value={calculatedReceive}
                  placeholder="0.00"
                  className="w-full bg-transparent text-2xl md:text-3xl font-bold text-right text-slate-900 outline-none border-none p-0 focus:ring-0 cursor-default"
                />
              </div>

              {/* TO Currency Selector Dropdown */}
              {openDropdown === 'to' && (
                <div className="absolute top-full right-0 mt-2 w-80 max-h-80 overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 flex flex-col">
                  <div className="p-3 border-b border-slate-100 bg-slate-50/70">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search currency or country..."
                        className="w-full pl-9 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                        autoFocus
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="overflow-y-auto p-2 max-h-60">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                      MAS Data Currencies ({filteredCurrencies.length})
                    </div>
                    {filteredCurrencies.map((curr) => (
                      <button
                        key={'to-' + curr.code}
                        type="button"
                        onClick={() => {
                          setToCode(curr.code);
                          setOpenDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer ${
                          toCode === curr.code ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CurrencyFlag code={curr.code} size={24} />
                          <div className="truncate">
                            <div className="text-sm font-semibold">{curr.code}</div>
                            <div className="text-xs text-slate-400 truncate">{curr.name}</div>
                          </div>
                        </div>
                        {toCode === curr.code && <Check className="w-4 h-4 text-indigo-600 shrink-0 ml-2" />}
                      </button>
                    ))}
                    {filteredCurrencies.length === 0 && (
                      <div className="text-center py-6 text-xs text-slate-400">
                        No currencies match "{searchQuery}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rate Detail & Convert Button */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-2 pt-4 border-t border-slate-100 gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm md:text-base font-bold text-slate-800">
                1 {fromCode} = {currentRate < 0.01 ? currentRate.toFixed(6) : currentRate.toFixed(4)} {toCode}
                <span className="text-xs font-normal text-slate-400 ml-2">
                  (1 {toCode} = {inverseRate < 0.01 ? inverseRate.toFixed(6) : inverseRate.toFixed(4)} {fromCode})
                </span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center justify-center md:justify-start gap-1">
                MAS End-of-Day closing benchmark rate • Updated {lastUpdatedMin} min ago
                <button
                  onClick={() => setLastUpdatedMin(1)}
                  title="Refresh rate"
                  className="hover:text-indigo-600 p-0.5 transition-colors cursor-pointer"
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
                'Save Conversion'
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
                Set Alert for {activeForeignCode}/SGD
              </h3>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Receive instant notifications when MAS end of period rates cross your target threshold.
              </p>
              <button
                onClick={() =>
                  onNavigateToAlerts(
                    activeForeignCode,
                    activeForeignRate
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
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Recent Conversions
              </h3>
              <div className="flex items-center gap-2">
                {recentConversions.length > 0 && onClearAllConversions && (
                  <button
                    onClick={onClearAllConversions}
                    className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 transition-colors px-2 py-0.5 rounded hover:bg-rose-50 cursor-pointer"
                    title="Clear all recent conversions"
                  >
                    Clear all
                  </button>
                )}
                <span className="text-[11px] font-semibold text-slate-400 uppercase">
                  History
                </span>
              </div>
            </div>

            {recentConversions.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No conversions recorded yet</p>
            ) : (
              <ul className="flex flex-col gap-1 max-h-[260px] overflow-y-auto pr-1 divide-y divide-slate-100">
                {recentConversions.map((item) => (
                  <li
                    key={item.id}
                    className="group flex justify-between items-center py-2.5 transition-colors hover:bg-slate-50/80 px-1.5 rounded-lg"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 flex-wrap">
                      <span>
                        {item.fromAmount.toLocaleString()} {item.fromCode}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>
                        {item.toAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: item.rate < 0.01 ? 4 : 2,
                        })}{' '}
                        {item.toCode}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[11px] text-slate-400">{item.relativeTime}</span>
                      {onDeleteConversion && (
                        <button
                          onClick={() => onDeleteConversion(item.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete conversion"
                          aria-label={`Delete conversion of ${item.fromAmount} ${item.fromCode} to ${item.toCode}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
