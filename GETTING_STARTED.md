# Vidalis.AI Web - Getting Started

## 📦 Estructura del Proyecto

```
vidalis-web/
├── backend/                 # Backend con microservicios
│   ├── src/
│   │   ├── api-gateway/    # Gateway API principal
│   │   ├── services/       # Microservicios (auth, content, etc)
│   │   └── shared/         # Código compartido
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                # Frontend React + TypeScript
│   ├── src/
│   │   ├── features/       # Funcionalidades
│   │   ├── services/       # Servicios API
│   │   ├── store/          # Estado global (Zustand)
│   │   └── components/     # Componentes reutilizables
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
│
├── PROJECT_ANALYSIS.md      # Análisis completo del proyecto móvil
├── GETTING_STARTED.md       # Este archivo
└── docs/                    # Documentación de APIs

```

---

## 🚀 Quick Start

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend correrá en `http://localhost:3000`

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend correrá en `http://localhost:5173`

---

## 📋 Lo que se ha completado (Fase 1)

### ✅ Análisis y Arquitectura
- [x] Análisis completo del proyecto móvil Flutter
- [x] Diseño de arquitectura de microservicios
- [x] Documentación de endpoints existentes
- [x] Plan de implementación por fases

### ✅ Backend
- [x] Estructura de proyecto Node.js + TypeScript
- [x] Configuración de ESLint, Prettier, TypeScript
- [x] API Gateway con enrutamiento
- [x] Auth Service funcional con:
  - Login/Register con email y contraseña
  - Google OAuth
  - JWT tokens (access + refresh)
  - Gestión de usuarios
  - Compra de sparks
  - Canje de cupones

### ✅ Frontend
- [x] Estructura de proyecto React + TypeScript con Vite
- [x] Tailwind CSS configurado con tema personalizado
- [x] Zustand para estado global (auth)
- [x] Axios client con interceptores
- [x] Rutas protegidas
- [x] Páginas base:
  - Login
  - Register
  - Dashboard

---

## 🔄 Próximos Pasos (Fases 2-6)

### Fase 2: Content Management
- [ ] Content Service (CRUD videos)
- [ ] Upload de videos
- [ ] Galería de videos
- [ ] Integración con Cloudinary

### Fase 3: Analytics
- [ ] Analytics Service
- [ ] Dashboards con gráficos
- [ ] Estadísticas en tiempo real

### Fase 4: Growth Pro
- [ ] Growth Service (features IA)
- [ ] Insights de crecimiento
- [ ] Best time to post
- [ ] A/B testing
- [ ] Ad copy generation

### Fase 5: Social Integration
- [ ] Social Service
- [ ] Conectar plataformas (TikTok, Instagram, etc)
- [ ] Publicación de videos
- [ ] Scheduler

### Fase 6: Polish & Deploy
- [ ] Testing completo
- [ ] Optimización de performance
- [ ] Documentación
- [ ] Deployment a producción

---

## 🔐 Autenticación

La autenticación está implementada con JWT:

```
1. User envía credentials
2. Backend valida y genera JWT + Refresh Token
3. Frontend almacena tokens en localStorage
4. Requests incluyen Authorization: Bearer <token>
5. Token expira cada 24h, refresh valido 7 días
```

**Test de Login:**
```bash
curl -X POST http://localhost:3000/api/vidalis/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 📚 API Endpoints Implementados

### Auth Service
```
POST   /api/vidalis/login               # Login
POST   /api/vidalis/register            # Registro
POST   /api/vidalis/google-login        # Google OAuth
GET    /api/vidalis/user/:userId        # Obtener usuario (auth)
PATCH  /api/vidalis/user/:userId        # Actualizar usuario (auth)
POST   /api/vidalis/purchase-sparks     # Comprar sparks (auth)
POST   /api/vidalis/redeem-coupon       # Canjear cupón (auth)
POST   /api/vidalis/refresh-token       # Refrescar token
```

### Content Service (próximamente)
```
POST   /api/vidalis/videos/register
GET    /api/vidalis/gallery/:artistId
GET    /api/vidalis/video/:videoId
PATCH  /api/vidalis/video/:videoId
DELETE /api/vidalis/video/:videoId
...
```

---

## 🛠️ Stack Tecnológico

### Backend
- **Runtime:** Node.js 20 LTS
- **Framework:** Express.js
- **Language:** TypeScript
- **DB:** PostgreSQL (próximamente)
- **ORM:** Prisma (próximamente)
- **Auth:** JWT + bcrypt
- **Testing:** Jest (próximamente)

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS
- **State:** Zustand
- **HTTP:** Axios
- **Routing:** React Router
- **Data Fetching:** React Query
- **Testing:** Vitest (próximamente)

---

## 📖 Documentación Adicional

- **PROJECT_ANALYSIS.md** - Análisis detallado del proyecto móvil y arquitectura
- **backend/README.md** - Documentación del backend
- **backend/src/services/auth/README.md** - Documentación del Auth Service
- **frontend/README.md** - Documentación del frontend

---

## 💡 Notas Importantes

1. **Database:** El backend actualmente usa Maps en memoria. Implementar PostgreSQL + Prisma en Fase 2.

2. **Cloudinary:** Mantener integración existente para upload de videos.

3. **Backend Existente:** Los microservicios web actúan como intermediarios con el backend actual de processing (IA).

4. **Real-time:** Considerar WebSockets (Socket.io) para notificaciones de procesamiento.

5. **Escalabilidad:** Cada microservicio puede escalarse independientemente.

---

## 🤝 Recomendaciones para Desarrollo

1. Seguir la arquitectura de microservicios
2. Mantener separación de concerns
3. Implementar tests unitarios y E2E
4. Documentar APIs con Swagger/OpenAPI
5. Usar feature flags para rollouts graduales
6. Implementar logging centralizado
7. Configurar CI/CD pipeline

---

## 📞 Contacto & Soporte

Para preguntas o issues, contactar al equipo de desarrollo.

---

**Versión:** 1.0.0  
**Última actualización:** Junio 2026
