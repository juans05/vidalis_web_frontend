export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code?: string) {
    super(400, message, code || 'VALIDATION_ERROR');
  }
}

export class AuthError extends AppError {
  constructor(message: string, code?: string) {
    super(401, message, code || 'AUTH_ERROR');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string, code?: string) {
    super(403, message, code || 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, code?: string) {
    super(404, message, code || 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code?: string) {
    super(409, message, code || 'CONFLICT');
  }
}

export class InternalError extends AppError {
  constructor(message: string, code?: string) {
    super(500, message, code || 'INTERNAL_ERROR');
  }
}
