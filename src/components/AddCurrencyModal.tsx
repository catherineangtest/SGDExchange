import React, { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { CurrencyItem } from '../types';
import { ALL_MAS_CURRENCIES, buildCompleteCurrency } from '../data/currencies';
import { CurrencyFlag } from './CurrencyFlag';

interface AddCurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingCodes: string[];
  onAddCurrency: (currency: CurrencyItem) => void;
}

export const AddCurrencyModal: React.FC<AddCurrencyModalProps> = ({
  isOpen,
  onClose,
  existingCodes,
  onAddCurrency,
}) => {
  const [customCode, setCustomCode] = useState('');
  const [customName, setCustomName] = useState('');
  const [customRate, setCustomRate] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  if (!isOpen) return null;

  const handleAddPreset = (preset: typeof ALL_MAS_CURRENCIES[0]) => {
    const full = buildCompleteCurrency(preset);
    onAddCurrency(full);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCode || !customRate) return;
    const rate = parseFloat(customRate);
    if (isNaN(rate) || rate <= 0) return;

    const newCurr: CurrencyItem = {
      code: customCode.toUpperCase().slice(0, 4),
      name: customName || `${customCode.toUpperCase()} Currency`,
      symbol: '$',
      rateToSGD: rate,
      changePercent: 0.1,
      changeAmount: rate * 0.001,
      sparkline: [40, 45, 50, 48, 52, 58, 62, 65, 70, 75, 80, 85],
      historical30d: [],
      historical90d: [],
      high30d: rate * 1.02,
      low30d: rate * 0.98,
      avg30d: rate,
      high90d: rate * 1.05,
      low90d: rate * 0.95,
      avg90d: rate,
    };

    onAddCurrency(buildCompleteCurrency(newCurr));
    setCustomCode('');
    setCustomName('');
    setCustomRate('');
    setShowCustomForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Add Currency Pair</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select popular international currencies to track against SGD
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset List */}
        <div className="py-4 space-y-2.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Available World Currencies
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {ALL_MAS_CURRENCIES.map((curr) => {
              const alreadyAdded = existingCodes.includes(curr.code);

              return (
                <div
                  key={curr.code}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    alreadyAdded
                      ? 'bg-slate-50 border-slate-200/80 opacity-60'
                      : 'bg-white border-slate-200/90 hover:border-indigo-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CurrencyFlag code={curr.code} size={32} />
                    <div>
                      <div className="font-bold text-sm text-slate-900">
                        {curr.code}/SGD
                      </div>
                      <div className="text-xs text-slate-500">{curr.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-sm text-slate-900">
                        {curr.rateToSGD.toFixed(curr.rateToSGD < 0.01 ? 5 : 4)}
                      </div>
                      <div
                        className={`text-[11px] font-semibold ${
                          curr.changePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {curr.changePercent >= 0 ? `+${curr.changePercent}%` : `${curr.changePercent}%`}
                      </div>
                    </div>

                    {alreadyAdded ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-xl">
                        <Check className="w-3.5 h-3.5" /> Added
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddPreset(curr)}
                        className="bg-indigo-600 text-white hover:bg-indigo-700 p-2 rounded-xl transition-colors cursor-pointer shadow-xs shadow-indigo-200"
                        title={`Add ${curr.code}/SGD`}
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Currency Form Toggle */}
        <div className="mt-2 pt-4 border-t border-slate-100">
          {!showCustomForm ? (
            <button
              onClick={() => setShowCustomForm(true)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 cursor-pointer py-1"
            >
              <Plus className="w-3.5 h-3.5" /> Or add a custom currency code
            </button>
          ) : (
            <form onSubmit={handleCreateCustom} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="text-xs font-bold text-slate-900">Add Custom Currency</div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Code (e.g. SEK)"
                  value={customCode}
                  maxLength={4}
                  onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                  required
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />
                <input
                  type="number"
                  step="0.0001"
                  placeholder="Rate to SGD (e.g. 0.13)"
                  value={customRate}
                  onChange={(e) => setCustomRate(e.target.value)}
                  required
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <input
                type="text"
                placeholder="Currency Name (e.g. Swedish Krona)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCustomForm(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-xs shadow-indigo-200 cursor-pointer"
                >
                  Add Pair
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
