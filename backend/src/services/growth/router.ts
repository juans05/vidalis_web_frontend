import { Router, Request, Response, NextFunction } from 'express';
import { GrowthService } from './growth-service';
import { authMiddleware } from '../../shared/auth-middleware';

export const createGrowthRouter = (): Router => {
  const router = Router();
  const growthService = new GrowthService();

  const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

  // GET /api/vidalis/artists/:artistId/growth/insights
  router.get(
    '/artists/:artistId/growth/insights',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const result = await growthService.getInsights(req.params.artistId);
      res.json(result);
    })
  );

  // GET /api/vidalis/artists/:artistId/growth/best-time
  router.get(
    '/artists/:artistId/growth/best-time',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const result = await growthService.getBestTime(req.params.artistId);
      res.json(result);
    })
  );

  // GET /api/vidalis/artists/:artistId/growth/strategy
  router.get(
    '/artists/:artistId/growth/strategy',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const result = await growthService.getStrategy(req.params.artistId);
      res.json(result);
    })
  );

  // GET /api/vidalis/artists/:artistId/growth/viral-history
  router.get(
    '/artists/:artistId/growth/viral-history',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const result = await growthService.getViralHistory(req.params.artistId);
      res.json(result);
    })
  );

  // POST /api/vidalis/videos/:videoId/ab-variants
  router.post(
    '/videos/:videoId/ab-variants',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const result = await growthService.generateABVariants(req.params.videoId);
      res.status(201).json(result);
    })
  );

  // GET /api/vidalis/videos/:videoId/ab-result
  router.get(
    '/videos/:videoId/ab-result',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const result = await growthService.getABResult(req.params.videoId);
      res.json(result);
    })
  );

  // POST /api/vidalis/videos/:videoId/ad-copy
  router.post(
    '/videos/:videoId/ad-copy',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const result = await growthService.generateAdCopy(req.params.videoId);
      res.json(result);
    })
  );

  // POST /api/vidalis/refine-copy
  router.post(
    '/refine-copy',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const result = await growthService.refineCopy({
        text: req.body.text,
        artistId: req.body.artist_id || req.body.artistId,
      });
      res.json({ refined: result });
    })
  );

  return router;
};
