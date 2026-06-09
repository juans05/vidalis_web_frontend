# Vidalis.AI - Análisis del Proyecto Móvil y Arquitectura Web

## 📱 Resumen del Proyecto Móvil

**Framework:** Flutter
**Punto de Entrada:** `lib/main.dart`
**Base URL Backend:** https://backend-vidalis-production.up.railway.app
**Patrón de Estado:** Provider (ChangeNotifier)
**Almacenamiento Local:** SharedPreferences

---

## 🏗️ Estructura Actual (Mobile)

### Core Services
1. **ApiService** - Cliente HTTP centralizado
   - Métodos: GET, POST, PATCH, DELETE
   - Autenticación: Bearer Token
   - Timeout: 30s (excepto audit 120s, uploads 10min)
   - Manejo de errores y logging

2. **StorageService** - Persistencia local
   - Usuario, token, configuración
   - API URL configurable

3. **UploadQueue** - Gestión de uploads
   - Cola de un solo elemento activo
   - Progreso y estado del upload
   - Persistencia de uploads pendientes

4. **VideoCompressor** - Compresión local
   - Reduce tamaño antes de subir a backend

5. **LocalNotifier** - Notificaciones push
   - Integración con `flutter_local_notifications`
   - Navegación automática al tocar notificación

6. **CrashLogger** - Logging de errores

### Modelos de Datos Principales

#### UserModel
```dart
- id: String
- email: String
- name: String
- accountType: 'artist' | 'agency'
- artistId?: String
- onboardingCompleted: bool
- token?: String
- plan?: String (Mini, Pro, etc)
- birthDate?: String
- sparksBalance: int
```

#### VideoModel
```dart
- id: String
- artistId: String
- title?: String
- cloudinaryUrl?: String
- thumbnailUrl?: String
- status: 'processing' | 'ready' | 'published' | 'scheduled' | 'error'
- viralScore?: double
- hookSuggestion?: String
- aiCopy?: String
- hashtags: String[]
- platforms: String[]
- scheduledAt?: DateTime
- postId?: String (ayrshare_post_id)
- processedUrl?: String
- createdAt: DateTime
```

#### StatsModel
```dart
- totalFollowers: int
- followersGrowth: double
- totalViews: int
- viewsGrowth: double
- totalLikes: int
- totalComments: int
- totalShares: int
- totalSaves: int
- publishedVideos: int
- avgViralScore: double
- growthData: GrowthPoint[]
- monthlyUsage: int
- monthlyLimit: int
- planName: String
- platformBreakdown: Map<String, int>
```

#### AnalyticsModel
```dart
- videoId: String
- views: int
- likes: int
- comments: int
- shares: int
- saves: int
- reach: int
- impressions: int
- engagementRate: double
- history: VideoSnapshot[]
- platformBreakdown: Map<String, int>
```

### Features Principales

1. **Auth**
   - Email/Password login
   - Google OAuth login
   - Registro de usuario
   - Gestión de plan/suscripción

2. **Content Management**
   - Subida de videos desde cámara o galería
   - Compresión automática
   - Galería de videos del artista
   - Detalle del video con edición de metadatos
   - Eliminación de videos

3. **Analytics**
   - Estadísticas globales del artista
   - Analíticas por video
   - Gráficos con fl_chart
   - Historial de crecimiento

4. **Growth Pro** (Features premium)
   - Insights de crecimiento
   - Best time to post
   - Content strategy recomendaciones
   - Viral score history
   - A/B testing de variantes
   - Ad copy generation

5. **Social Integration**
   - Conectar plataformas (TikTok, Instagram, YouTube, Facebook)
   - Sincronizar estadísticas
   - Publicar videos en múltiples plataformas
   - Programar publicaciones (scheduler)

6. **Profile & Monetización**
   - Gestión de perfil
   - Sparks market (compra de créditos)
   - In-app purchases
   - Canje de cupones

7. **Artist Management** (Para agencias)
   - Crear/eliminar artistas
   - Gestionar múltiples artistas desde una agencia
   - Audit profundo de artistas

---

## API Endpoints Existentes

