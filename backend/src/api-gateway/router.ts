import { Router } from 'express';
import { createAuthRouter } from '../services/auth/router';
import { createContentRouter } from '../services/content/router';
import { createAnalyticsRouter } from '../services/analytics/router';
import { createGrowthRouter } from '../services/growth/router';
import { socialRouter } from '../services/social/router';

export const apiGatewayRouter = Router();

// Auth Service routes
apiGatewayRouter.use('/vidalis', createAuthRouter());

// Content Service routes
apiGatewayRouter.use('/vidalis', createContentRouter());

// Analytics Service routes
apiGatewayRouter.use('/vidalis', createAnalyticsRouter());

// Growth Service routes
apiGatewayRouter.use('/vidalis', createGrowthRouter());

// Social Service routes
apiGatewayRouter.use('/vidalis/social', socialRouter);

// 404 for API routes
apiGatewayRouter.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});
