import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from './auth-service';
import { authMiddleware } from '../../shared/auth-middleware';
import { AppError } from '../../shared/errors';

export const createAuthRouter = (): Router => {
  const router = Router();
  const authService = new AuthService();

  // Wrapper para manejo de errores
  const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

  // POST /api/vidalis/login
  router.post('/login',
    asyncHandler(async (req: Request, res: Response) => {
      const result = await authService.login(req.body);
      res.json(result);
    })
  );

  // POST /api/vidalis/register
  router.post('/register',
    asyncHandler(async (req: Request, res: Response) => {
      const result = await authService.register(req.body);
      res.json(result);
    })
  );

  // POST /api/vidalis/google-login
  router.post('/google-login',
    asyncHandler(async (req: Request, res: Response) => {
      const result = await authService.googleLogin(req.body);
      res.json(result);
    })
  );

  // GET /api/vidalis/user/:userId
  router.get('/user/:userId',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const result = await authService.getUser(req.params.userId);
      res.json(result);
    })
  );

  // PATCH /api/vidalis/user/:userId
  router.patch('/user/:userId',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const result = await authService.updateUser(req.params.userId, req.body);
      res.json(result);
    })
  );

  // POST /api/vidalis/purchase-sparks
  router.post('/purchase-sparks',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      if (!req.auth) throw new Error('No auth payload');
      const result = await authService.purchaseSparks(req.auth.userId, req.body);
      res.json(result);
    })
  );

  // POST /api/vidalis/redeem-coupon
  router.post('/redeem-coupon',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      if (!req.auth) throw new Error('No auth payload');
      const result = await authService.redeemCoupon(req.auth.userId, req.body);
      res.json(result);
    })
  );

  // POST /api/vidalis/refresh-token
  router.post('/refresh-token',
    asyncHandler(async (req: Request, res: Response) => {
      const result = await authService.refreshToken(req.body.refreshToken);
      res.json(result);
    })
  );

  return router;
};
