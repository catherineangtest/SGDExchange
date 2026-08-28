import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { masRouter } from './api/masExchangeRates.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests
  app.use(express.json());

  // API Routes MUST be registered BEFORE Vite middleware
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'SGD Exchange API Gateway',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount MAS Exchange Rates backend router
  app.use('/api/mas', masRouter);

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SGD Exchange Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
