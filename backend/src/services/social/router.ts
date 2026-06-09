/**
 * Social Service Router - Vidalis.AI
 *
 * Endpoints para publicación social, programación y analíticas
 */

import { Router, Request, Response } from 'express';
import { SocialService } from './social-service';
import { authMiddleware } from '../../shared/auth-middleware';
import { Logger } from '../../shared/logger';

const router = Router();
const socialService = new SocialService();
const logger = new Logger('SocialRouter');

// Extraer artistId del request
function getArtistId(req: Request): string {
  const userId = (req as any).user?.userId;
  // Por simplicidad, usar userId como artistId (en producción, relación en DB)
  return userId;
}

// ============================================================
// CONECTAR REDES SOCIALES
// ============================================================

/**
 * Obtener URL para conectar redes sociales
 * POST /api/vidalis/social/connect/:artistId
 */
router.post('/connect/:artistId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { artistId } = req.params;
    const { platforms } = req.body;

    const result = await socialService.getConnectUrl(artistId, platforms || []);
    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error(`Failed to get connect URL: ${error.message}`);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// ============================================================
// PUBLICAR VIDEO
// ============================================================

/**
 * Publicar video ahora
 * POST /api/vidalis/social/publish/:videoId
 * Body: { platforms: string[], postType?: string }
 */
router.post('/publish/:videoId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;
    const { platforms, postType } = req.body;
    const artistId = getArtistId(req);

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one platform must be selected',
      });
    }

    const result = await socialService.publishVideo(videoId, artistId, platforms, {
      postType,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error(`Failed to publish video: ${error.message}`);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// ============================================================
// PROGRAMAR VIDEO
// ============================================================

/**
 * Programar publicación de video
 * POST /api/vidalis/social/schedule/:videoId
 * Body: { platforms: string[], scheduleDate: ISO8601, postType?: string }
 */
router.post('/schedule/:videoId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;
    const { platforms, scheduleDate, postType } = req.body;
    const artistId = getArtistId(req);

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one platform must be selected',
      });
    }

    if (!scheduleDate) {
      return res.status(400).json({
        success: false,
        error: 'scheduleDate is required',
      });
    }

    const result = await socialService.scheduleVideo(
      videoId,
      artistId,
      platforms,
      new Date(scheduleDate),
      { postType }
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error(`Failed to schedule video: ${error.message}`);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// ============================================================
// ESTADO DE PUBLICACIÓN
// ============================================================

/**
 * Obtener estado de publicación
 * GET /api/vidalis/social/status/:postId
 */
router.get('/status/:postId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const result = await socialService.getPublishStatus(postId);
    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error(`Failed to get publish status: ${error.message}`);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// ============================================================
// PLATAFORMAS ACTIVAS
// ============================================================

/**
 * Obtener plataformas conectadas del artista
 * GET /api/vidalis/social/platforms/:artistId
 */
router.get('/platforms/:artistId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { artistId } = req.params;

    const platforms = await socialService.getActivePlatforms(artistId);
    res.json({
      success: true,
      data: { platforms },
    });
  } catch (error: any) {
    logger.error(`Failed to get active platforms: ${error.message}`);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// ============================================================
// ANALÍTICAS
// ============================================================

/**
 * Obtener analíticas del video
 * GET /api/vidalis/social/analytics/:videoId
 */
router.get('/analytics/:videoId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;
    const artistId = getArtistId(req);

    const result = await socialService.getVideoAnalytics(videoId, artistId);
    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error(`Failed to get video analytics: ${error.message}`);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Obtener analíticas del perfil
 * GET /api/vidalis/social/profile-analytics/:artistId
 */
router.get('/profile-analytics/:artistId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { artistId } = req.params;

    const result = await socialService.getProfileAnalytics(artistId);
    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error(`Failed to get profile analytics: ${error.message}`);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
});

export const socialRouter = router;