### Auth
- `POST /api/vidalis/login` - Email/password login
- `POST /api/vidalis/google-login` - Google OAuth
- `POST /api/vidalis/refine-copy` - Refinar texto con IA

### Content
- `POST /api/vidalis/upload` - Registrar video para procesar
- `POST /api/vidalis/videos/from-url` - Upload desde URL remota
- `GET /api/vidalis/gallery/:artistId` - Obtener galería (con pagination)
- `GET /api/vidalis/video/:videoId` - Detalle del video
- `PATCH /api/vidalis/video/:videoId` - Actualizar metadatos
- `POST /api/vidalis/video/:videoId/retry` - Reintentar procesamiento
- `DELETE /api/vidalis/video/:videoId` - Eliminar video
- `GET /api/vidalis/video/:videoId/publish-status` - Estado de publicación

### Publishing & Scheduling
- `POST /api/vidalis/publish-now/:videoId` - Publicar inmediatamente
- `POST /api/vidalis/schedule/:videoId` - Programar publicación

### Analytics
- `GET /api/vidalis/stats/:agencyId` - Estadísticas globales
- `GET /api/vidalis/analytics/:videoId` - Analíticas de video

### Social
- `GET /api/vidalis/social-status/:artistId` - Plataformas conectadas
- `GET /api/vidalis/connect-social/:artistId` - URL para conectar social
- `POST /api/vidalis/artists/:artistId/sync` - Sincronizar estadísticas

### Artists
- `GET /api/vidalis/artists/:agencyId` - Lista de artistas
- `POST /api/vidalis/artists` - Crear artista
- `DELETE /api/vidalis/artists/:artistId` - Eliminar artista
- `PATCH /api/vidalis/artists/:artistId/style` - Actualizar estilo creativo
- `POST /api/vidalis/artists/:artistId/audit` - Audit profundo (120s timeout)

### Growth Pro
- `GET /api/vidalis/artists/:artistId/growth/insights` - Insights
- `GET /api/vidalis/artists/:artistId/growth/best-time` - Best time data
- `GET /api/vidalis/artists/:artistId/growth/strategy` - Content strategy
- `GET /api/vidalis/artists/:artistId/growth/viral-history` - Viral scores
- `POST /api/vidalis/videos/:videoId/ab-variants` - Generar variantes
- `GET /api/vidalis/videos/:videoId/ab-result` - Resultados A/B
- `POST /api/vidalis/videos/:videoId/ad-copy` - Generar ad copy

### Monetización
- `POST /api/vidalis/purchase-sparks` - Comprar sparks
- `POST /api/vidalis/redeem-coupon` - Canjear cupón

### Infraestructura
- `GET /api/vidalis/cloudinary-signature` - Firma para upload directo a Cloudinary
- `GET /api/vidalis/config/:key` - Configuración pública

---

## 🎯 Arquitectura de Microservicios para Web

### Estructura de Carpetas Propuesta

```
vidalis-web/
├── backend/
│   ├── services/
│   │   ├── auth-service/          # Autenticación, usuarios, planes
│   │   ├── content-service/       # Videos, galería, metadatos
│   │   ├── analytics-service/     # Estadísticas, métricas
│   │   ├── growth-service/        # Growth pro features, IA
│   │   └── social-service/        # Integración con redes sociales
│   ├── shared/                    # Código compartido (middleware, utils)
│   └── api-gateway/               # Gateway principal (enruta a microservicios)
│
├── frontend/
│   ├── src/
│   │   ├── services/              # Capa de servicios (llamadas a APIs)
│   │   ├── features/              # Features por dominio
│   │   ├── components/            # Componentes reutilizables
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── store/                 # Estado global (Zustand/Redux)
│   │   └── utils/                 # Utilidades
│   └── public/
│
└── docs/                          # Documentación de APIs
```

---

## 🔌 Microservicios Detallados

### 1. Auth Service
**Puerto:** 3001
**Responsabilidades:**
- Registro y login de usuarios
- Validación de credenciales
- Generación y validación de JWT
- Google OAuth
- Gestión de planes/suscripciones
- Gestión de sparks

