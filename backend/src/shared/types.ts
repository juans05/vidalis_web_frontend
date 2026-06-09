export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
  timestamp: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
  accountType: 'artist' | 'agency';
  artistId?: string;
  iat?: number;
  exp?: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export enum VideoStatus {
  ANALYZING = 'analyzing',
  PROCESSING = 'processing',
  READY = 'ready',
  NEEDS_REVIEW = 'needs_review',
  PUBLISHED = 'published',
  SCHEDULED = 'scheduled',
  ERROR = 'error',
}

export enum AccountType {
  ARTIST = 'artist',
  AGENCY = 'agency',
}

export enum Plan {
  MINI = 'mini',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}
