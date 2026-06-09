# Auth Service

Servicio de autenticación centralizado para Vidalis.AI.

## Endpoints

### `POST /api/vidalis/login`
Login con email y contraseña.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt.token.here",
  "refreshToken": "refresh.token.here",
  "expiresIn": 86400,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "accountType": "artist",
    "plan": "mini",
    "sparksBalance": 0,
    "onboardingCompleted": false,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### `POST /api/vidalis/register`
Registrar nuevo usuario.

**Request:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "birthDate": "1990-01-01",
  "accountType": "artist"
}
```

**Response:** (mismo que login)

### `POST /api/vidalis/google-login`
Login/registro automático con Google.

**Request:**
```json
{
  "idToken": "google.id.token",
  "platform": "web"
}
```

**Response:** (mismo que login)

### `GET /api/vidalis/user/:userId`
Obtener datos del usuario. Requiere autenticación.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "User Name",
  "accountType": "artist",
  "plan": "mini",
  "sparksBalance": 0,
  "onboardingCompleted": false,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### `PATCH /api/vidalis/user/:userId`
Actualizar perfil del usuario. Requiere autenticación.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "name": "New Name",
  "email": "newemail@example.com",
  "birthDate": "1990-01-01"
}
```

**Response:** (mismo que GET user)

### `POST /api/vidalis/purchase-sparks`
Comprar sparks (créditos). Requiere autenticación.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "amount": 100
}
```

**Response:**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "User Name",
  "accountType": "artist",
  "plan": "mini",
  "sparksBalance": 100,
  "onboardingCompleted": false,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### `POST /api/vidalis/redeem-coupon`
Canjear código cupón. Requiere autenticación.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "code": "COUPON2024"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Coupon COUPON2024 redeemed successfully",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "accountType": "artist",
    "plan": "mini",
    "sparksBalance": 100,
    "onboardingCompleted": false,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### `POST /api/vidalis/refresh-token`
Refrescar token JWT.

**Request:**
```json
{
  "refreshToken": "refresh.token.here"
}
```

**Response:** (mismo que login)

## Modelos

### User
```typescript
{
  id: string;
  email: string;
  name: string;
  accountType: 'artist' | 'agency';
  artistId?: string;
  plan: string; // 'mini', 'pro', 'enterprise'
  sparksBalance: number;
  onboardingCompleted: boolean;
  createdAt: Date;
}
```

### Plan Types
- **mini**: Plan gratuito limitado
- **pro**: Plan de pago con más features
- **enterprise**: Plan personalizado para agencias
