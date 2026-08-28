import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, FileText, Database, User, CheckCircle2, AlertCircle, RefreshCw, Key } from 'lucide-react';
import { checkMasApiStatus, MasApiStatus } from '../services/masApi';

interface InfoModalProps {
  type: 'terms' | 'privacy' | 'datasource' | 'profile' | null;
  onClose: () => void;
}

export const InfoModals: React.FC<InfoModalProps> = ({ type, onClose }) => {
  const [masStatus, setMasStatus] = useState<MasApiStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    if (type === 'datasource') {
      setLoadingStatus(true);
      checkMasApiStatus()
        .then((status) => setMasStatus(status))
        .finally(() => setLoadingStatus(false));
    }
  }, [type]);

  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            {type === 'terms' && <FileText className="w-5 h-5 text-indigo-600" />}
            {type === 'privacy' && <ShieldCheck className="w-5 h-5 text-emerald-600" />}
            {type === 'datasource' && <Database className="w-5 h-5 text-indigo-600" />}
            {type === 'profile' && <User className="w-5 h-5 text-indigo-600" />}
            <h2 className="text-xl font-extrabold text-slate-900">
              {type === 'terms' && 'Terms of Service'}
              {type === 'privacy' && 'Privacy Policy'}
              {type === 'datasource' && 'Data Source & MAS API'}
              {type === 'profile' && 'User Account & Preferences'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 text-sm text-slate-600 leading-relaxed space-y-4">
          {type === 'terms' && (
            <>
              <p>
                Welcome to <strong>SGD Exchange</strong>. By using this service, you agree to comply with our institutional financial data dissemination standards.
              </p>
              <p>
                <strong className="text-slate-900">1. Indicative Rates:</strong> All foreign exchange rates displayed are indicative benchmark rates. Actual execution rates with your bank or liquidity provider may vary.
              </p>
              <p>
                <strong className="text-slate-900">2. Rate Alerts:</strong> Notifications are generated based on real-time market feeds. SGD Exchange is not liable for market slippage during fast-moving events.
              </p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <p>
                At <strong>SGD Exchange</strong>, we maintain stringent confidentiality of your target rates, conversion histories, and device tokens.
              </p>
              <p>
                <strong className="text-slate-900">Data Minimization:</strong> Conversion histories and customized alert thresholds are stored locally on your device by default. No personal banking credentials or confidential transaction records are collected.
              </p>
            </>
          )}

          {type === 'datasource' && (
            <>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Monetary Authority of Singapore (MAS)
                  </div>
                  {masStatus?.isConfigured ? (
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      API Configured
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      Benchmark Mode
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600">
                  Daily SGD exchange rates (end of period) are queried via the official MAS Monthly Statistical Bulletin API Gateway:
                </p>
                <div className="p-2.5 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono break-all select-all">
                  https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610ora/exchange_rates_end_of_period_daily/views/exchange_rates_end_of_period_daily
                </div>
              </div>

              <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                  <Key className="w-4 h-4 text-indigo-600" />
                  Secure Backend Authentication
                </div>
                <p className="text-xs text-indigo-800">
                  All requests pass the mandatory <code className="font-mono bg-indigo-100/80 px-1.5 py-0.5 rounded text-indigo-900 font-bold">AccountKey</code> header directly through the secure full-stack backend endpoint (<code className="font-mono text-indigo-900 font-semibold">/api/mas/exchange-rates-daily</code>). No API keys or tokens are ever exposed to client-side code.
                </p>
              </div>

              <p className="text-xs text-slate-500">
                <strong className="text-slate-900">Update Cadence:</strong> Rates are published at the end of each business trading day by the Monetary Authority of Singapore. Historical series reflect official statutory end-of-period closing levels.
              </p>
            </>
          )}

          {type === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-indigo-200">
                  SG
                </div>
                <div>
                  <div className="font-bold text-slate-900">Singapore FX Trader</div>
                  <div className="text-xs text-slate-500">catherineanglegoo@gmail.com</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                  Default Base Currency
                </label>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-indigo-600 shadow-xs">
                  🇸🇬 SGD - Singapore Dollar
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                  Notification Delivery
                </label>
                <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl text-sm shadow-xs">
                  <span className="font-medium text-slate-700">Browser & In-App Banners</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-lg">
                    Enabled
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer shadow-xs shadow-indigo-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