**Endpoints:**
```
POST   /login                      # Login email/password
POST   /register                   # Registro nuevo usuario
POST   /google-login               # Login con Google
POST   /refresh-token              # Refrescar JWT
GET    /user/:userId               # Obtener datos usuario
PATCH  /user/:userId               # Actualizar perfil
POST   /purchase-sparks            # Comprar sparks
POST   /redeem-coupon              # Canjear cupón
```

**Base de Datos:**
- Users table
- Plans table
- Subscriptions table
- Sparks_transactions table

---

### 2. Content Service
**Puerto:** 3002
**Responsabilidades:**
- Gestión de videos
- Procesamiento (queda en backend existente, este servicio coordina)
- Galería y metadatos
- Gestión de estados del video

**Endpoints:**
```
POST   /videos/register            # Registrar video nuevo
POST   /videos/from-url            # Upload desde URL
GET    /videos/gallery/:artistId   # Galería (con filtros/pagination)
GET    /videos/:videoId            # Detalle del video
PATCH  /videos/:videoId            # Actualizar metadatos
DELETE /videos/:videoId            # Eliminar video
POST   /videos/:videoId/retry      # Reintentar procesamiento
GET    /videos/:videoId/publish-status
```

**Base de Datos:**
- Videos table
- Video_metrics table (caché de métricas)

---

### 3. Analytics Service
**Puerto:** 3003
**Responsabilidades:**
- Estadísticas de artistas
- Analíticas por video
- Cálculo de métricas agregadas
- Historial de snapshots

**Endpoints:**
```
GET    /stats/:agencyId            # Estadísticas globales
GET    /stats/:agencyId?artistId=X # Estadísticas por artista
GET    /analytics/:videoId         # Analíticas detalladas del video
GET    /growth/:artistId           # Datos de crecimiento
```

**Base de Datos:**
- Analytics_snapshots table (historial)
- Aggregated_stats table (caché)

---

### 4. Growth Service
**Puerto:** 3004
**Responsabilidades:**
- Features de Growth Pro (IA)
- Generación de insights
- Recomendaciones de mejor hora
- Content strategy
- A/B testing
- Ad copy generation

**Endpoints:**
```
GET    /insights/:artistId         # Insights de crecimiento
GET    /best-time/:artistId        # Mejor hora para publicar
GET    /strategy/:artistId         # Content strategy recomendaciones
GET    /viral-history/:artistId    # Historial de viral scores
POST   /ab-variants/:videoId       # Generar variantes
GET    /ab-result/:videoId         # Resultados A/B
POST   /ad-copy/:videoId           # Generar ad copy
POST   /refine-copy                # Refinar texto con IA
```

**Integraciones:**
- OpenAI/Claude para IA
- Análisis de datos históricos
- Machine learning para predicciones

---

### 5. Social Service
**Puerto:** 3005
**Responsabilidades:**
- Integración con redes sociales
- Sincronización de estadísticas
- Publicación de videos
- Programación de posts

**Endpoints:**
```
GET    /status/:artistId           # Plataformas conectadas
GET    /connect-url/:artistId      # URL OAuth para conectar
POST   /sync/:artistId             # Sincronizar estadísticas
POST   /publish/:videoId           # Publicar video
POST   /schedule/:videoId          # Programar publicación
```

**Integraciones:**
- Ayrshare API
- TikTok API
- Instagram Graph API
- YouTube API
- Facebook API

---

### 6. API Gateway
**Puerto:** 3000 (público)
**Responsabilidades:**
- Enrutamiento a microservicios
- Autenticación (validar JWT)
- Rate limiting
- Logging y monitoring
- CORS

---

## 🎨 Frontend Web

**Stack:**
- React 18+
- TypeScript
- Vite (build tool)
- TailwindCSS (estilos)
- Zustand (state management)
- React Query (data fetching)
- React Router (routing)

