import { Router, Request, Response, NextFunction } from 'express';
import { ContentService } from './content-service';
import { authMiddleware } from '../../shared/auth-middleware';

export const createContentRouter = (): Router => {
  const router = Router();
  const contentService = new ContentService();

  const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

  // POST /api/vidalis/upload - Register video for processing
  router.post(
    '/upload',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const videoData = req.body.videoData || req.body;
      const result = await contentService.registerVideo(videoData);
      res.status(201).json(result);
    })
  );

  // POST /api/vidalis/videos/from-url - Upload from remote URL
  router.post(
    '/videos/from-url',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const result = await contentService.registerVideo({
        artistId: req.body.artist_id || req.body.artistId,
        sourceUrl: req.body.remote_url || req.body.sourceUrl,
        title: req.body.title,
      });
      res.status(201).json(result);
    })
  );

  // GET /api/vidalis/gallery/:artistId - Get artist's video gallery
  router.get(
    '/gallery/:artistId',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const result = await contentService.getGallery(req.params.artistId, {
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        status: req.query.status as string,
        sort: req.query.sort as any,
      });
      res.json(result);
    })
  );

  // GET /api/vidalis/video/:videoId - Get video details
  router.get(
    '/video/:videoId',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const result = await contentService.getVideo(req.params.videoId);
      res.json(result);
    })
  );

  // PATCH /api/vidalis/video/:videoId - Update video metadata
  router.patch(
    '/video/:videoId',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const result = await contentService.updateVideo(req.params.videoId, req.body);
      res.json(result);
    })
  );

  // DELETE /api/vidalis/video/:videoId - Delete video
  router.delete(
    '/video/:videoId',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      await contentService.deleteVideo(req.params.videoId);
      res.status(204).send();
    })
  );

  // POST /api/vidalis/video/:videoId/retry - Retry failed video processing
  router.post(
    '/video/:videoId/retry',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const result = await contentService.retryVideo(req.params.videoId);
      res.json(result);
    })
  );

  // GET /api/vidalis/video/:videoId/publish-status - Get publish status
  router.get(
    '/video/:videoId/publish-status',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const result = await contentService.getPublishStatus(req.params.videoId);
      res.json(result);
    })
  );

  // GET /api/vidalis/analytics/:videoId - Get video analytics
  router.get(
    '/analytics/:videoId',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const result = await contentService.getAnalytics(req.params.videoId);
      res.json(result);
    })
  );

  // GET /api/vidalis/cloudinary-signature - Get Cloudinary upload signature
  router.get(
    '/cloudinary-signature',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const result = await contentService.getCloudinarySignature({
        folder: req.query.folder as string,
        resourceType: (req.query.resourceType as string) || 'video',
      });
      res.json(result);
    })
  );

  // Webhook endpoint para recibir actualizaciones del backend de procesamiento
  // POST /api/vidalis/webhook/video-processed
  router.post(
    '/webhook/video-processed',
    asyncHandler(async (req: Request, res: Response) => {
      // Verificar X-Webhook-Token en producción
      const result = await contentService.updateVideoFromProcessing(req.body.videoId, {
        cloudinaryUrl: req.body.cloudinaryUrl,
        thumbnailUrl: req.body.thumbnailUrl,
        status: req.body.status,
        viralScore: req.body.viralScore,
        aiCopy: req.body.aiCopy,
        hookSuggestion: req.body.hookSuggestion,
        hashtags: req.body.hashtags,
        error: req.body.error,
      });
      res.json(result);
    })
  );

  return router;
};
