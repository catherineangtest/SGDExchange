import React, { useState, useEffect } from 'react';
import {
  Bell,
  ArrowUp,
  Trash2,
  Edit2,
  BellOff,
  ChevronDown,
  CheckCircle2,
  X,
  ArrowLeftRight,
} from 'lucide-react';
import { AlertItem, CurrencyItem, PairDirection } from '../types';

interface AlertsViewProps {
  alerts: AlertItem[];
  currencies: CurrencyItem[];
  prefilledCurrency?: string;
  prefilledRate?: number;
  prefilledDirection?: PairDirection;
  onAddAlert: (alert: Omit<AlertItem, 'id' | 'createdAt'>) => void;
  onUpdateAlert: (alert: AlertItem) => void;
  onDeleteAlert: (id: string) => void;
  onReactivateAlert: (id: string) => void;
  onTriggerSimulatedNotification?: (message: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  currencies,
  prefilledCurrency = 'USD',
  prefilledRate,
  prefilledDirection = 'foreign_to_sgd',
  onAddAlert,
  onUpdateAlert,
  onDeleteAlert,
  onReactivateAlert,
}) => {
  const [direction, setDirection] = useState<PairDirection>(prefilledDirection);
  const [selectedPair, setSelectedPair] = useState<string>(prefilledCurrency);
  const [condition, setCondition] = useState<'rises' | 'falls' | 'high_1y' | 'low_1y'>('rises');
  const [targetRate, setTargetRate] = useState<string>(
    prefilledRate ? prefilledRate.toString() : '1.3600'
  );
  const [editingAlertId, setEditingAlertId] = useState<string | null>(null);
  const [justCreated, setJustCreated] = useState(false);
  const [filterDirection, setFilterDirection] = useState<'all' | PairDirection>('all');

  // Synchronize when prefilled parameters change
  useEffect(() => {
    if (prefilledCurrency) {
      setSelectedPair(prefilledCurrency);
      const curr = currencies.find((c) => c.code === prefilledCurrency);
      if (curr) {
        if (prefilledDirection === 'sgd_to_foreign') {
          setDirection('sgd_to_foreign');
          const invRate = 1 / curr.rateToSGD;
          setTargetRate(prefilledRate ? prefilledRate.toString() : (invRate * 1.01).toFixed(4));
        } else {
          setDirection('foreign_to_sgd');
          setTargetRate(prefilledRate ? prefilledRate.toString() : (curr.rateToSGD * 1.01).toFixed(4));
        }
      }
    }
  }, [prefilledCurrency, prefilledRate, prefilledDirection, currencies]);

  // Current selected currency data
  const currentSelectedCurrency = currencies.find((c) => c.code === selectedPair) || currencies[0];
  const liveRateForeignToSgd = currentSelectedCurrency ? currentSelectedCurrency.rateToSGD : 1.3452;
  const liveRateSgdToForeign = currentSelectedCurrency ? 1 / currentSelectedCurrency.rateToSGD : 0.7434;

  const currentLiveRate = direction === 'foreign_to_sgd' ? liveRateForeignToSgd : liveRateSgdToForeign;

  // Handle switching direction in the form
  const handleDirectionChange = (newDir: PairDirection) => {
    setDirection(newDir);
    const curr = currencies.find((c) => c.code === selectedPair) || currencies[0];
    if (curr) {
      if (newDir === 'sgd_to_foreign') {
        const invRate = 1 / curr.rateToSGD;
        const newTarget = condition === 'rises' ? invRate * 1.015 : invRate * 0.985;
        setTargetRate(invRate >= 100 ? newTarget.toFixed(2) : newTarget.toFixed(4));
      } else {
        const newTarget = condition === 'rises' ? curr.rateToSGD * 1.015 : curr.rateToSGD * 0.985;
        setTargetRate(curr.rateToSGD < 0.01 ? newTarget.toFixed(5) : newTarget.toFixed(4));
      }
    }
  };

  // Handle Currency change in form
  const handleCurrencyChange = (newCode: string) => {
    setSelectedPair(newCode);
    const curr = currencies.find((c) => c.code === newCode);
    if (curr) {
      if (direction === 'sgd_to_foreign') {
        const invRate = 1 / curr.rateToSGD;
        const rate = condition === 'rises' ? invRate * 1.015 : invRate * 0.985;
        setTargetRate(invRate >= 100 ? rate.toFixed(2) : rate.toFixed(4));
      } else {
        const rate = condition === 'rises' ? curr.rateToSGD * 1.015 : curr.rateToSGD * 0.985;
        setTargetRate(curr.rateToSGD < 0.01 ? rate.toFixed(5) : rate.toFixed(4));
      }
    }
  };

  const handleEditClick = (alert: AlertItem) => {
    const alertDir = alert.direction || (alert.baseCurrency === 'SGD' ? 'sgd_to_foreign' : 'foreign_to_sgd');
    setEditingAlertId(alert.id);
    setDirection(alertDir);
    setSelectedPair(alert.currencyCode);
    setCondition(alert.condition);
    setTargetRate(alert.targetRate.toString());
  };

  const handleCancelEdit = () => {
    setEditingAlertId(null);
    setDirection('foreign_to_sgd');
    setSelectedPair('USD');
    setCondition('rises');
    setTargetRate('1.3600');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rateNum = parseFloat(targetRate);
    if (isNaN(rateNum) || rateNum <= 0) return;

    const baseCurrency = direction === 'sgd_to_foreign' ? 'SGD' : selectedPair;
    const targetCurrency = direction === 'sgd_to_foreign' ? selectedPair : 'SGD';

    if (editingAlertId) {
      const existing = alerts.find((a) => a.id === editingAlertId);
      if (existing) {
        onUpdateAlert({
          ...existing,
          currencyCode: selectedPair,
          baseCurrency,
          targetCurrency,
          direction,
          condition,
          targetRate: rateNum,
          status: 'active',
        });
      }
      setEditingAlertId(null);
    } else {
      onAddAlert({
        currencyCode: selectedPair,
        baseCurrency,
        targetCurrency,
        direction,
        condition,
        targetRate: rateNum,
        status: 'active',
      });
    }

    setJustCreated(true);
    setTimeout(() => setJustCreated(false), 2000);
  };

  const getAlertDirection = (alert: AlertItem): PairDirection => {
    if (alert.direction) return alert.direction;
    if (alert.baseCurrency === 'SGD' || (alert.targetCurrency && alert.targetCurrency !== 'SGD')) {
      return 'sgd_to_foreign';
    }
    return 'foreign_to_sgd';
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filterDirection === 'all') return true;
    return getAlertDirection(alert) === filterDirection;
  });

  const activeAlertsCount = alerts.filter((a) => a.status === 'active').length;
  const foreignToSgdCount = alerts.filter((a) => getAlertDirection(a) === 'foreign_to_sgd').length;
  const sgdToForeignCount = alerts.filter((a) => getAlertDirection(a) === 'sgd_to_foreign').length;

  const getConditionLabel = (cond: string) => {
    switch (cond) {
      case 'rises':
        return 'Rises Above';
      case 'falls':
        return 'Falls Below';
      case 'high_1y':
        return 'Hits 1-Year High';
      case 'low_1y':
        return 'Hits 1-Year Low';
      default:
        return 'Rises Above';
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-12 py-8 md:py-12 space-y-8 md:space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Notification Engine
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Alerts Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure triggers for both Foreign/SGD and SGD/Foreign exchange rates
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Active Alerts List */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900">Your Configured Triggers</h2>
              <span className="text-xs font-bold bg-indigo-600 text-white px-2.5 py-0.5 rounded-xl shadow-xs shadow-indigo-200">
                {activeAlertsCount} Active
              </span>
            </div>

            {/* Direction Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setFilterDirection('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterDirection === 'all'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All ({alerts.length})
              </button>
              <button
                onClick={() => setFilterDirection('foreign_to_sgd')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterDirection === 'foreign_to_sgd'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Foreign/SGD ({foreignToSgdCount})
              </button>
              <button
                onClick={() => setFilterDirection('sgd_to_foreign')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterDirection === 'sgd_to_foreign'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                SGD/Foreign ({sgdToForeignCount})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-400">
                {alerts.length === 0
                  ? 'No alerts configured yet. Create one on the right to get started.'
                  : 'No alerts found in this direction filter.'}
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const isActive = alert.status === 'active';
                const alertDir = getAlertDirection(alert);
                const isSgdBase = alertDir === 'sgd_to_foreign';
                const foreignCode = alert.currencyCode;
                const currItem = currencies.find((c) => c.code === foreignCode);

                const currentLive = currItem
                  ? isSgdBase
                    ? 1 / currItem.rateToSGD
                    : currItem.rateToSGD
                  : 1;

                const pairDisplay = isSgdBase ? `SGD / ${foreignCode}` : `${foreignCode} / SGD`;
                const quoteSymbol = isSgdBase ? foreignCode : 'SGD';

                return (
                  <div
                    key={alert.id}
                    className={`border rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 ${
                      isActive
                        ? 'bg-white border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-200'
                        : 'bg-slate-50/80 border-slate-200 opacity-80'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Currency badge circle */}
                      <div
                        className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center font-bold text-xs shrink-0 border ${
                          isActive
                            ? 'bg-indigo-50 border-indigo-100 text-indigo-700'
                            : 'bg-slate-100 border-slate-200 text-slate-400'
                        }`}
                      >
                        <span>{isSgdBase ? 'SGD' : foreignCode}</span>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3
                            className={`text-base md:text-lg font-bold text-slate-900 ${
                              !isActive ? 'line-through decoration-slate-400' : ''
                            }`}
                          >
                            {pairDisplay}
                          </h3>

                          {/* Direction Chip */}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                            {isSgdBase ? 'SGD → Foreign' : 'Foreign → SGD'}
                          </span>

                          {isActive ? (
                            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                              <ArrowUp className="w-3 h-3 stroke-[2.5]" /> Active
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-500 border border-slate-200 text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                              <BellOff className="w-3 h-3" /> Triggered
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
                          <span>Condition: {getConditionLabel(alert.condition)}</span>
                          <strong className="text-slate-900 font-bold text-sm ml-0.5">
                            {alert.targetRate.toFixed(alert.targetRate >= 100 ? 2 : 4)} {quoteSymbol}
                          </strong>
                          <span className="text-slate-400 font-medium">
                            (Live: {currentLive.toFixed(currentLive >= 100 ? 2 : 4)})
                          </span>
                        </p>

                        {!isActive && alert.triggeredAt && (
                          <p className="text-[11px] text-slate-400 mt-1">
                            Triggered on {alert.triggeredAt}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {isActive ? (
                        <button
                          onClick={() => handleEditClick(alert)}
                          aria-label="Edit Alert"
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onReactivateAlert(alert.id)}
                          aria-label="Reactivate Alert"
                          className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer border border-indigo-100"
                        >
                          Reactivate
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteAlert(alert.id)}
                        aria-label="Delete Alert"
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Right Column: Set New Alert Form */}
        <section className="lg:col-span-5">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {editingAlertId ? 'Edit Rate Alert' : 'Create Rate Alert'}
              </h2>
              {editingAlertId && (
                <button
                  onClick={handleCancelEdit}
                  className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Pair Direction Switcher */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Rate Pair Direction
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleDirectionChange('foreign_to_sgd')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                      direction === 'foreign_to_sgd'
                        ? 'bg-white text-indigo-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Foreign / SGD (e.g. USD/SGD)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDirectionChange('sgd_to_foreign')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                      direction === 'sgd_to_foreign'
                        ? 'bg-white text-indigo-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ArrowLeftRight className="w-3 h-3" />
                    SGD / Foreign (e.g. SGD/USD)
                  </button>
                </div>
              </div>

              {/* Currency Pair */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {direction === 'foreign_to_sgd' ? 'Foreign Currency' : 'Target Foreign Currency'}
                </label>
                <div className="relative">
                  <select
                    value={selectedPair}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all cursor-pointer"
                  >
                    {currencies.map((c) => {
                      const label =
                        direction === 'foreign_to_sgd'
                          ? `${c.code} / SGD — ${c.name}`
                          : `SGD / ${c.code} — ${c.name}`;
                      return (
                        <option key={c.code} value={c.code}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Condition */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Trigger Condition
                </label>
                <div className="relative">
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all cursor-pointer"
                  >
                    <option value="rises">Rises Above</option>
                    <option value="falls">Falls Below</option>
                    <option value="high_1y">Hits 1-Year High</option>
                    <option value="low_1y">Hits 1-Year Low</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Target Rate */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-bold text-slate-700">
                    Target Rate ({direction === 'foreign_to_sgd' ? 'SGD' : selectedPair})
                  </label>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Live: {currentLiveRate.toFixed(currentLiveRate >= 100 ? 2 : 4)}{' '}
                    {direction === 'foreign_to_sgd' ? 'SGD' : selectedPair}
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-xs font-bold text-slate-400">
                    {direction === 'foreign_to_sgd' ? 'S$' : currentSelectedCurrency.symbol || selectedPair}
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={targetRate}
                    onChange={(e) => setTargetRate(e.target.value)}
                    placeholder={direction === 'foreign_to_sgd' ? '1.3600' : '0.7500'}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 mt-1 border-t border-slate-100">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-[0.99] transition-all cursor-pointer"
                >
                  {justCreated ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      Alert Saved!
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4 fill-white text-transparent" />
                      {editingAlertId ? 'Update Alert' : 'Create Alert'}
                    </>
                  )}
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-3">
                  You will receive an instant notification when {direction === 'foreign_to_sgd' ? `${selectedPair}/SGD` : `SGD/${selectedPair}`} crosses your target rate.
                </p>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};