**Estructura:**
```
src/
├── features/
│   ├── auth/           # Login, register, perfil
│   ├── dashboard/      # Dashboard principal
│   ├── content/        # Upload, galería, detalle
│   ├── analytics/      # Estadísticas, gráficos
│   ├── growth/         # Growth pro features
│   ├── social/         # Conectar redes sociales
│   └── artists/        # Gestión de artistas (agencias)
├── services/
│   ├── api.ts          # Cliente HTTP
│   ├── auth.ts         # Auth service
│   ├── content.ts      # Content service
│   ├── analytics.ts    # Analytics service
│   ├── growth.ts       # Growth service
│   └── social.ts       # Social service
├── store/              # Zustand stores
├── components/         # Componentes compartidos
└── utils/              # Utilidades
```

---

## 📋 Plan de Implementación

### Fase 1: Setup y Auth (Semana 1)
- [ ] Crear estructura backend con Node.js/Express
- [ ] Crear estructura frontend con React + TypeScript
- [ ] Implementar Auth Service (login, register, JWT)
- [ ] Implementar autenticación en frontend
- [ ] Testing básico

### Fase 2: Content Management (Semana 2)
- [ ] Implementar Content Service (CRUD videos)
- [ ] Implementar upload y galería en frontend
- [ ] Integración con Cloudinary

### Fase 3: Analytics (Semana 3)
- [ ] Implementar Analytics Service
- [ ] Crear dashboards con gráficos
- [ ] Estadísticas en tiempo real

### Fase 4: Growth Pro (Semana 4)
- [ ] Implementar Growth Service (IA features)
- [ ] Insights, best time, strategy
- [ ] A/B testing, ad copy

### Fase 5: Social Integration (Semana 5)
- [ ] Implementar Social Service
- [ ] Conectar redes sociales
- [ ] Publicación y programación

### Fase 6: Pulido y Deploy (Semana 6)
- [ ] Testing completo
- [ ] Performance optimization
- [ ] Documentación
- [ ] Deploy a producción

---

## 🔄 Flujos de Datos Principales

### Upload de Video
```
Mobile/Web → API Gateway
           → Content Service (registra video en DB)
           → Envía a Backend existente para procesar
           → Backend procesa (comprime, analiza con IA, genera thumbnail)
           → Backend actualiza estado en Content Service
           → Notificación al cliente (socket.io o polling)
```

### Publicación en Redes Sociales
```
User selecciona platforms → Content Service
                          → Social Service
                          → Ayrshare API
                          → Red social (TikTok, Instagram, etc)
                          → Actualizar postId en video
```

### Estadísticas
```
Backend existente genera eventos → Analytics Service
                                 → Almacena snapshots
                                 → Agrega datos por período
                                 → Frontend consulta Analytics Service
```

---

## 🔐 Seguridad

- JWT con refresh tokens
- CORS configurado
- Rate limiting
- Validación de inputs
- Encriptación de datos sensibles
- HTTPS en producción

---

## 📊 Base de Datos

**Opción 1: PostgreSQL** (recomendado)
- Más robusto para datos relacionales
- Soporte para JSON
- Transacciones ACID

**Opción 2: MongoDB**
- Más flexible para evolución rápida
- Mejor para documentos anidados

---

## 🚀 Tecnologías Recomendadas

### Backend
- **Runtime:** Node.js 20 LTS
- **Framework:** Express.js o NestJS
- **DB:** PostgreSQL con Prisma ORM
- **Auth:** jsonwebtoken, bcrypt
- **Cache:** Redis
- **Message Queue:** Bull (Redis-based)
- **Container:** Docker
- **Logging:** Winston
- **Testing:** Jest

### Frontend
- **Framework:** React 18+
- **Language:** TypeScript
- **Build:** Vite
- **UI:** TailwindCSS + Shadcn/ui
- **State:** Zustand
- **Data Fetching:** React Query / TanStack Query
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts (similar a fl_chart)
- **Testing:** Vitest + React Testing Library

---

## 📝 Notas Importantes

1. **Cloudinary Integration:** El servicio actual usa Cloudinary para almacenar videos. Mantener integración.
2. **Backend Existente:** Los microservicios web actúan como intermediarios entre el frontend y el backend existente.
3. **Real-time:** Considerar WebSockets (Socket.io) para notificaciones en tiempo real.
4. **Escalabilidad:** Cada microservicio puede escalarse independientemente.
5. **Versionado de API:** Considerar `/api/v1/` para cambios futuros.

