import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Logger } from './shared/logger';
import { apiGatewayRouter } from './api-gateway/router';
import { initSupabaseClient } from './config/supabase';
import { initUploadPostClient } from './config/uploadpost';
import { initAIConfig } from './config/ai';

const app = express();
const logger = new Logger('API Gateway');

// Initialize external services
try {
  initSupabaseClient();
  initUploadPostClient();
  initAIConfig();
  logger.info('✅ All external services initialized successfully');
} catch (error) {
  logger.error('❌ Failed to initialize external services', error);
  process.exit(1);
}

// Middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || 'https://vidalis.ai'
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Gateway routes
app.use('/api', apiGatewayRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`Error: ${err.message}`, err);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal server error',
  });
});

const PORT = process.env.API_GATEWAY_PORT || 3000;
app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
});
