/**
 * Client service to communicate with backend MAS Exchange Rates API proxy
 */

export interface MasApiStatus {
  service: string;
  endpoint: string;
  isConfigured: boolean;
  status: 'ready' | 'awaiting_credential';
}

export interface MasApiResponse {
  success: boolean;
  isLive: boolean;
  error?: string;
  statusText?: string;
  data?: any;
  extractedRates?: Record<string, number>;
}

export async function checkMasApiStatus(): Promise<MasApiStatus> {
  try {
    const res = await fetch('/api/mas/status');
    if (!res.ok) {
      return {
        service: 'Monetary Authority of Singapore (MAS) Exchange Rates Service',
        endpoint: '',
        isConfigured: false,
        status: 'awaiting_credential',
      };
    }
    return await res.json();
  } catch {
    return {
      service: 'Monetary Authority of Singapore (MAS) Exchange Rates Service',
      endpoint: '',
      isConfigured: false,
      status: 'awaiting_credential',
    };
  }
}

/**
 * Fetch daily SGD exchange rates from backend proxy
 */
export async function fetchMasDailyRates(limit = 30): Promise<MasApiResponse> {
  try {
    const res = await fetch(`/api/mas/exchange-rates-daily?rows=${limit}`);
    
    if (res.status === 500) {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        isLive: false,
        error: errData.error || 'credential not configured',
        statusText: 'ACCOUNT_KEY not configured in backend environment',
      };
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        isLive: false,
        error: errData.error || `HTTP ${res.status}`,
        statusText: `MAS API returned ${res.status}`,
      };
    }

    const json = await res.json();
    const extractedRates = extractRatesFromMasPayload(json);

    return {
      success: true,
      isLive: true,
      data: json,
      extractedRates,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network error';
    return {
      success: false,
      isLive: false,
      error: msg,
      statusText: 'Could not reach backend /api/mas/exchange-rates-daily',
    };
  }
}

/**
 * Normalizes MAS end-of-period rate records into standard rate dictionary
 */
function extractRatesFromMasPayload(payload: any): Record<string, number> {
  const rates: Record<string, number> = {};

  if (!payload) return rates;

  // Records could be in payload.result.records or payload.records or payload
  let records: any[] = [];
  if (Array.isArray(payload)) {
    records = payload;
  } else if (payload.result && Array.isArray(payload.result.records)) {
    records = payload.result.records;
  } else if (Array.isArray(payload.records)) {
    records = payload.records;
  }

  if (records.length === 0) return rates;

  // Use the latest record (usually the first or last depending on sort)
  const latest = records[0];

  const mappings: Record<string, { key: string; per100?: boolean }[]> = {
    USD: [{ key: 'usd_sgd' }, { key: 'usd' }],
    EUR: [{ key: 'eur_sgd' }, { key: 'eur' }],
    GBP: [{ key: 'gbp_sgd' }, { key: 'gbp' }],
    JPY: [{ key: 'jpy_sgd_100', per100: true }, { key: 'jpy_sgd' }, { key: 'jpy', per100: true }],
    AUD: [{ key: 'aud_sgd' }, { key: 'aud' }],
    CAD: [{ key: 'cad_sgd' }, { key: 'cad' }],
    CHF: [{ key: 'chf_sgd' }, { key: 'chf' }],
    CNY: [{ key: 'cny_sgd_100', per100: true }, { key: 'cny_sgd' }, { key: 'cny', per100: true }],
    HKD: [{ key: 'hkd_sgd_100', per100: true }, { key: 'hkd_sgd' }, { key: 'hkd', per100: true }],
    MYR: [{ key: 'myr_sgd_100', per100: true }, { key: 'myr_sgd' }, { key: 'myr', per100: true }],
    NZD: [{ key: 'nzd_sgd' }, { key: 'nzd' }],
    INR: [{ key: 'inr_sgd_100', per100: true }, { key: 'inr_sgd' }, { key: 'inr', per100: true }],
    IDR: [{ key: 'idr_sgd_100', per100: true }, { key: 'idr_sgd' }, { key: 'idr', per100: true }],
    KRW: [{ key: 'krw_sgd_100', per100: true }, { key: 'krw_sgd' }, { key: 'krw', per100: true }],
    THB: [{ key: 'thb_sgd_100', per100: true }, { key: 'thb_sgd' }, { key: 'thb', per100: true }],
    TWD: [{ key: 'twd_sgd_100', per100: true }, { key: 'twd_sgd' }, { key: 'twd', per100: true }],
    SEK: [{ key: 'sek_sgd_100', per100: true }, { key: 'sek_sgd' }, { key: 'sek', per100: true }],
    NOK: [{ key: 'nok_sgd_100', per100: true }, { key: 'nok_sgd' }, { key: 'nok', per100: true }],
    SAR: [{ key: 'sar_sgd_100', per100: true }, { key: 'sar_sgd' }, { key: 'sar', per100: true }],
    AED: [{ key: 'aed_sgd_100', per100: true }, { key: 'aed_sgd' }, { key: 'aed', per100: true }],
  };

  Object.entries(mappings).forEach(([currencyCode, options]) => {
    for (const opt of options) {
      if (latest[opt.key] !== undefined && latest[opt.key] !== null) {
        const val = parseFloat(latest[opt.key]);
        if (!isNaN(val) && val > 0) {
          rates[currencyCode] = opt.per100 ? val / 100 : val;
          break;
        }
      }
    }
  });

  return rates;
}
