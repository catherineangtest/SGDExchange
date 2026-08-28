import { Request, Response, Router } from 'express';

const MAS_API_ENDPOINT =
  'https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610ora/exchange_rates_end_of_period_daily/views/exchange_rates_end_of_period_daily';

export const masRouter = Router();

/**
 * GET /api/mas/exchange-rates-daily
 * Connects to Monetary Authority of Singapore (MAS) Daily SGD Exchange Rates (End of Period)
 * 
 * GUARDRAILS ENFORCED:
 * - Credentials (ACCOUNT_KEY) are read ONLY inside repo-root api/ via process.env
 * - Missing credential returns HTTP 500 with {"error":"credential not configured"}
 * - Never calls the MAS upstream API without a valid AccountKey header
 */
masRouter.get('/exchange-rates-daily', async (req: Request, res: Response) => {
  // Read credential only within api/ directory
  const accountKey = process.env.ACCOUNT_KEY || process.env.MAS_ACCOUNT_KEY || process.env.MAS_API_KEY;

  if (!accountKey || accountKey.trim() === '') {
    return res.status(500).json({
      error: 'credential not configured',
      message: 'ACCOUNT_KEY environment variable is required to connect to the MAS Exchange Rates API service.',
    });
  }

  try {
    // Forward any query parameters (e.g., limit, rows, sort, filters)
    const targetUrl = new URL(MAS_API_ENDPOINT);
    
    // Copy query parameters from client request if present
    Object.entries(req.query).forEach(([key, value]) => {
      if (typeof value === 'string') {
        targetUrl.searchParams.set(key, value);
      }
    });

    // Call MAS API endpoint with the required AccountKey header
    const apiResponse = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        'AccountKey': accountKey.trim(),
        'Accept': 'application/json',
      },
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return res.status(apiResponse.status).json({
        error: `MAS API returned status ${apiResponse.status}`,
        details: errorText,
      });
    }

    const data = await apiResponse.json();
    return res.json(data);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown upstream error';
    return res.status(502).json({
      error: 'Failed to communicate with MAS exchange rates service',
      details: errorMessage,
    });
  }
});

/**
 * GET /api/mas/status
 * Health and configuration check for MAS API service
 */
masRouter.get('/status', (req: Request, res: Response) => {
  const accountKey = process.env.ACCOUNT_KEY || process.env.MAS_ACCOUNT_KEY || process.env.MAS_API_KEY;
  const isConfigured = Boolean(accountKey && accountKey.trim() !== '');

  res.json({
    service: 'Monetary Authority of Singapore (MAS) Exchange Rates Service',
    endpoint: MAS_API_ENDPOINT,
    isConfigured,
    status: isConfigured ? 'ready' : 'awaiting_credential',
  });
});
