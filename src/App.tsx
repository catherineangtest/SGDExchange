/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType, CurrencyItem, AlertItem, ConversionRecord, PairDirection } from './types';
import {
  INITIAL_CURRENCIES,
  INITIAL_ALERTS,
  INITIAL_RECENT_CONVERSIONS,
} from './data/currencies';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NotificationBanner } from './components/NotificationBanner';
import { DashboardView } from './components/DashboardView';
import { ConverterView } from './components/ConverterView';
import { AnalysisView } from './components/AnalysisView';
import { AlertsView } from './components/AlertsView';
import { CommunityView } from './components/CommunityView';
import { AddCurrencyModal } from './components/AddCurrencyModal';
import { InfoModals } from './components/InfoModals';
import { fetchMasDailyRates, checkMasApiStatus, MasApiStatus } from './services/masApi';

export default function App() {
  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');

  // Backend MAS API status state
  const [masStatus, setMasStatus] = useState<MasApiStatus | null>(null);
  const [isLiveMasSync, setIsLiveMasSync] = useState<boolean>(false);

  // Currencies state
  const [currencies, setCurrencies] = useState<CurrencyItem[]>(() => {
    try {
      const saved = localStorage.getItem('sgd_currencies');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_CURRENCIES;
  });

  // Selected currency for detailed analysis view
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyItem>(
    currencies[0] || INITIAL_CURRENCIES[0]
  );

  // Initial load: Attempt syncing with backend MAS Exchange Rates API
  useEffect(() => {
    async function syncMasRates() {
      try {
        const status = await checkMasApiStatus();
        setMasStatus(status);

        const result = await fetchMasDailyRates(30);
        if (result.success && result.extractedRates && Object.keys(result.extractedRates).length > 0) {
          setIsLiveMasSync(true);
          const liveRates = result.extractedRates;

          setCurrencies((prevCurrencies) => {
            return prevCurrencies.map((curr) => {
              if (liveRates[curr.code] && liveRates[curr.code] > 0) {
                const newRate = liveRates[curr.code];
                const oldRate = curr.rateToSGD;
                const changeAmount = Number((newRate - oldRate).toFixed(4));
                const changePercent = Number(((changeAmount / (oldRate || 1)) * 100).toFixed(2));

                return {
                  ...curr,
                  rateToSGD: newRate,
                  changeAmount,
                  changePercent,
                };
              }
              return curr;
            });
          });
        }
      } catch (err) {
        console.warn('MAS API sync note:', err);
      }
    }

    syncMasRates();
  }, []);

  // Alerts state
  const [alerts, setAlerts] = useState<AlertItem[]>(() => {
    try {
      const saved = localStorage.getItem('sgd_alerts');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ALERTS;
  });

  // Recent conversions state
  const [recentConversions, setRecentConversions] = useState<ConversionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sgd_recent_conversions');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_RECENT_CONVERSIONS;
  });

  // Prefilled parameters for alerts form
  const [prefilledAlertPair, setPrefilledAlertPair] = useState<string>('USD');
  const [prefilledAlertRate, setPrefilledAlertRate] = useState<number | undefined>(1.3600);
  const [prefilledAlertDirection, setPrefilledAlertDirection] = useState<PairDirection>('foreign_to_sgd');

  // Floating notification banner state
  const [bannerVisible, setBannerVisible] = useState<boolean>(true);
  const [bannerMessage, setBannerMessage] = useState<string>(
    'USD/SGD hit 1.35 — your target rate.'
  );

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState<
    'terms' | 'privacy' | 'datasource' | 'profile' | null
  >(null);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sgd_currencies', JSON.stringify(currencies));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [currencies]);

  useEffect(() => {
    try {
      localStorage.setItem('sgd_alerts', JSON.stringify(alerts));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [alerts]);

  useEffect(() => {
    try {
      localStorage.setItem('sgd_recent_conversions', JSON.stringify(recentConversions));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [recentConversions]);

  // Handlers
  const handleSelectCurrencyForAnalysis = (curr: CurrencyItem) => {
    setSelectedCurrency(curr);
    setCurrentTab('analysis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAddCurrency = () => {
    setIsAddModalOpen(true);
  };

  const handleAddCurrencyItem = (newCurr: CurrencyItem) => {
    if (!currencies.some((c) => c.code === newCurr.code)) {
      setCurrencies([...currencies, newCurr]);
    }
  };

  const handleDeleteCurrency = (currencyCode: string) => {
    setCurrencies((prev) => {
      const updated = prev.filter((c) => c.code !== currencyCode);
      if (selectedCurrency.code === currencyCode && updated.length > 0) {
        setSelectedCurrency(updated[0]);
      }
      return updated;
    });
  };

  const handleResetDefaultCurrencies = () => {
    setCurrencies(INITIAL_CURRENCIES);
    setSelectedCurrency(INITIAL_CURRENCIES[0]);
  };

  const handleNavigateToAlerts = (
    currencyCode: string,
    targetRate?: number,
    direction: PairDirection = 'foreign_to_sgd'
  ) => {
    setPrefilledAlertPair(currencyCode);
    setPrefilledAlertRate(targetRate);
    setPrefilledAlertDirection(direction);
    setCurrentTab('alerts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddAlert = (alertData: Omit<AlertItem, 'id' | 'createdAt'>) => {
    const newAlert: AlertItem = {
      ...alertData,
      id: 'alert-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setAlerts([newAlert, ...alerts]);
  };

  const handleUpdateAlert = (updatedAlert: AlertItem) => {
    setAlerts(alerts.map((a) => (a.id === updatedAlert.id ? updatedAlert : a)));
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const handleReactivateAlert = (id: string) => {
    setAlerts(
      alerts.map((a) =>
        a.id === id ? { ...a, status: 'active', triggeredAt: undefined } : a
      )
    );
  };

  const handleAddConversion = (record: ConversionRecord) => {
    setRecentConversions([record, ...recentConversions]);
  };

  const handleTriggerSimulatedNotification = (message: string) => {
    setBannerMessage(message);
    setBannerVisible(true);
  };

  const activeAlertsCount = alerts.filter((a) => a.status === 'active').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased pt-16 pb-20 md:pb-0 relative selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sleek Dot Grid Pattern Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-40 sleek-dot-grid"
        aria-hidden="true"
      />

      {/* Top Navbar & Mobile Bottom Nav */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenProfile={() => setActiveInfoModal('profile')}
        activeAlertsCount={activeAlertsCount}
      />

      {/* Main Tab Views */}
      <main className="flex-grow relative z-10">
        {currentTab === 'dashboard' && (
          <DashboardView
            currencies={currencies}
            isLiveMasSync={isLiveMasSync}
            onOpenDataSource={() => setActiveInfoModal('datasource')}
            onSelectCurrency={handleSelectCurrencyForAnalysis}
            onOpenAddCurrency={handleOpenAddCurrency}
            onDeleteCurrency={handleDeleteCurrency}
            onResetDefaultCurrencies={handleResetDefaultCurrencies}
            onQuickAlert={(curr, direction) =>
              handleNavigateToAlerts(
                curr.code,
                direction === 'sgd_to_foreign' ? 1 / curr.rateToSGD : curr.rateToSGD,
                direction
              )
            }
          />
        )}

        {currentTab === 'converter' && (
          <ConverterView
            currencies={currencies}
            recentConversions={recentConversions}
            onAddConversion={handleAddConversion}
            onNavigateToAlerts={(code, rate) => handleNavigateToAlerts(code, rate, 'foreign_to_sgd')}
          />
        )}

        {currentTab === 'analysis' && (
          <AnalysisView
            currency={selectedCurrency}
            allCurrencies={currencies}
            onBackToDashboard={() => setCurrentTab('dashboard')}
            onSetAlert={(code, rate, dir) => handleNavigateToAlerts(code, rate, dir)}
            onSelectAnotherCurrency={(code) => {
              const found = currencies.find((c) => c.code === code);
              if (found) setSelectedCurrency(found);
            }}
          />
        )}

        {currentTab === 'alerts' && (
          <AlertsView
            alerts={alerts}
            currencies={currencies}
            prefilledCurrency={prefilledAlertPair}
            prefilledRate={prefilledAlertRate}
            prefilledDirection={prefilledAlertDirection}
            onAddAlert={handleAddAlert}
            onUpdateAlert={handleUpdateAlert}
            onDeleteAlert={handleDeleteAlert}
            onReactivateAlert={handleReactivateAlert}
          />
        )}

        {currentTab === 'community' && (
          <CommunityView />
        )}
      </main>

      {/* Floating Rate Alert Banner */}
      <NotificationBanner
        visible={bannerVisible}
        message={bannerMessage}
        onDismiss={() => setBannerVisible(false)}
        actionText="View Alert"
        onAction={() => {
          setCurrentTab('alerts');
          setBannerVisible(false);
        }}
      />

      {/* Footer */}
      <Footer
        onOpenTerms={() => setActiveInfoModal('terms')}
        onOpenPrivacy={() => setActiveInfoModal('privacy')}
        onOpenDataSource={() => setActiveInfoModal('datasource')}
      />

      {/* Add Currency Modal */}
      <AddCurrencyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        existingCodes={currencies.map((c) => c.code)}
        onAddCurrency={handleAddCurrencyItem}
      />

      {/* Terms, Privacy, Data Source & Profile Modals */}
      <InfoModals
        type={activeInfoModal}
        onClose={() => setActiveInfoModal(null)}
      />
    </div>
  );
}
