import { Router, Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics-service';
import { authMiddleware } from '../../shared/auth-middleware';

export const createAnalyticsRouter = (): Router => {
  const router = Router();
  const analyticsService = new AnalyticsService();

  const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

  // GET /api/vidalis/stats/:agencyId - Get agency/artist stats
  router.get(
    '/stats/:agencyId',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const result = await analyticsService.getStats(
        req.params.agencyId,
        req.query.artistId as string
      );
      res.json(result);
    })
  );

  // GET /api/vidalis/analytics/:videoId - Get video analytics
  router.get(
    '/analytics/:videoId',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const result = await analyticsService.getAnalytics(req.params.videoId);
      res.json(result);
    })
  );

  return router;
};
